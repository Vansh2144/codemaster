"use client";

import React, { useState } from "react";
import { CreditCard, ShieldAlert, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface SandboxPaymentModalProps {
  courseTitle: string;
  coursePrice: number;
  orderId: string;
  courseId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function SandboxPaymentModal({
  courseTitle,
  coursePrice,
  orderId,
  courseId,
  onSuccess,
  onClose,
}: SandboxPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSimulateSuccess = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substring(2, 9),
          razorpay_signature: "mock_signature",
          courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Payment simulation failed.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      background: "rgba(8, 11, 17, 0.85)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div className="card-glass" style={{
        width: "100%",
        maxWidth: "480px",
        padding: "32px",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        background: "rgba(17, 21, 34, 0.95)",
        boxShadow: "0 24px 50px rgba(139, 92, 246, 0.15)",
        position: "relative",
        animation: "fadeIn 0.3s ease-out"
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer"
          }}
          disabled={loading}
        >
          <XCircle size={24} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            display: "inline-flex",
            padding: "12px",
            borderRadius: "50%",
            background: "rgba(139, 92, 246, 0.1)",
            color: "var(--accent-purple)",
            marginBottom: "16px"
          }}>
            <CreditCard size={28} />
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Sandbox Payment Gateway</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--accent-green)", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "4px" }}>
            <ShieldAlert size={14} />
            Simulator Mode Enabled
          </p>
        </div>

        {/* Billing Details */}
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "18px",
          marginBottom: "24px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Item:</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", maxWidth: "240px", textAlign: "right" }}>{courseTitle}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Order ID:</span>
            <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{orderId}</span>
          </div>
          <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 600 }}>Amount Due:</span>
            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-purple)" }}>${coursePrice.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#f87171",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            fontSize: "0.85rem",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handleSimulateSuccess}
            className="btn btn-green"
            style={{ width: "100%", padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing simulation...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Simulate Successful Payment
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ width: "100%", padding: "12px" }}
            disabled={loading}
          >
            Cancel Order
          </button>
        </div>

        {/* Disclaimer */}
        <p style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          textAlign: "center",
          marginTop: "20px",
          lineHeight: 1.4
        }}>
          This is a simulated sandbox checkout. No real funds will be charged. Clicking simulate success will write a mock enrollment transaction to your local SQLite database.
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
