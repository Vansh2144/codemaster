import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import Link from "next/link";
import { Calendar, User, ArrowRight, MessageSquare } from "lucide-react";

export const revalidate = 0;

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true }
      },
      comments: {
        select: { id: true }
      }
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "60px 0" }}>
        <div className="container">
          <div style={{ marginBottom: "48px" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>CodeMaster Technical Blog</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginTop: "8px" }}>
              Explore deep dives on systems architectural design, Next.js mechanics, and software engineering.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "30px" }}>
            {posts.map((post) => {
              const tags = JSON.parse(post.tags) as string[];
              return (
                <article key={post.id} className="card-glass" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "12px", lineHeight: 1.4 }} className="post-title">
                    <Link href={`/blog/${post.slug}`} style={{ color: "#fff" }} className="post-link">
                      {post.title}
                    </Link>
                  </h2>

                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px", flex: 1, lineBreak: "anywhere" }}>
                    {post.content.replace(/[#*`]/g, "").slice(0, 140)}...
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                    {tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        background: "rgba(255, 255, 255, 0.03)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)"
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "16px",
                    marginTop: "auto"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        <User size={14} style={{ color: "var(--accent-purple)" }} />
                        <span>{post.author.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        <MessageSquare size={14} />
                        <span>{post.comments.length}</span>
                      </div>
                    </div>
                    <Link href={`/blog/${post.slug}`} style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--accent-blue)", display: "flex", alignItems: "center", gap: "4px" }}>
                      Read Article
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
