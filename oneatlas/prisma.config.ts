import { defineConfig } from "prisma/config"

export default defineConfig({
  datasource: {
    url: "postgresql://neondb_owner:npg_vIRlkhB4N8tM@ep-wild-silence-ap16dnbu.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
  migrations: {
    seed: "node --import tsx/esm prisma/seed.ts",
  },
})