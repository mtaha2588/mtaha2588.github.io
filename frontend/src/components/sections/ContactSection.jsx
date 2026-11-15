import { Briefcase, CalendarCheck, Mail, MessageCircle } from "lucide-react";
import { profile } from "../../data/profile";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import ContactForm from "../contact/ContactForm";
import EnvSection from "./EnvSection";

/** Every contact channel that is filled in profile.js; empty ones are left out. */
function contactChannels() {
  const { links } = profile;
  const ext = { external: true };
  return [
    links.calendly && {
      href: links.calendly,
      label: "Book a call",
      value: "Free intro call",
      Icon: CalendarCheck,
      ...ext,
    },
    profile.email && { href: `mailto:${profile.email}`, label: "Email", value: profile.email, Icon: Mail },
    links.whatsapp && {
      href: `https://wa.me/${links.whatsapp.replace(/\D/g, "")}`,
      label: "WhatsApp",
      value: links.whatsapp,
      Icon: MessageCircle,
      ...ext,
    },
    profile.linkedin && {
      href: profile.linkedin,
      label: "LinkedIn",
      value: "View profile",
      Icon: LinkedinIcon,
      ...ext,
    },
    links.upwork && { href: links.upwork, label: "Upwork", value: "Hire on Upwork", Icon: Briefcase, ...ext },
    links.fiverr && { href: links.fiverr, label: "Fiverr", value: "View gigs", Icon: Briefcase, ...ext },
    profile.github && { href: profile.github, label: "GitHub", value: "View repositories", Icon: GithubIcon, ...ext },
  ].filter(Boolean);
}

export default function ContactSection() {
  const channels = contactChannels();
  return (
    <EnvSection
      id="contact"
      station={10}
      eyebrow="Contact · Free consultation"
      title="Tell me about your project"
      intro="Share what you need and your rough budget. I'll reply with honest feedback, a suggested approach and a fixed quote."
      wide
    >
      {channels.length > 0 && (
        <ul className="mb-6 grid gap-2 sm:grid-cols-2">
          {channels.map(({ href, label, value, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-3 rounded-lg border border-line p-3 transition-colors hover:border-cyan/40 hover:bg-white/[0.03]"
              >
                <Icon size={18} className="shrink-0 text-cyan" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-xs text-fg-subtle">{label}</span>
                  <span className="block truncate text-sm text-fg">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <ContactForm />
      <p className="mt-4 text-xs text-fg-subtle">{profile.timezones}</p>
    </EnvSection>
  );
}
