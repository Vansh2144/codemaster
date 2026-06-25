import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, BookOpen, User, LogOut, Code, Home, Settings } from "lucide-react";
import "./dashboard.css";

// This layout requires session check (but middleware already guards it, let's keep it safe)
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Panel */}
      <aside className="dashboard-sidebar">
        {/* Brand */}
        <div className="dashboard-brand">
          <Code size={22} style={{ color: "var(--accent-purple)" }} />
          <span>
            <span style={{ color: "var(--accent-purple)" }}>Code</span>
            <span style={{ color: "var(--accent-blue)" }}>Master</span>
          </span>
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          <Link href="/dashboard" className="sidebar-link active">
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link href="/dashboard/learning" className="sidebar-link">
            <BookOpen size={18} />
            My Learning
          </Link>
          <Link href="/" className="sidebar-link">
            <Home size={18} />
            Back to Home
          </Link>
        </nav>

        {/* User Footer Profile */}
        <div className="sidebar-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
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
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {session.user?.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {(session.user as any)?.role}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
