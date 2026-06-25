import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

export const revalidate = 0;

export default async function MyLearningPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any).id;

  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: {
      course: true
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>My Enrolled Courses</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
          Access your courses, watch lecture content, and view complete course materials.
        </p>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid-cols-2">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="card-glass" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                <img
                  src={enrollment.course.thumbnail}
                  alt={enrollment.course.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--accent-blue)", fontWeight: 600 }}>
                    {enrollment.course.category}
                  </span>
                  <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>
                    {enrollment.course.level}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "16px", lineHeight: 1.4 }}>
                  {enrollment.course.title}
                </h3>

                {/* Progress bar */}
                <div style={{ marginTop: "auto", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                    <span>Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="progress-container" style={{ margin: 0 }}>
                    <div className="progress-bar" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                </div>

                <Link href={`/dashboard/learning/${enrollment.course.slug}`} className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                  Go to Classroom
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-glass" style={{ padding: "48px", textAlign: "center" }}>
          <GraduationCap size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
          <h3>You aren&apos;t enrolled in any courses yet.</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "6px", marginBottom: "24px" }}>
            Explore our curriculum catalog to enroll in courses.
          </p>
          <Link href="/courses" className="btn btn-primary">
            Browse Catalog
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
