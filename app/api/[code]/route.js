import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(req, { params }) {
  const { code } = params;

  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return new Response("Not found", { status: 404 });
  }

  await prisma.link.update({
    where: { code },
    data: {
      clicks: link.clicks + 1,
      lastClicked: new Date(),
    },
  });

  redirect(link.originalUrl);
}
