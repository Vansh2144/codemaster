"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, bio }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      // Log in automatically after registration
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        setError("Account created, but automatic login failed. Please go to login.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card animate-fade-in">
      <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "8px" }}>
        Create Account
      </h2>
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "28px" }}>
        Start your developer training and dashboard workspace.
      </p>

      {error && (
        <div style={{
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          color: "#f87171",
          padding: "12px 16px",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          marginBottom: "20px"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name *</label>
          <input
            id="name"
            type="text"
            className="input-glass"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address *</label>
          <input
            id="email"
            type="email"
            className="input-glass"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password *</label>
          <input
            id="password"
            type="password"
            className="input-glass"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: "24px" }}>
          <label className="form-label" htmlFor="bio">Short Bio (Optional)</label>
          <textarea
            id="bio"
            className="input-glass textarea-glass"
            placeholder="Tell us about yourself (e.g. backend enthusiast, CS student)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px" }} disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--accent-purple)", fontWeight: 600 }}>
          Log In
        </Link>
      </div>
    </div>
  );
}
