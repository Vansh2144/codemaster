"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, ArrowRight, BookOpen } from "lucide-react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section style={{
      position: "relative",
      padding: "100px 0 120px 0",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center"
    }}>
      {/* Decorative Blur Backgrounds */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)",
        filter: "blur(50px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "5%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none"
      }} />

      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        {/* Hacker Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-full)",
          fontSize: "0.85rem",
          fontWeight: 650,
          color: "var(--accent-green)",
          marginBottom: "28px"
        }}>
          <Terminal size={14} />
          <span>v1.0.0 — Interactive Technical Platform</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          maxWidth: "800px",
          margin: "0 auto 20px auto"
        }}>
          Master Tech Skills with <span className="text-gradient-accent">CodeMaster</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "var(--text-secondary)",
          maxWidth: "600px",
          margin: "0 auto 40px auto",
          lineHeight: 1.6
        }}>
          Immersion-based training for systems software, database scale, and decentralized engineering. Built by developers, for developers.
        </p>

        {/* Call to Actions */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "60px"
        }}>
          <Link href="/courses" className="btn btn-primary btn-lg">
            Browse Courses
            <ArrowRight size={18} />
          </Link>
          <Link href="/blog" className="btn btn-secondary btn-lg">
            Read the Blog
            <BookOpen size={18} />
          </Link>
        </div>

        {/* Decorative Grid or Particles Code Blocks */}
        {mounted && (
          <div style={{
            opacity: 0.8,
            animation: "fadeIn 1s ease-out"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "900px",
              margin: "0 auto",
              pointerEvents: "none",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              fontFamily: "var(--font-mono)",
              padding: "0 20px"
            }}>
              <div>&#123;/* systems_loaded: true */&#125;</div>
              <div style={{ color: "var(--accent-blue-glow)", animation: "pulse 2s infinite" }}>&lt;CodeMaster /&gt;</div>
              <div>// SQLite database synced</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
