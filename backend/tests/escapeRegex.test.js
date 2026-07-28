import { describe, it, expect } from "vitest";
import { escapeRegex } from "../utils/escapeRegex.js";

describe("escapeRegex", () => {
  it("escapes regex metacharacters so they are treated literally", () => {
    const escaped = escapeRegex("a.*+?^${}()|[]\\b");
    const regex = new RegExp(escaped);
    expect(regex.test("a.*+?^${}()|[]\\b")).toBe(true);
    expect(regex.test("aXXXXXXXXXXXXXXXb")).toBe(false);
  });

  it("neutralizes a classic ReDoS-style search input", () => {
    const malicious = "(a+)+$";
    const escaped = escapeRegex(malicious);
    // If unescaped, this would compile as a catastrophic-backtracking regex.
    // Escaped, it should only match the literal string.
    expect(new RegExp(escaped).test("(a+)+$")).toBe(true);
    expect(new RegExp(escaped).test("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!")).toBe(false);
  });
});
