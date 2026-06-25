import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findFirst({
      where: { userId, courseId, status: "ACTIVE" },
    });

    if (existingEnrollment) {
      return NextResponse.json({ message: "Already enrolled in this course" }, { status: 400 });
    }

    // Check if running in Sandbox Simulator Mode
    if (!razorpay) {
      const mockOrderId = "order_mock_" + Math.random().toString(36).substring(2, 12);
      
      // Save pending transaction
      await db.payment.create({
        data: {
          userId,
          courseId,
          amount: course.price,
          status: "PENDING",
          razorpayOrderId: mockOrderId,
        },
      });

      return NextResponse.json({
        isMock: true,
        orderId: mockOrderId,
        price: course.price,
      });
    }

    // Real Razorpay order generation
    const amountInPaise = Math.round(course.price * 100); // Razorpay processes in sub-units (paise/cents)
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save pending transaction
    await db.payment.create({
      data: {
        userId,
        courseId,
        amount: course.price,
        status: "PENDING",
        razorpayOrderId: order.id,
      },
    });

    return NextResponse.json({
      isMock: false,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: amountInPaise,
    });
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ message: "Failed to construct checkout session" }, { status: 500 });
  }
}
