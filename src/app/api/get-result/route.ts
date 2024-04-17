import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return;
    const results = await prisma.results.findFirst({
      where: {
        email_id: session.user.email,
      },
    });
    return NextResponse.json({
      // created,
      // deleted,
      results,
    });
  } catch (err) {
    return NextResponse.json({
      error: err,
    });
  }
}
