import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json(new ApiError(400, "Not authorized"))
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Server Error",
            errors: []
        });
    }
    req.user = user
    next();
  });
};
