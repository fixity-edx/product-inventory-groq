import { Router } from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { signupRules, loginRules } from "../validators/authValidators.js";
import { validate } from "../middleware/validate.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Stronger limit on auth endpoints
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

router.post("/signup", authLimiter, signupRules, validate, signup);
router.post("/login", authLimiter, loginRules, validate, login);
router.post("/logout", logout);

export default router;
