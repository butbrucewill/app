export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// PLACEHOLDER event date — update once the final event date is locked.
export const EVENT_DATE = new Date("2026-12-18T10:00:00+05:30");

export const IMAGES = {
  logo: "/assets/tkk-logo.png",
  hero: "/assets/hero-arena.jpg",
  villa1: "/assets/villa-1.webp",
  villa2: "/assets/villa-2.webp",
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
