import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId, progress } = await request.json();

    if (!courseId || progress === undefined) {
      return NextResponse.json({ message: "Course ID and progress are required" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Ensure progress is bounded
    const validProgress = Math.max(0, Math.min(100, Math.round(progress)));

    const enrollment = await db.enrollment.findFirst({
      where: { userId, courseId, status: "ACTIVE" }
    });

    if (!enrollment) {
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
    }

    const updatedEnrollment = await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: validProgress,
        status: validProgress === 100 ? "COMPLETED" : "ACTIVE",
      }
    });

    return NextResponse.json({
      message: "Progress updated successfully",
      progress: updatedEnrollment.progress,
      status: updatedEnrollment.status,
    });
  } catch (error: any) {
    console.error("Update Progress Error:", error);
    return NextResponse.json({ message: "Failed to update classroom progress" }, { status: 500 });
  }
}
