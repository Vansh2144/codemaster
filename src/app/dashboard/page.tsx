import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Award, BookOpen, GraduationCap, ArrowRight, Play } from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any).id;

  // Fetch student enrollments
  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: {
      course: true
    },
    orderBy: { updatedAt: "desc" }
  });

  const totalEnrolled = enrollments.length;
  const completed = enrollments.filter(e => e.progress === 100 || e.status === "COMPLETED").length;
  
  const avgProgress = totalEnrolled > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrolled)
    : 0;

  const recentEnrollment = enrollments[0]; // Most recent active course

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Welcome back, {session?.user?.name}!</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
          Here is a summary of your technical learning progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Courses Enrolled</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
            <div className="stat-number">{totalEnrolled}</div>
            <BookOpen size={18} style={{ color: "var(--accent-blue)" }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Completed</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
            <div className="stat-number">{completed}</div>
            <Award size={18} style={{ color: "var(--accent-green)" }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Average Progress</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
            <div className="stat-number">{avgProgress}%</div>
            <GraduationCap size={18} style={{ color: "var(--accent-purple)" }} />
          </div>
        </div>
      </div>

      {/* Continue Learning Widget */}
      {recentEnrollment ? (
        <div className="card-glass" style={{ padding: "32px", display: "flex", gap: "32px", flexWrap: "wrap", background: "radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.05), transparent 50%), var(--glass-bg)" }}>
          <img
            src={recentEnrollment.course.thumbnail}
            alt={recentEnrollment.course.title}
            style={{ width: "100%", maxWidth: "260px", height: "150px", objectFit: "cover", borderRadius: "var(--radius-md)" }}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span className="badge badge-purple" style={{ alignSelf: "flex-start", marginBottom: "12px" }}>
              {recentEnrollment.course.category}
            </span>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "8px" }}>
              {recentEnrollment.course.title}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              You are currently at {recentEnrollment.progress}% progress. Mark lessons completed to generate your certificate.
            </p>

            {/* Progress Meter */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                <span>Progress</span>
                <span>{recentEnrollment.progress}%</span>
              </div>
              <div className="progress-container" style={{ margin: 0 }}>
                <div className="progress-bar" style={{ width: `${recentEnrollment.progress}%` }} />
              </div>
            </div>

            <Link href={`/dashboard/learning/${recentEnrollment.course.slug}`} className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "10px 20px" }}>
              <Play size={16} fill="currentColor" />
              Continue Learning
            </Link>
          </div>
        </div>
      ) : (
        <div className="card-glass" style={{ padding: "48px", textAlign: "center" }}>
          <GraduationCap size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
          <h3>You aren&apos;t enrolled in any courses yet.</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "6px", marginBottom: "24px" }}>
            Explore our curriculum to start learning systems architecture, smart contracts, or full-stack next.js.
          </p>
          <Link href="/courses" className="btn btn-primary">
            Explore Courses
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
