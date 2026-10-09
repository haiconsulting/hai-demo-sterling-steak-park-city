export const ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/music/", priority: 0.9, changeFrequency: "daily" },
  { path: "/menu/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/private-events/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/visit/", priority: 0.7, changeFrequency: "monthly" },
] as const;
