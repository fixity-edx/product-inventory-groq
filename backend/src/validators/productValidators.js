import { body } from "express-validator";

export const createProductRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be >= 0"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be >= 0"),
  body("keywords").optional().isArray().withMessage("Keywords must be array"),
];

export const updateProductRules = [
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be >= 0"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be >= 0"),
];
