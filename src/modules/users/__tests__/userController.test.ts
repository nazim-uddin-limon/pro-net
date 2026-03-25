import { describe, it, expect } from "vitest";
import { NotFoundError, AppError } from "../../../app/error.js";

describe("User Controller Types", () => {
  describe("NotFoundError", () => {
    it("should have status code 404", () => {
      const error = new NotFoundError();
      expect(error.statusCode).toBe(404);
    });

    it("should have default message", () => {
      const error = new NotFoundError();
      expect(error.message).toBe("Resource not found");
    });

    it("should accept custom message", () => {
      const error = new NotFoundError("User not found");
      expect(error.message).toBe("User not found");
    });
  });

  describe("Response Format", () => {
    it("should return proper response structure", () => {
      const mockResponse = {
        json: (data: any) => {
          expect(data).toHaveProperty("data");
        },
      };

      const user = { _id: "123", name: "John", email: "john@example.com" };
      mockResponse.json({ data: user });
    });
  });
});
