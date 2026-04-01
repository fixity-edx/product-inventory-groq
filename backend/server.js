import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import csurf from "csurf";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// Body parsing
app.use(express.json({ limit: "1mb" }));

// Cookies (needed for CSRF + refresh patterns)
app.use(cookieParser());

// Sanitization / anti-xss
app.use(mongoSanitize());
app.use(xss());

// CORS
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(morgan("dev"));

// Rate limiting (global)
app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
}));

// CSRF protection (disabled in dev by default)
if(process.env.ENABLE_CSRF === "1"){
  app.use(csurf({
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    }
  }));

  // endpoint to fetch csrf token
  app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });
}

app.get("/", (req, res) => {
  res.json({ message: "Inventory Backend (Groq + RBAC) running ✅" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start(){
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
}
start();
