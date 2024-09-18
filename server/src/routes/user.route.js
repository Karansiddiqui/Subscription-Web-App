import { Router } from "express";
import { getUSer, loginUser, registerUser, signout } from "../controllers/user.controller.js";
import { body } from "express-validator";
import { verifyToken } from "../middleware/verifyUser.js";

const router = Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("The email is invalid"),
  body("password").isLength({ min: 5 }).withMessage("The password is invalid"),
  registerUser
);
router.post("/login", loginUser);
router.post("/logout", signout);
router.get("/me", verifyToken, getUSer);

export default router;