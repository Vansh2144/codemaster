import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-split">
      <div className="auth-left">
        <div>
          <Link href="/" style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            <span style={{ color: "var(--accent-purple)" }}>Code</span>
            <span style={{ color: "var(--accent-blue)" }}>Master</span>
          </Link>
          <h2 style={{ fontSize: "2.5rem", marginTop: "24px", color: "#fff", lineHeight: 1.2 }}>
            Master the Craft of Systems & Full-Stack Engineering
          </h2>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "12px", maxWidth: "480px" }}>
            Learn backend algorithms, scale high-throughput databases, and build reactive Web3 frontends with premium interactive tools.
          </p>

          <div className="auth-code-box">
            <span style={{ color: "#c678dd" }}>const</span> <span style={{ color: "#61afef" }}>developer</span> = &#123;
            <br />
            &nbsp;&nbsp;name: <span style={{ color: "#98c379" }}>&quot;You&quot;</span>,
            <br />
            &nbsp;&nbsp;status: <span style={{ color: "#98c379" }}>&quot;Leveling Up&quot;</span>,
            <br />
            &nbsp;&nbsp;skills: [<span style={{ color: "#98c379" }}>&quot;Next.js 15&quot;</span>, <span style={{ color: "#98c379" }}>&quot;System Design&quot;</span>, <span style={{ color: "#98c379" }}>&quot;Solidity&quot;</span>],
            <br />
            &nbsp;&nbsp;enroll: () =&gt; <span style={{ color: "#c678dd" }}>new</span> <span style={{ color: "#e5c07b" }}>Promise</span>(r =&gt; r(<span style={{ color: "#98c379" }}>&quot;Success&quot;</span>))
            <br />
            &#125;;
          </div>
        </div>
      </div>
      <div className="auth-right">
        {children}
      </div>
    </div>
  );
}
