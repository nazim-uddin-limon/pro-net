import { describe, it, expect } from "vitest";
import { ValidationError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from "../../../app/error.js";

describe("Error Classes", () => {
  describe("ValidationError", () => {
    it("should create error with field errors", () => {
      const errors = {
        email: ["Invalid email format"],
        password: ["Password too short"],
      };

      const error = new ValidationError(errors);

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Validation failed");
      expect(error.errors).toEqual(errors);
    });
  });

  describe("HTTP Error Classes", () => {
    it("should have correct status codes", () => {
      expect(new BadRequestError().statusCode).toBe(400);
      expect(new UnauthorizedError().statusCode).toBe(401);
      expect(new ForbiddenError().statusCode).toBe(403);
      expect(new NotFoundError().statusCode).toBe(404);
      expect(new ConflictError().statusCode).toBe(409);
    });

    it("should have custom messages", () => {
      expect(new BadRequestError("Custom message").message).toBe("Custom message");
      expect(new NotFoundError("User not found").message).toBe("User not found");
    });

    it("should be instances of Error", () => {
      expect(new BadRequestError()).toBeInstanceOf(Error);
      expect(new ConflictError()).toBeInstanceOf(Error);
    });
  });
});
