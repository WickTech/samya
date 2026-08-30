#!/usr/bin/env node
/**
 * Generate a password hash + a ready ADMIN_USERS entry for the SĀMYA admin.
 *
 *   npm run admin:hash -- owner@samya.example owner
 *   npm run admin:hash -- dev@example.com dev
 *   npm run admin:hash                       # no entry, just a bare hash
 *
 * Password: typed at the prompt (kept out of shell history), or passed via
 * the ADMIN_HASH_PW env var for non-interactive use. Put the printed entry
 * into ADMIN_USERS.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";

function hash(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

const [email, roleArg] = process.argv.slice(2);
const role = roleArg === "dev" ? "dev" : "owner";

async function readPassword() {
  const fromEnv = process.env.ADMIN_HASH_PW;
  if (fromEnv) return fromEnv.trim();

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const pw = (await rl.question("Password (>= 10 chars): ")).trim();
    const confirm = (await rl.question("Confirm password       : ")).trim();
    if (pw !== confirm) {
      console.error("Passwords do not match.");
      process.exit(1);
    }
    return pw;
  } finally {
    rl.close();
  }
}

const password = await readPassword();
if (!password || password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

const passwordHash = hash(password);
if (email) {
  console.log(
    "\nADMIN_USERS entry (add to the JSON array):\n" +
      JSON.stringify({ email: email.toLowerCase(), role, passwordHash }),
  );
} else {
  console.log("\npasswordHash: " + passwordHash);
}
console.log();
