import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedCoursesGrid from "@/components/FeaturedCoursesGrid";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import Link from "next/link";
import { Calendar, ArrowRight, User } from "lucide-react";

export const revalidate = 0; // Disable caching to fetch live SQLite state

export default async function LandingPage() {
  // Fetch courses and blog posts from the database
  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const blogPosts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      author: {
        select: { name: true }
      }
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Courses */}
        <FeaturedCoursesGrid courses={courses} />

        {/* Latest Technical Articles Section */}
        <section style={{ padding: "80px 0", background: "var(--bg-primary)" }}>
          <div className="container">
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "48px",
              flexWrap: "wrap",
              gap: "24px"
            }}>
              <div>
                <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Latest Technical Articles</h2>
                <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
                  Deep-dives into systems architectures, next-gen styling, and clean typing patterns.
                </p>
              </div>
              <Link href="/blog" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                View All Articles
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid-cols-3">
              {blogPosts.map((post) => {
                const tags = JSON.parse(post.tags) as string[];
                return (
                  <article key={post.id} className="card-glass" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>
                        {post.category}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={12} />
                        {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px", lineHeight: 1.4 }} className="article-title">
                      <Link href={`/blog/${post.slug}`} style={{ color: "#fff" }} className="article-link">
                        {post.title}
                      </Link>
                    </h3>

                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "20px", flex: 1, lineBreak: "anywhere" }}>
                      {post.content.replace(/[#*`]/g, "").slice(0, 120)}...
                    </p>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: "1px solid var(--border)",
                      paddingTop: "16px",
                      marginTop: "auto"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        <User size={14} style={{ color: "var(--accent-purple)" }} />
                        <span>{post.author.name}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-blue)", display: "flex", alignItems: "center", gap: "4px" }}>
                        Read
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
