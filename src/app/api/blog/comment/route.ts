import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized. Please log in to comment." }, { status: 401 });
    }

    const { postId, content } = await request.json();

    if (!postId || !content || content.trim() === "") {
      return NextResponse.json({ message: "Comment content and post ID are required." }, { status: 400 });
    }

    const comment = await db.comment.create({
      data: {
        blogPostId: postId,
        userId: (session.user as any).id,
        content: content.trim(),
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({ message: "Comment added successfully.", comment }, { status: 201 });
  } catch (error: any) {
    console.error("Comment Error:", error);
    return NextResponse.json({ message: "An error occurred while posting your comment." }, { status: 500 });
  }
}
