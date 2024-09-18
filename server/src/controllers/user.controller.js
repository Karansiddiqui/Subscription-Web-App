import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user_model.js";
import { ApiResponse } from "../utils/ApiResolve.js";
import { ApiError } from "../utils/ApiError.js";
import { validationResult } from "express-validator";
import { stripe } from "../utils/Stripe.utile.js";

const registerUser = asyncHandler(async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => {
      return {
        msg: error.msg,
      };
    });

    return res
      .status(400)
      .json(new ApiError(400, "Email and Password invalid", errors));
  }

  const { username, email, password } = req.body;
  if ([username, email, password].some((field) => field?.trim() === "")) {
    res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    res.status(400).json(new ApiError(409, "User with email already exists"));
  }

  const customer = await stripe.customers.create(
    {
      email,
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    customerStripeId: customer.id,
  });

  const createdUser = await User.findById(user._id).select("-password");
  console.log(createdUser);

  if (!createdUser) {
    res
      .status(400)
      .json(
        new ApiError(500, "Something went wrong while registering the user")
      );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json(new ApiError(400, "email is required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json(new ApiError(401, "Email not exists"));
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  console.log("ispass: " + isPasswordCorrect);

  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiError(401, "Invalid credentials"));
  }

  const accessToken = await user.generateToken();

  const logedInUser = await User.findById(user._id).select("-password");

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: logedInUser,
          accessToken,
        },
        "User logged in successfully"
      )
    );
});

const signout = (req, res, next) => {
  try {
    res
      .clearCookie("accessToken")
      .status(200)
      .json(new ApiResponse(200, "User logout successfully"));
  } catch (error) {
    next(error);
  }
};

const getUSer = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  console.log("server " + req.user.email);

  return res.json(new ApiResponse(200, { user }));
};

export { registerUser, loginUser, signout, getUSer };
