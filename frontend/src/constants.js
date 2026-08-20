export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// PLACEHOLDER event date — update once the final event date is locked.
export const EVENT_DATE = new Date("2026-12-18T10:00:00+05:30");

export const IMAGES = {
  logo: "/assets/tkk-logo.png",
  hero: "/assets/hero-arena.jpg",
  villa1: "https://images.pexels.com/photos/4508644/pexels-photo-4508644.jpeg?auto=compress&cs=tinysrgb&w=1200",
  villa2: "https://images.unsplash.com/photo-1756802137448-34617566ac2f?auto=format&fit=crop&w=1200&q=80",
  challenges: "https://images.pexels.com/photos/16966331/pexels-photo-16966331.jpeg?auto=compress&cs=tinysrgb&w=1200",
  mentorRajat: "/assets/mentor-rajat.webp",
  mentorAman: "/assets/mentor-aman.webp",
  mentorDesk: "/assets/mentor-desk.webp",
};

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}
