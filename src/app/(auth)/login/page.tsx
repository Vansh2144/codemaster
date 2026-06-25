"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card animate-fade-in">
      <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "8px" }}>
        Welcome Back
      </h2>
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "28px" }}>
        Log in to continue building your engineering skills.
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
          <label className="form-label" htmlFor="email">Email Address</label>
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

        <div className="form-group" style={{ marginBottom: "24px" }}>
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="input-glass"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px" }} disabled={loading}>
          {loading ? "Authenticating..." : "Log In"}
        </button>
      </form>

      <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "var(--accent-purple)", fontWeight: 600 }}>
          Register
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-card">
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Loading...</h2>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
