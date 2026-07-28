import { describe, it, expect } from "vitest";
import { scoreTone, validateEmployeeForm } from "./employee.js";

describe("scoreTone", () => {
  it("returns green for scores >= 80", () => {
    expect(scoreTone(80)).toBe("green");
    expect(scoreTone(100)).toBe("green");
  });

  it("returns amber for scores between 50 and 79", () => {
    expect(scoreTone(50)).toBe("amber");
    expect(scoreTone(79)).toBe("amber");
  });

  it("returns rose for scores below 50", () => {
    expect(scoreTone(0)).toBe("rose");
    expect(scoreTone(49)).toBe("rose");
  });
});

describe("validateEmployeeForm", () => {
  const validForm = {
    name: "Aman Verma",
    email: "aman@example.com",
    department: "Engineering",
    skills: "React, Node",
    performanceScore: "85",
    experience: "3",
  };

  it("returns no errors for a fully valid form", () => {
    expect(validateEmployeeForm(validForm)).toEqual({});
  });

  it("flags a short name", () => {
    const errors = validateEmployeeForm({ ...validForm, name: "A" });
    expect(errors.name).toBeTruthy();
  });

  it("flags an invalid email", () => {
    const errors = validateEmployeeForm({ ...validForm, email: "not-an-email" });
    expect(errors.email).toBeTruthy();
  });

  it("flags a performance score outside 0-100", () => {
    expect(validateEmployeeForm({ ...validForm, performanceScore: "150" }).performanceScore).toBeTruthy();
    expect(validateEmployeeForm({ ...validForm, performanceScore: "-5" }).performanceScore).toBeTruthy();
  });

  it("flags a negative experience value", () => {
    const errors = validateEmployeeForm({ ...validForm, experience: "-1" });
    expect(errors.experience).toBeTruthy();
  });

  it("flags an empty department", () => {
    const errors = validateEmployeeForm({ ...validForm, department: "  " });
    expect(errors.department).toBeTruthy();
  });
});
