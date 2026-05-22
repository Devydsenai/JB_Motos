import { env } from "./env.js";

/** Origens permitidas no CORS (Netlify, localhost, FRONTEND_URL, etc.) */
export function getAllowedOrigins(): string[] {
  const fromEnv = env.ALLOWED_ORIGINS.split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const extra = [env.FRONTEND_URL].filter((url): url is string => Boolean(url));

  return [...new Set([...fromEnv, ...extra])];
}
