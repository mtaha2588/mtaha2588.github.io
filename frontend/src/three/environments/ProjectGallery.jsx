import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DoubleSide,
  EdgesGeometry,
  PlaneGeometry,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from "three";
import projects from "../../data/projects.json";
import { EXHIBIT_LIST } from "../exhibits/layout";
import { HTML_LAYER } from "../common/htmlLayer";
import { scrollToSection } from "../../hooks/useScrollStations";
import { hrefFor, navigateTo } from "../../lib/navigate";
import EnvGroup from "./EnvGroup";
import HoloRing from "../common/HoloRing";
import { ENVIRONMENTS } from "./layout";

const ENV = ENVIRONMENTS.gallery;
const BASE = import.meta.env.BASE_URL;
const W = 5.2; // screen size in world units (16:10, matching the screenshots)
const H = 3.25;
const NEAR = 42; // the gallery wakes up when the camera is closer than this (phones stand further back)

const ACCENT = { cyan: "#ff2a3d", violet: "#ff8a94", electric: "#e11d2e" };

/*
 * Hologram screen: the screenshot with a light holographic tint, scan lines,
 * a slow scanning band, glowing edges, a little RGB split (more on hover, with
 * a horizontal glitch), and a top-down "materialise" sweep when the camera
 * arrives.
 */
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const frag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uHover;
  uniform float uReveal;
  uniform float uSeed;
  uniform vec3 uTint;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    // Hover glitch: a few horizontal slices jump sideways for a moment.
    float slice = floor(uv.y * 24.0);
    float g = step(0.93, hash(slice + floor(uTime * 9.0) + uSeed)) * uHover;
    uv.x += (hash(slice * 3.1 + uTime) - 0.5) * 0.035 * g;

    float split = 0.0016 + uHover * 0.0035;
    vec3 col;
    col.r = texture2D(uMap, uv + vec2(split, 0.0)).r;
    col.g = texture2D(uMap, uv).g;
    col.b = texture2D(uMap, uv - vec2(split, 0.0)).b;

    col = mix(col, col * uTint * 1.35, 0.16);
    float scan = 0.9 + 0.1 * sin(vUv.y * 340.0 + uTime * 3.0);
    float band = exp(-pow((vUv.y - fract(1.0 - uTime * 0.09 - uSeed)) * 18.0, 2.0));
    float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y) * 1.6);
    float edge = smoothstep(0.035, 0.0, edgeDist);

    // Materialise from the top; a bright line marks the front.
    float front = 1.0 - uReveal * 1.08;
    float shown = smoothstep(front - 0.01, front + 0.01, vUv.y);
    float frontLine = exp(-pow((vUv.y - front) * 70.0, 2.0)) * step(uReveal, 0.999);

    float bright = 0.8 + 0.3 * uHover;
    vec3 outCol = col * bright * scan + uTint * (edge * (0.55 + uHover * 0.6) + band * 0.12 + frontLine * 1.4);
    gl_FragColor = vec4(outCol, (0.94 * shown + frontLine) * uReveal);
  }
