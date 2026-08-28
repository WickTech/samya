/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't auto-generate AGENTS.md / CLAUDE.md on dev start.
  agentRules: false,
  images: {
    // Local placeholder art only in this phase; no remote sources yet.
    remotePatterns: [],
  },
};

export default nextConfig;
