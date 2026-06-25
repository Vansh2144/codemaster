import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoursesSearchFilter from "@/components/CoursesSearchFilter";
import { db } from "@/lib/db";

export const revalidate = 0;

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "60px 0" }}>
        <div className="container">
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Explore Developer Curriculum</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginTop: "8px" }}>
              Acquire production-grade competencies in full-stack frameworks, systems programming, and decentralized systems.
            </p>
          </div>

          <CoursesSearchFilter initialCourses={courses} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
