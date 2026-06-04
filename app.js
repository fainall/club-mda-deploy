// Passenger entry point for cPanel Node.js App (CommonJS).
// Passenger patches http and sets PORT; the ESM bundle calls listen().
const fs = require("fs");
const path = require("path");

// Load a server-only .env file (secrets that must NOT live in git, the bundle,
// or the frontend) without overriding variables already provided by the hosting
// environment (cPanel/Passenger injects DATABASE_URL, SMTP_*, etc.).
try {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    for (const raw of fs.readFileSync(envPath, "utf8").split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key && !(key in process.env)) process.env[key] = val;
    }
  }
} catch (err) {
  console.error("Failed to load .env:", err);
}

if (!process.env.PORT) process.env.PORT = "3001";
if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
import("./dist/index.mjs").catch((err) => {
  console.error("Failed to start CLUB MDA server:", err);
  process.exit(1);
});