`;

/** Poster for projects without a screenshot: title, category, status on a dark holo grid. */
function posterTexture(project, accent) {
  const c = document.createElement("canvas");
  c.width = 960;
  c.height = 600;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 960, 600);
  grad.addColorStop(0, "#120608");
  grad.addColorStop(1, "#0b0b0c");
  g.fillStyle = grad;
  g.fillRect(0, 0, 960, 600);
  g.strokeStyle = "rgba(255,255,255,0.08)";
  for (let x = 0; x <= 960; x += 40) g.strokeRect(x, 0, 0.5, 600);
  for (let y = 0; y <= 600; y += 40) g.strokeRect(0, y, 960, 0.5);
  const glow = g.createRadialGradient(720, 170, 10, 720, 170, 380);
  glow.addColorStop(0, `${accent}55`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, 960, 600);

  g.fillStyle = accent;
  g.font = "600 24px 'JetBrains Mono', Consolas, monospace";
  g.fillText(String(project.category || "Project").toUpperCase(), 64, 110);
  g.fillStyle = "#f2f2f3";
  g.font = "700 58px 'Unbounded Variable', 'Segoe UI', sans-serif";
  const words = project.title.split(" ");
  let line = "";
  let y = 200;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (g.measureText(test).width > 820 && line) {
      g.fillText(line, 64, y);
      line = w;
      y += 70;
    } else line = test;
  }
  g.fillText(line, 64, y);
  g.fillStyle = "#a3a3ab";
  g.font = "400 28px Inter, 'Segoe UI', sans-serif";
  (project.highlights || []).slice(0, 3).forEach((h, i) => g.fillText(`• ${h}`, 64, y + 80 + i * 44));
  g.strokeStyle = accent;
  g.lineWidth = 2;
  g.strokeRect(64, 520, 260, 44);
  g.fillStyle = accent;
  g.font = "600 22px 'JetBrains Mono', Consolas, monospace";
  g.fillText(String(project.status || "").toUpperCase(), 82, 549);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function useScreenTexture(project, accent) {
  const [tex, setTex] = useState(() => posterTexture(project, accent));
  useEffect(() => {
    if (!project.thumbnail) return;
    let alive = true;
    new TextureLoader().load(BASE + project.thumbnail, (t) => {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
      if (alive) setTex(t);
      else t.dispose();
    });
    return () => {
      alive = false;
    };
  }, [project.thumbnail]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

const frameGeometry = new EdgesGeometry(new PlaneGeometry(W * 1.025, H * 1.04));
const screenGeometry = new PlaneGeometry(W, H);

function Screen({ project, index, position, rotationY, reduced, showLabel }) {
  const accent = ACCENT[project.accent] ?? ACCENT.cyan;
  const map = useScreenTexture(project, accent);
  const exhibit = EXHIBIT_LIST.find((e) => e.slug === project.slug);
  const group = useRef();
  const label = useRef();
  const [hovered, setHovered] = useState(false);
  const world = useMemo(() => new Vector3(), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uMap: { value: null },
          uTime: { value: 0 },
          uHover: { value: 0 },
          uReveal: { value: 0 },
          uSeed: { value: index * 0.173 },
          uTint: { value: new Color(accent) },
        },
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      }),
    [accent, index],
  );
  useEffect(() => {
    material.uniforms.uMap.value = map;
  }, [map, material]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ camera, clock }, dt) => {
    const u = material.uniforms;
    u.uTime.value = reduced ? 0 : clock.elapsedTime;
    group.current.getWorldPosition(world);
    const near = camera.position.distanceTo(world) < NEAR;
    // Screens light up one after another as the camera arrives.
    const target = near ? 1 : 0;
    const speed = near ? 0.9 : 2.5;
    const delay = near ? index * 0.12 : 0;
    group.current.userData.wait = near ? (group.current.userData.wait ?? 0) + dt : 0;
    if (!near || group.current.userData.wait > delay) {
      u.uReveal.value += (target - u.uReveal.value) * Math.min(1, dt * speed * (reduced ? 20 : 2.2));
    }
    u.uHover.value += ((hovered ? 1 : 0) - u.uHover.value) * Math.min(1, dt * 8);
    const s = 1 + u.uHover.value * 0.05;
    group.current.scale.setScalar(s);
    if (label.current) {
      const o = Math.max(0, (u.uReveal.value - 0.6) / 0.4);
      label.current.style.opacity = o.toFixed(3);
      label.current.style.visibility = o < 0.02 ? "hidden" : "";
    }
  });

  const open = () => navigateTo(`/projects/${project.slug}`);

  return (
    <group position={position} rotation-y={rotationY}>
      <group ref={group}>
        <mesh
          geometry={screenGeometry}
          material={material}
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "";
          }}
        />
        <lineSegments geometry={frameGeometry}>
          <lineBasicMaterial color={accent} transparent opacity={0.55} blending={AdditiveBlending} />
        </lineSegments>
      </group>

      {showLabel && (
        <group position={[0, -H / 2 - 0.42, 0]}>
          <Html portal={HTML_LAYER} center zIndexRange={[8, 0]} transform={false}>
            <div ref={label} style={{ opacity: 0, visibility: "hidden" }} className="pointer-events-auto">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-950/85 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-fg-muted uppercase backdrop-blur">
                {project.links?.demo ? (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan hover:underline"
                  >
                    Live demo ↗
                  </a>
                ) : (
                  exhibit && (
                    <button
                      type="button"
                      onClick={() => scrollToSection(exhibit.sectionId)}
                      className="text-cyan hover:underline"
                    >
                      Live demo
                    </button>
                  )
                )}
                {project.links?.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                    GitHub ↗
                  </a>
                )}
                <a
                  href={hrefFor(`/projects/${project.slug}`)}
                  onClick={(e) => {
                    e.preventDefault();
                    open();
                  }}
                  className="hover:text-fg"
                >
                  Case study →
                </a>
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

/**
 * Curved 3 × 2 wall of holographic screens. Demo projects take the top
 * row; research and ML projects the bottom row.
 */
export default function ProjectGallery({ reduced = false }) {
  const ordered = useMemo(() => {
    const hasDemo = (p) => EXHIBIT_LIST.some((e) => e.slug === p.slug);
    return [...projects].sort((a, b) => Number(!hasDemo(a)) - Number(!hasDemo(b))).slice(0, 6);
  }, []);
  // Portrait screens (phones) get a 2 × 3 wall; the camera pose in layout.js frames it.
  const portrait = useThree((s) => s.size.width < s.size.height);

  return (
    <EnvGroup env={ENV} maxDistance={60}>
      {ordered.map((p, i) => {
        const cols = portrait ? 2 : 3;
        const col = (i % cols) - (cols - 1) / 2;
        const row = Math.floor(i / cols);
        // Columns curve towards the camera; rows stack with room for the labels.
        const position = portrait
          ? [col * 5.4, 9.2 - row * 3.85, -Math.abs(col) * 0.6]
          : [col * 5.95, row === 0 ? 5.6 : 1.25, -Math.abs(col) * 1.25];
        return (
          <Screen
            key={p.slug}
            project={p}
            index={i}
            reduced={reduced}
            position={position}
            rotationY={-col * (portrait ? 0.16 : 0.2)}
            showLabel={!portrait}
          />
        );
      })}
      {/* Projector platform */}
      <group position={[0, -1.2, -0.6]}>
        <HoloRing radius={9.5} width={0.03} dashes={96} reduced={reduced} opacity={0.6} />
        <HoloRing radius={7.6} width={0.02} dashes={48} speed={-0.04} color="#ff8a94" reduced={reduced} opacity={0.5} />
      </group>
    </EnvGroup>
  );
}
