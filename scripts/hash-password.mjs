#!/usr/bin/env node
/**
 * Generate an ADMIN_PASSWORD_HASH for the SĀMYA admin dashboard.
 *
 *   npm run admin:hash -- "my-strong-password"
 *   npm run admin:hash            # prompts (hidden input)
 *
 * Paste the printed line into .env.local (local) or the Vercel project env.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

function hash(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

function fromArgs() {
  const pw = process.argv[2];
  return pw && pw.trim() ? pw : null;
}

function prompt() {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question("Password: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const password = fromArgs() ?? (await prompt());
if (!password || password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

console.log("\nADMIN_PASSWORD_HASH=" + hash(password) + "\n");
