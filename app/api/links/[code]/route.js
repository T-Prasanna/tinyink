import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(_, { params }) {
  try {
    const { code } = params;

    await prisma.link.delete({
      where: { shortId: code }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
