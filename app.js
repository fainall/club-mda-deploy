// Passenger entry point for cPanel Node.js App (CommonJS).
// Passenger patches http and sets PORT; the ESM bundle calls listen().
if (!process.env.PORT) process.env.PORT = "3001";
if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
import("./dist/index.mjs").catch((err) => {
  console.error("Failed to start CLUB MDA server:", err);
  process.exit(1);
});
