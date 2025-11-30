import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const links = await prisma.link.findMany();
    return NextResponse.json(links);
  } catch (err) {
    console.error("GET /api/links error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { url, customCode } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const shortId =
      customCode?.trim() ||
      Math.random().toString(36).substring(2, 8);

    // check duplicate code
    const existing = await prisma.link.findUnique({
      where: { shortId },
    });

    if (existing) {
      return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }

    const link = await prisma.link.create({
      data: {
        originalUrl: url,
        shortId,
      },
    });

    return NextResponse.json(link);
  } catch (err) {
    console.error("POST /api/links error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
