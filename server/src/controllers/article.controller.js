import asyncHandler from "../utils/asyncHandler.js";
import Article from "../models/article.model.js";
import User from "../models/user_model.js";
import { ApiResponse } from "../utils/ApiResolve.js";
import { stripe } from "../utils/Stripe.utile.js";

const getArticle = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  console.log(req.user.email);

  const subscriptions = await stripe.subscriptions.list(
    {
      customer: user.customerStripeId,
      status: "all",
      expand: ["data.default_payment_method"],
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  if (!subscriptions.data.length) return res.json([]);

  const plan = subscriptions.data[0].plan.nickname;

  if (plan === "Basic") {
    const articles = await Article.find({ access: "Basic" });
    return res.status(200).json(new ApiResponse(200, { articles: articles }));
  } else if (plan === "Standard") {
    const articles = await Article.find({
      access: { $in: ["Basic", "Standard"] },
    });
    return res.status(200).json(new ApiResponse(200, { articles: articles }));
  } else {
    const articles = await Article.find({});
    return res.status(200).json(new ApiResponse(200, { articles: articles }));
  }

  return res.status(200).json(new ApiResponse(200, { articles: plan }));
});
export default getArticle;
