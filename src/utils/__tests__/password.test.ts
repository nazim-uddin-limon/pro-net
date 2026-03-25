import { describe, it, expect, vi, beforeEach } from "vitest";
import * as passwordUtils from "../password.js";

describe("Password Utils", () => {
  it("should hash a password", async () => {
    const password = "TestPassword123";
    const hash = await passwordUtils.hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should verify correct password", async () => {
    const password = "TestPassword123";
    const hash = await passwordUtils.hashPassword(password);
    
    const isValid = await passwordUtils.verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject incorrect password", async () => {
    const password = "TestPassword123";
    const hash = await passwordUtils.hashPassword(password);
    
    const isValid = await passwordUtils.verifyPassword("WrongPassword", hash);
    expect(isValid).toBe(false);
  });

  it("should generate different hashes for same password", async () => {
    const password = "TestPassword123";
    const hash1 = await passwordUtils.hashPassword(password);
    const hash2 = await passwordUtils.hashPassword(password);
    
    expect(hash1).not.toBe(hash2);
  });
});
