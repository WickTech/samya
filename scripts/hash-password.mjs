#!/usr/bin/env node
/**
 * Generate a password hash (and optionally a ready ADMIN_USERS entry) for the
 * SĀMYA admin dashboard.
 *
 *   npm run admin:hash -- "password"
 *   npm run admin:hash -- "password" owner@samya.example owner
 *   npm run admin:hash -- "password" dev@example.com dev
 *   npm run admin:hash                       # prompts for the password
 *
 * Put the hash in ADMIN_USERS (JSON array) in .env.local / the Vercel env.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

function hash(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

function prompt(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const [pwArg, emailArg, roleArg] = process.argv.slice(2);
const password = pwArg && pwArg.trim() ? pwArg : await prompt("Password: ");

if (!password || password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

const passwordHash = hash(password);
console.log("\npasswordHash: " + passwordHash);

if (emailArg) {
  const role = roleArg === "dev" ? "dev" : "owner";
  const entry = { email: emailArg.trim().toLowerCase(), role, passwordHash };
  console.log("\nADMIN_USERS entry:\n" + JSON.stringify(entry, null, 2));
}
console.log();
