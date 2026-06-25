"use client";

import React from "react";
import Link from "next/link";
import { Code, Github, Twitter, Linkedin, Youtube, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-secondary)",
      borderTop: "1px solid var(--border)",
      padding: "60px 0 40px 0",
      marginTop: "auto"
    }}>
      <div className="container">
        <div className="grid-cols-3" style={{ marginBottom: "48px" }}>
          {/* Brand Info */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px" }}>
              <Code size={20} style={{ color: "var(--accent-purple)" }} />
              <span>
                <span style={{ color: "var(--accent-purple)" }}>Code</span>
                <span style={{ color: "var(--accent-blue)" }}>Master</span>
              </span>
            </Link>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "280px" }}>
              A premium, full-stack educational technical platform to master systems programming, Next.js, and decentralized blockchain coding.
            </p>
          </div>

          {/* Site Navigation Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-primary)" }}>Platform</h4>
            <Link href="/courses" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }} className="footer-link">
              Browse Courses
            </Link>
            <Link href="/blog" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }} className="footer-link">
              Technical Blog
            </Link>
            <Link href="/login" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }} className="footer-link">
              Student Workspace
            </Link>
          </div>

          {/* Contact / Socials */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-primary)" }}>Community</h4>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Join other developers learning in public.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "4px" }}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }} className="social-link" title="Github">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }} className="social-link" title="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }} className="social-link" title="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }} className="social-link" title="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <hr style={{ border: "0", borderTop: "1px solid var(--border)", marginBottom: "30px" }} />

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "0.8rem",
          color: "var(--text-muted)"
        }}>
          <div>
            &copy; {new Date().getFullYear()} CodeMaster. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }}>Terms of Service</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-link:hover, .social-link:hover {
          color: var(--text-primary) !important;
        }
      `}</style>
    </footer>
  );
}
