import { describe, it, expect } from "vitest";
import { ConflictError, UnauthorizedError, AppError } from "../../../app/error.js";

describe("Auth Errors", () => {
  describe("ConflictError", () => {
    it("should have status code 409", () => {
      const error = new ConflictError("Email already registered");
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe("Email already registered");
    });
  });

  describe("UnauthorizedError", () => {
    it("should have status code 401", () => {
      const error = new UnauthorizedError("Invalid credentials");
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Invalid credentials");
    });

    it("should have default message", () => {
      const error = new UnauthorizedError();
      expect(error.message).toBe("Unauthorized");
    });
  });

  describe("AppError", () => {
    it("should capture stack trace", () => {
      const error = new AppError(400, "Test");
      expect(error.stack).toBeDefined();
    });

    it("should be operational by default", () => {
      const error = new AppError(400, "Test");
      expect(error.isOperational).toBe(true);
    });
  });
});
