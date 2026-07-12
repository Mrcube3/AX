import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

function numberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export const config = {
  root: appRoot,
  host: process.env.HOST || "127.0.0.1",
  port: numberEnv("PORT", 8080),
  maxBodyBytes: numberEnv("MAX_BODY_BYTES", 1_000_000),
  maxOrderChars: numberEnv("MAX_ORDER_CHARS", 10_000),
  dataDir: resolve(appRoot, process.env.DATA_DIR || ".data"),
  rateLimitWindowMs: numberEnv("RATE_LIMIT_WINDOW_MS", 60_000),
  rateLimitMax: numberEnv("RATE_LIMIT_MAX", 120),
  nodeEnv: process.env.NODE_ENV || "development"
};
