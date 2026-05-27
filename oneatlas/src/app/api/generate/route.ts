import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { matchTemplate } from "@/services/matcher"
import { z } from "zod"

const adapter = new PrismaPg({
  connectionString: "postgresql://neondb_owner:npg_vIRlkhB4N8tM@ep-wild-silence-ap16dnbu.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require",
})

const prisma = new PrismaClient({ adapter })

const schema = z.object({
  prompt: z.string().min(3),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Prompt is required" } },
        { status: 400 }
      )
    }

    const templates = await prisma.template.findMany()

    const { template, confidence, matchedKeywords } = matchTemplate(
      parsed.data.prompt,
      templates as any
    )

    if (!template) {
      return NextResponse.json(
        {
          error: {
            code: "NO_MATCH",
            message: "No template matched your prompt.",
            suggestion: "Try: 'CRM for sales team' or 'HR dashboard for employees'",
          },
        },
        { status: 422 }
      )
    }

    const appName = `${template.name} — ${new Date().toLocaleDateString()}`

    const app = await prisma.app.create({
      data: {
        name: appName,
        templateId: template.id,
        schemas: {
          create: {
            version: 1,
            schema: template.schemaDefaults as object,
            isCurrent: true,
          },
        },
      },
      include: { schemas: true },
    })

    return NextResponse.json({
      data: {
        appId: app.id,
        schema: app.schemas[0].schema,
        templateUsed: template.name,
        generatedName: appName,
        confidence,
        matchedKeywords,
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