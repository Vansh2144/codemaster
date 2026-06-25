import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCommentsSection from "@/components/BlogCommentsSection";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0;

export default async function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: { name: true, bio: true }
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    }
  });

  if (!post) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const tags = JSON.parse(post.tags) as string[];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 0" }}>
        <article className="container" style={{ maxWidth: "800px" }}>
          {/* Back button */}
          <Link href="/blog" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginBottom: "24px"
          }} className="btn-secondary btn-sm btn">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          {/* Header */}
          <header style={{ marginBottom: "32px" }} className="animate-fade-in">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span className="badge badge-purple">{post.category}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={14} />
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>

            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "20px", lineHeight: 1.25, color: "#fff" }}>
              {post.title}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#fff"
              }}>
                {post.author.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "#fff" }}>{post.author.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Author</div>
              </div>
            </div>
          </header>

          {/* Content Body */}
          <div style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-lg)",
            padding: "40px",
            lineHeight: 1.7,
            color: "var(--text-secondary)"
          }} className="blog-content-container markdown-body animate-fade-in">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Tags list */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "24px" }}>
            {tags.map((tag) => (
              <span key={tag} style={{
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "4px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)"
              }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Comments Section */}
          <BlogCommentsSection
            postId={post.id}
            initialComments={post.comments}
            isLoggedIn={!!session}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
