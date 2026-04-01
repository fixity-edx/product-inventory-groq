import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { createProductRules, updateProductRules } from "../validators/productValidators.js";
import { validate } from "../middleware/validate.js";
import {
  listProducts,
  createProduct,
  updateProduct,
  generateProductDescription
} from "../controllers/productController.js";

const router = Router();

// Users can view
router.get("/", protect, listProducts);

// Admin only operations
router.post("/", protect, requireRole("admin"), createProductRules, validate, createProduct);
router.put("/:id", protect, requireRole("admin"), updateProductRules, validate, updateProduct);
router.post("/:id/generate-description", protect, requireRole("admin"), generateProductDescription);

export default router;
