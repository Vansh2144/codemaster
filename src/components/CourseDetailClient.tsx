"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Lock, Clock, BookOpen, ShieldCheck, Loader2, ArrowRight, XCircle } from "lucide-react";
import SandboxPaymentModal from "./SandboxPaymentModal";

interface Lesson {
  id: string;
  title: string;
  isFreePreview: boolean;
  order: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  level: string;
  category: string;
  thumbnail: string;
}

interface CourseDetailClientProps {
  course: Course;
  lessons: Lesson[];
  isEnrolled: boolean;
  isLoggedIn: boolean;
}

export default function CourseDetailClient({
  course,
  lessons,
  isEnrolled,
  isLoggedIn,
}: CourseDetailClientProps) {
  const router = useRouter();

  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [sandboxOrder, setSandboxOrder] = useState<{ orderId: string } | null>(null);

  const handleEnrollClick = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/courses/${course.slug}`);
      return;
    }

    setCheckoutLoading(true);

    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      if (data.isMock) {
        setSandboxOrder({ orderId: data.orderId });
      } else {
        const options = {
          key: data.key,
          amount: data.amount,
          currency: "INR",
          name: "CodeMaster",
          description: `Enroll in ${course.title}`,
          order_id: data.orderId,
          handler: async function (res: any) {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
                courseId: course.id,
              }),
            });

            if (verifyRes.ok) {
              router.push("/dashboard/learning");
              router.refresh();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: "",
            email: "",
          },
          theme: {
            color: "#8b5cf6",
          },
        };

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong during checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleSandboxSuccess = () => {
    setSandboxOrder(null);
    router.push("/dashboard/learning");
    router.refresh();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "40px" }} className="detail-layout">
      {/* Left column: Syllabus */}
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "20px" }}>Course Curriculum</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  color: lesson.isFreePreview || isEnrolled ? "var(--accent-blue)" : "var(--text-muted)",
                }}>
                  {lesson.isFreePreview || isEnrolled ? <Play size={16} fill="currentColor" /> : <Lock size={16} />}
                </div>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginRight: "8px" }}>
                    Lesson {lesson.order}:
                  </span>
                  <span style={{ fontWeight: 550, color: "#fff" }}>{lesson.title}</span>
                </div>
              </div>

              {lesson.isFreePreview && !isEnrolled && (
                <button
                  onClick={() => setPreviewVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")}
                  className="btn btn-secondary btn-sm"
                  style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", fontSize: "0.8rem", color: "var(--accent-blue)", borderColor: "rgba(59, 130, 246, 0.2)" }}
                >
                  Free Preview
                </button>
              )}

              {isEnrolled && (
                <span className="badge badge-green" style={{ fontSize: "0.7rem" }}>Enrolled</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Sidebar */}
      <div>
        <div className="card-glass" style={{ position: "sticky", top: "100px", padding: "28px" }}>
          <img
            src={course.thumbnail}
            alt={course.title}
            style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: "20px" }}
          />

          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "20px" }}>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>${course.price.toFixed(2)}</span>
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
              ${(course.price * 1.5).toFixed(2)}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <Clock size={16} style={{ color: "var(--accent-purple)" }} />
              <span>Self-Paced learning</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <BookOpen size={16} style={{ color: "var(--accent-purple)" }} />
              <span>Full curriculum access</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <ShieldCheck size={16} style={{ color: "var(--accent-purple)" }} />
              <span>Verified sandbox certificate</span>
            </div>
          </div>

          {isEnrolled ? (
            <Link href={`/dashboard/learning/${course.slug}`} className="btn btn-primary" style={{ width: "100%", padding: "14px" }}>
              Continue Learning
              <ArrowRight size={18} />
            </Link>
          ) : (
            <button
              onClick={handleEnrollClick}
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating Order...
                </>
              ) : (
                "Enroll Now"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Free Preview Video Modal */}
      {previewVideoUrl && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background: "rgba(8, 11, 17, 0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div className="card-glass" style={{ width: "100%", maxWidth: "800px", background: "#0a0d16", border: "1px solid var(--border)", position: "relative" }}>
            <button
              onClick={() => setPreviewVideoUrl(null)}
              style={{ position: "absolute", top: "-40px", right: 0, background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "4px" }}
            >
              Close <XCircle size={18} />
            </button>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={previewVideoUrl}
                title="Lesson Preview"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Payment Modal */}
      {sandboxOrder && (
        <SandboxPaymentModal
          courseTitle={course.title}
          coursePrice={course.price}
          orderId={sandboxOrder.orderId}
          courseId={course.id}
          onSuccess={handleSandboxSuccess}
          onClose={() => setSandboxOrder(null)}
        />
      )}

      <style jsx>{`
        @media (max-width: 800px) {
          .detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
