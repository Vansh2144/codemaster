import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      return NextResponse.json({ message: "Missing verification parameters" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    let signatureValid = false;

    // Verify signature
    if (razorpay_order_id.startsWith("order_mock_")) {
      // Sandbox simulator signature bypass
      signatureValid = razorpay_signature === "mock_signature";
    } else {
      // Real signature check
      const secret = process.env.RAZORPAY_KEY_SECRET || "";
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");
      
      signatureValid = generated_signature === razorpay_signature;
    }

    // Find the pending payment
    const payment = await db.payment.findFirst({
      where: {
        userId,
        courseId,
        razorpayOrderId: razorpay_order_id,
        status: "PENDING",
      },
    });

    if (!signatureValid) {
      if (payment) {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        });
      }
      return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
    }

    if (!payment) {
      return NextResponse.json({ message: "Matching pending transaction not found" }, { status: 404 });
    }

    // Complete transaction
    await db.$transaction([
      db.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      }),
      db.enrollment.create({
        data: {
          userId,
          courseId,
          progress: 0,
          status: "ACTIVE",
          paymentId: payment.id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Enrollment completed successfully",
    });
  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json({ message: "Transaction verification failed" }, { status: 500 });
  }
}
