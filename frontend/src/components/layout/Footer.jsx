import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { profile } from "../../data/profile";
import SocialLinks from "../ui/SocialLinks";

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-display text-lg font-semibold text-fg">{profile.name}</p>
          <p className="mt-1 text-sm text-fg-muted">AI automation · Machine learning · Web development</p>
          <nav aria-label="Footer" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link to={{ pathname: "/", hash: "#services" }} className="text-fg-muted hover:text-fg">
              Services
            </Link>
            <Link to={{ pathname: "/", hash: "#projects" }} className="text-fg-muted hover:text-fg">
              Work
            </Link>
            <Link to="/notes" className="text-fg-muted hover:text-fg">
              Notes
            </Link>
            <Link to={{ pathname: "/", hash: "#contact" }} className="text-fg-muted hover:text-fg">
              Contact
            </Link>
          </nav>
          <p className="mt-4 font-mono text-xs text-fg-subtle">
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SocialLinks />
          <Link
            to={{ pathname: "/", hash: "#home" }}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line-strong text-fg-muted transition-colors hover:border-cyan/50 hover:text-fg"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
