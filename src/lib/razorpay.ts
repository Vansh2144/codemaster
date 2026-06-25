import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

// Only instantiate Razorpay if keys are present and not defaults
export const razorpay =
  keyId && keyId !== "rzp_test_yourkeyhere" && keySecret && keySecret !== "your_secret_here"
    ? new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      })
    : null;
