import { exhibits } from "../store/exhibits";
import { scrollToSection } from "../hooks/useScrollStations";

/**
 * "Get a quote" / "Hire me" helper: pre-fills the contact form with a
 * service (and optional message) and scrolls to it.
 */
export function prefillContact(service = "", message = "") {
  exhibits.set({ contactPrefill: { service, message, at: Date.now() } });
  scrollToSection("contact");
}
