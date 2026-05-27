import { PrismaClient } from "@/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({
  connectionString: "postgresql://neondb_owner:npg_vIRlkhB4N8tM@ep-wild-silence-ap16dnbu.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require",
})

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma