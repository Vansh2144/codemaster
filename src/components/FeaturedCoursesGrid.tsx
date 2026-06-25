"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  level: string;
  category: string;
  thumbnail: string;
}

export default function FeaturedCoursesGrid({ courses }: { courses: Course[] }) {
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
    <section style={{ padding: "80px 0", background: "#0a0d16" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Featured Developer Courses</h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "540px", margin: "12px auto 0 auto" }}>
            Explore immersive curriculum covering Next.js, database designs, systems algorithms, and smart contracts.
          </p>
        </div>

        <div className="grid-cols-2">
          {courses.slice(0, 4).map((course) => (
            <div key={course.id} className="card-glass" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Thumbnail */}
              <div style={{ position: "relative", height: "200px", width: "100%", overflow: "hidden" }}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform var(--transition-normal)" }}
                  className="course-image"
                />
              </div>

              {/* Card Body */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--accent-blue)", fontWeight: 600 }}>{course.category}</span>
                  {getLevelBadge(course.level)}
                </div>

                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "10px", lineHeight: 1.4 }}>{course.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px", flex: 1 }}>
                  {course.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "18px", marginTop: "auto" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
                    ${course.price.toFixed(2)}
                  </span>
                  <Link href={`/courses/${course.slug}`} className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    View Syllabus
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link href="/courses" className="btn btn-secondary">
            View All Courses
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .card-glass:hover .course-image {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
