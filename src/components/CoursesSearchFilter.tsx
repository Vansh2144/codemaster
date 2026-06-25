"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";

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

export default function CoursesSearchFilter({ initialCourses }: { initialCourses: Course[] }) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const categories = ["ALL", ...Array.from(new Set(initialCourses.map(c => c.category)))];

  const filteredCourses = initialCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.description.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "ALL" || course.level === levelFilter;
    const matchesCategory = categoryFilter === "ALL" || course.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

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
    <div>
      {/* Search and Filters panel */}
      <div className="card-glass animate-fade-in" style={{ padding: "24px", marginBottom: "40px" }}>
        <div style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          {/* Search bar */}
          <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
            <Search size={18} style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)"
            }} />
            <input
              type="text"
              placeholder="Search courses (e.g. Next.js, System Design...)"
              className="input-glass"
              style={{ paddingLeft: "42px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Level Filter */}
          <div style={{ minWidth: "160px" }}>
            <select
              className="input-glass"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value="ALL">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ minWidth: "160px" }}>
            <select
              className="input-glass"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "ALL" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid-cols-2">
          {filteredCourses.map((course) => (
            <div key={course.id} className="card-glass" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "relative", height: "200px", width: "100%", overflow: "hidden" }}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--accent-blue)", fontWeight: 600 }}>{course.category}</span>
                  {getLevelBadge(course.level)}
                </div>

                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "10px", lineHeight: 1.4 }}>{course.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "24px", flex: 1 }}>
                  {course.description}
                </p>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "18px",
                  marginTop: "auto"
                }}>
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
      ) : (
        <div className="card-glass" style={{ padding: "48px", textAlign: "center", color: "var(--text-secondary)" }}>
          <SlidersHorizontal size={36} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
          <h3>No courses found matching your criteria.</h3>
          <p style={{ fontSize: "0.9rem", marginTop: "4px" }}>Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}
