import crypto from "crypto";
import { razorpay } from "../config/razorpay.js";
import { PLANS } from "../config/pricing.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  const { plan } = req.body;

  if (!PLANS[plan]) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  const order = await razorpay.orders.create({
    amount: PLANS[plan].amount,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`
  });

  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    plan
  });
};

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: "Payment verification failed" });
  }

  // Payment valid — add credits
  const user = await User.findById(req.user._id);
  user.scanCredits += PLANS[plan].credits;
  user.role = "PAID";
  await user.save();

  res.json({
    message: "Payment successful",
    scanCredits: user.scanCredits
  });
};
