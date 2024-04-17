import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Question } from "@/utils/types";

function getScore(questions: Question[]) {
  let count = 0;
  questions.forEach(({ selectedAnswer, correctAnswer }) => {
    if (selectedAnswer === correctAnswer) count++;
  });
  return count;
}

export async function POST(req: NextRequest) {
  try {
    const questions = await req.json();
    const score = getScore(questions);
    const session = await getServerSession(authOptions);
    if (session && session.user?.email) {
      const exist = await prisma.results.findFirst({
        where: {
          email_id: session.user.email,
        },
      });
      if (exist) {
        const updated = await prisma.results.update({
          data: {
            questions: JSON.stringify(questions),
            score,
          },
          where: {
            email_id: session.user.email,
          },
        });
        return NextResponse.json({
          updated,
        });
      }
      const created = await prisma.results.create({
        data: {
          email_id: session.user.email,
          questions: JSON.stringify(questions),
          score,
        },
      });
      return NextResponse.json({
        created,
      });
    } else {
      throw new Error("User is not logged in");
    }
  } catch (error) {
    return new NextResponse(null, {
      status: 422,
      statusText: "not created",
    });
  }
}
