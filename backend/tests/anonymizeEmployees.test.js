import { describe, it, expect } from "vitest";
import { anonymizeEmployees, deanonymizeText } from "../utils/anonymizeEmployees.js";

describe("anonymizeEmployees", () => {
  const employees = [
    { name: "Aman Verma", email: "aman@x.com", department: "Engineering", skills: ["React"], performanceScore: 90, experience: 3 },
    { name: "Priya Shah", email: "priya@x.com", department: "Design", skills: ["Figma"], performanceScore: 75, experience: 2 },
  ];

  it("strips name and email from the anonymized payload", () => {
    const { anonymized } = anonymizeEmployees(employees);
    for (const e of anonymized) {
      expect(e).not.toHaveProperty("name");
      expect(e).not.toHaveProperty("email");
      expect(e.code).toMatch(/^EMP-\d+$/);
    }
  });

  it("assigns stable, unique codes in order", () => {
    const { anonymized } = anonymizeEmployees(employees);
    expect(anonymized[0].code).toBe("EMP-1");
    expect(anonymized[1].code).toBe("EMP-2");
  });

  it("maps codes back to real names in AI output", () => {
    const { codeToName } = anonymizeEmployees(employees);
    const aiText = "EMP-1 should be promoted. EMP-2 needs more training than EMP-1.";
    const result = deanonymizeText(aiText, codeToName);
    expect(result).toBe(
      "Aman Verma should be promoted. Priya Shah needs more training than Aman Verma."
    );
  });
});
