// Strips PII (name, email) before employee data is sent to a third-party AI
// API. Each employee is given a stable, opaque code; deanonymize() swaps the
// codes back out for real names in the AI's response text afterward.
export function anonymizeEmployees(employees) {
  const codeToName = new Map();

  const anonymized = employees.map((e, i) => {
    const code = `EMP-${i + 1}`;
    codeToName.set(code, e.name);
    return {
      code,
      department: e.department,
      skills: e.skills,
      performanceScore: e.performanceScore,
      experience: e.experience,
    };
  });

  return { anonymized, codeToName };
}

export function deanonymizeText(text, codeToName) {
  let result = text;
  for (const [code, name] of codeToName) {
    result = result.split(code).join(name);
  }
  return result;
}
