export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// PLACEHOLDER event date — update once the final event date is locked.
export const EVENT_DATE = new Date("2026-12-18T10:00:00+05:30");

export const IMAGES = {
  hero: "https://images.pexels.com/photos/16594725/pexels-photo-16594725.jpeg?auto=compress&cs=tinysrgb&w=1920",
  villa1: "https://images.pexels.com/photos/4508644/pexels-photo-4508644.jpeg?auto=compress&cs=tinysrgb&w=1200",
  villa2: "https://images.unsplash.com/photo-1756802137448-34617566ac2f?auto=format&fit=crop&w=1200&q=80",
  challenges: "https://images.pexels.com/photos/16966331/pexels-photo-16966331.jpeg?auto=compress&cs=tinysrgb&w=1200",
  mentor1: "https://images.pexels.com/photos/7567431/pexels-photo-7567431.jpeg?auto=compress&cs=tinysrgb&w=800",
  mentor2: "https://images.pexels.com/photos/6918658/pexels-photo-6918658.jpeg?auto=compress&cs=tinysrgb&w=800",
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
