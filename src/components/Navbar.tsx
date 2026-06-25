"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Code, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "var(--glass-bg)",
      backdropFilter: "var(--glass-blur)",
      WebkitBackdropFilter: "var(--glass-blur)",
      borderBottom: "1px solid var(--glass-border)",
      transition: "var(--transition-normal)"
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "72px"
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.25rem", fontWeight: 800 }}>
          <Code size={24} style={{ color: "var(--accent-purple)" }} />
          <span>
            <span style={{ color: "var(--accent-purple)" }}>Code</span>
            <span style={{ color: "var(--accent-blue)" }}>Master</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "32px" }} className="desktop-nav">
          <Link href="/courses" style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-secondary)" }} className="nav-link">
            Courses
          </Link>
          <Link href="/blog" style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-secondary)" }} className="nav-link">
            Blog
          </Link>

          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                  {session.user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn btn-secondary btn-sm"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}
                  title="Sign Out"
                >
                  <LogOut size={16} style={{ color: "#f87171" }} />
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer"
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }} className="mobile-nav">
          <Link href="/courses" onClick={toggleMobileMenu} style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-secondary)" }}>
            Courses
          </Link>
          <Link href="/blog" onClick={toggleMobileMenu} style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-secondary)" }}>
            Blog
          </Link>
          <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "4px 0" }} />
          {session ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                  {session.user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{session.user?.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{session.user?.email}</div>
                </div>
              </div>
              <Link href="/dashboard" onClick={toggleMobileMenu} className="btn btn-secondary" style={{ justifyContent: "center" }}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button
                onClick={() => { toggleMobileMenu(); signOut({ callbackUrl: "/" }); }}
                className="btn btn-secondary"
                style={{ justifyContent: "center", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)" }}
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={toggleMobileMenu} className="btn btn-primary" style={{ textAlign: "center" }}>
              Get Started
            </Link>
          )}
        </div>
      )}

      {/* Embedded styling for desktop/mobile responsive logic */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
        .nav-link:hover {
          color: var(--text-primary) !important;
        }
      `}</style>
    </header>
  );
}
