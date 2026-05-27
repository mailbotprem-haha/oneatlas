import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Missing app id" },
        { status: 400 }
      )
    }

    const app = await prisma.app.findUnique({
      where: { id },
      include: {
        schemas: {
          where: {
            isCurrent: true,
          },
          take: 1,
        },
        template: true,
      },
    })

    if (!app) {
      return NextResponse.json(
        { error: "App not found" },
        { status: 404 }
      )
    }

    const currentSchema = app.schemas[0]

    return NextResponse.json({
      data: {
        id: app.id,
        name: app.name,
        schema: currentSchema?.schema || null,
        version: currentSchema?.version || null,
        templateUsed: app.template?.name || null,
      },
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 }
    )
  }
}
