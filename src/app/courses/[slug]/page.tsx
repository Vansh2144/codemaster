import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseDetailClient from "@/components/CourseDetailClient";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import { User, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0;

export default async function CourseDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      instructor: {
        select: { name: true, bio: true }
      }
    }
  });

  if (!course) {
    notFound();
  }

  const lessons = await db.lesson.findMany({
    where: { courseId: course.id },
    orderBy: { order: "asc" }
  });

  // Check user session & enrollment
  const session = await getServerSession(authOptions);
  let isEnrolled = false;

  if (session?.user) {
    const enrollment = await db.enrollment.findFirst({
      where: {
        userId: (session.user as any).id,
        courseId: course.id,
        status: "ACTIVE"
      }
    });
    if (enrollment) {
      isEnrolled = true;
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return <span className="badge badge-green">Beginner</span>;
      case "INTERMEDIATE":
        return <span className="badge badge-blue">Intermediate</span>;
      case "ADVANCED":
        return <span className="badge badge-purple">Advanced</span>;
      default:
        return <span className="badge badge-blue">{level}</span>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 0" }}>
        <div className="container">
          {/* Back button */}
          <Link href="/courses" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginBottom: "24px"
          }} className="btn-secondary btn-sm btn">
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>

          {/* Hero Header panel */}
          <div className="card-glass animate-fade-in" style={{
            padding: "40px",
            marginBottom: "40px",
            background: "radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.08), transparent 50%), var(--glass-bg)"
          }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
              <span className="badge badge-purple">{course.category}</span>
              {getLevelBadge(course.level)}
            </div>

            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "16px", lineHeight: 1.25 }}>
              {course.title}
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "800px", marginBottom: "28px", lineHeight: 1.6 }}>
              {course.description}
            </p>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
              fontSize: "0.9rem",
              color: "var(--text-secondary)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <User size={18} style={{ color: "var(--accent-purple)" }} />
                <span>Instructor: <strong>{course.instructor.name}</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Award size={18} style={{ color: "var(--accent-green)" }} />
                <span>Certificate on completion</span>
              </div>
            </div>
          </div>

          {/* Client Syllabus & Sticky Checkout */}
          <CourseDetailClient
            course={course}
            lessons={lessons}
            isEnrolled={isEnrolled}
            isLoggedIn={!!session}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
