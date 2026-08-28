import next from "eslint-config-next/core-web-vitals";

const config = [
  ...next,
  {
    ignores: ["reference/**", ".next/**", "node_modules/**", "public/**"],
  },
];

export default config;
