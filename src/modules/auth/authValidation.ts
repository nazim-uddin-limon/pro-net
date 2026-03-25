import { body, cookie, ValidationChain } from "express-validator";

export const registerValidation: ValidationChain[] = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail()
    .toLowerCase(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
];

export const loginValidation: ValidationChain[] = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail()
    .toLowerCase(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  body("singleDevice")
    .optional()
    .isBoolean()
    .withMessage("singleDevice must be a boolean"),
];

export const refreshTokenValidation: ValidationChain[] = [
  cookie("refresh_token")
    .notEmpty()
    .withMessage("Refresh token is required"),
];

export const logoutValidation: ValidationChain[] = [
  body("refresh_token")
    .optional()
    .notEmpty()
    .withMessage("Refresh token cannot be empty if provided"),
];
