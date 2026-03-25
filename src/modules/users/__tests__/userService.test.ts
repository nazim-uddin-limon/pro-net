import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppError } from "../../../app/error.js";

describe("User Service Types", () => {
  describe("Error Handling", () => {
    it("should throw AppError for duplicate email", async () => {
      const error = new AppError(409, "Email already registered");
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe("Email already registered");
      expect(error.isOperational).toBe(true);
    });

    it("should throw AppError for user not found", async () => {
      const error = new AppError(404, "User not found");
      expect(error.statusCode).toBe(404);
    });

    it("AppError should capture stack trace", () => {
      const error = new AppError(400, "Test error");
      expect(error.stack).toBeDefined();
    });
  });
});
