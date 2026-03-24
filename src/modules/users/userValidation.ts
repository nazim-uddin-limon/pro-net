import { body, param, ValidationChain } from "express-validator";

export const registerValidation: ValidationChain[] = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail()
    .toLowerCase(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .bail()
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .bail()
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
  body("password").notEmpty().withMessage("Password is required"),
];

export const updateProfileValidation: ValidationChain[] = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("headline")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Headline must be at most 200 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Bio must be at most 2000 characters"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location must be at most 100 characters"),
  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),
  body("openToWork")
    .optional()
    .isBoolean()
    .withMessage("openToWork must be a boolean"),
];

export const userIdValidation: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

export const usernameValidation: ValidationChain[] = [
  param("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Username must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
];
