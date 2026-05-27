import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: "postgresql://neondb_owner:npg_vIRlkhB4N8tM@ep-wild-silence-ap16dnbu.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require",
})
const prisma = new PrismaClient({ adapter })

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const app = await prisma.app.findUnique({
      where: { id },
      include: {
        template: true,
        schemas: {
          where: { isCurrent: true },
        },
      },
    })

    if (!app) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "App not found" } },
        { status: 404 }
      )
    }

    const currentSchema = app.schemas[0]

    return NextResponse.json({
      data: {
        id: app.id,
        name: app.name,
        schema: currentSchema.schema,
        version: currentSchema.version,
        templateUsed: app.template.name,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Something went wrong" } },
      { status: 500 }
    )
  }
}