import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import CoursePlayerClient from "@/components/CoursePlayerClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{
    courseSlug: string;
  }>;
}

export const revalidate = 0;

export default async function ClassroomPlayerPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { courseSlug } = resolvedParams;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const course = await db.course.findUnique({
    where: { slug: courseSlug }
  });

  if (!course) {
    notFound();
  }

  // Double check authorization: must be enrolled to access player!
  const enrollment = await db.enrollment.findFirst({
    where: {
      userId,
      courseId: course.id,
      status: "ACTIVE"
    }
  });

  if (!enrollment) {
    // Redirect to course page for checkout
    redirect(`/courses/${course.slug}`);
  }

  const lessons = await db.lesson.findMany({
    where: { courseId: course.id },
    orderBy: { order: "asc" }
  });

  return (
    <div className="animate-fade-in">
      {/* Header navbar links back */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/dashboard/learning" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.85rem",
          color: "var(--text-secondary)"
        }} className="btn-secondary btn-sm btn">
          <ArrowLeft size={14} />
          Classroom Catalog
        </Link>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>{course.title}</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "2px" }}>
          Classroom Workspace — Watch lectures and read code instructions.
        </p>
      </div>

      <CoursePlayerClient
        course={course}
        lessons={lessons}
        initialProgress={enrollment.progress}
        userId={userId}
      />
    </div>
  );
}
