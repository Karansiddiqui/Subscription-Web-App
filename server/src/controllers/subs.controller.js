import User from "../models/user_model.js";
import { ApiResponse } from "../utils/ApiResolve.js";
import { ApiError } from "../utils/ApiError.js";
import { stripe } from "../utils/Stripe.utile.js";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();

const getPrices = asyncHandler(async (req, res) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });
  return res.status(200).json(new ApiResponse(200, { data: prices.data }));
});

const createStripeSession = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).select(
    "-password"
  );

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, { message: "User not found" }));
  }

  if (!req.body.priceId) {
    return res
      .status(400)
      .json(new ApiResponse(400, { message: "Price ID is required" }));
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/articles`,
      cancel_url: `${process.env.FRONTEND_URL}/articles-plans`,
      customer: user.customerStripeId,
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  return res.status(200).json(new ApiResponse(200, { data: session }));
});

const findSubscriptionByCustomerId = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  const subscriptions = await stripe.subscriptions.list({
    customer: user.customerStripeId,
    limit: 1,
  });

  if (subscriptions.data.length === 0) {
    return res.status(404).json(
      new ApiError(400, {
        message: "No subscription found for this customer",
      })
    );
  }

  const subscription = subscriptions.data[0];

  res.status(200).json(new ApiResponse(200, { data: subscription }));
});

export { getPrices, createStripeSession, findSubscriptionByCustomerId };
