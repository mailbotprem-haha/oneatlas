import { defineConfig } from "prisma/config"

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL_DIRECT!,
  },
  migrations: {
    seed: "node --import tsx/esm prisma/seed.ts",
  },
})
