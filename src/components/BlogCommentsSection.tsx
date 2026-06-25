"use client";

import React, { useState } from "react";
import { MessageSquare, Send, User, Loader2 } from "lucide-react";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  user: {
    name: string | null;
  };
}

interface BlogCommentsSectionProps {
  postId: string;
  initialComments: Comment[];
  isLoggedIn: boolean;
}

export default function BlogCommentsSection({
  postId,
  initialComments,
  isLoggedIn,
}: BlogCommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/blog/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: newComment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post comment");
      }

      // Add comment to list locally
      setComments([data.comment, ...comments]);
      setNewComment("");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "60px", borderTop: "1px solid var(--border)", paddingTop: "40px" }}>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
        <MessageSquare size={22} style={{ color: "var(--accent-purple)" }} />
        Discussion ({comments.length})
      </h3>

      {/* Write comment form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
          {error && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              fontSize: "0.85rem",
              marginBottom: "16px"
            }}>
              {error}
            </div>
          )}
          <div className="form-group" style={{ marginBottom: "16px" }}>
            <textarea
              className="input-glass textarea-glass"
              placeholder="Join the discussion... write your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loading}
              required
              style={{ minHeight: "80px" }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }} disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Post Comment
          </button>
        </form>
      ) : (
        <div className="card-glass" style={{ padding: "20px", textAlign: "center", marginBottom: "40px" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
            You must be logged in to participate in the discussion.
          </p>
          <Link href="/login" className="btn btn-secondary btn-sm">
            Log In to Comment
          </Link>
        </div>
      )}

      {/* List comments */}
      {comments.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {comments.map((comment) => (
            <div key={comment.id} className="card-glass" style={{ padding: "20px", background: "rgba(255, 255, 255, 0.01)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#fff"
                }}>
                  {comment.user.name?.charAt(0).toUpperCase() || <User size={12} />}
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>{comment.user.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
}
