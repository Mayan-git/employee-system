import Employee from "../models/Employee.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { anonymizeEmployees, deanonymizeText } from "../utils/anonymizeEmployees.js";

export const recommend = asyncHandler(async (req, res) => {
  if (!env.OPENROUTER_API_KEY) {
    throw new ApiError(503, "AI recommendations are not configured on this server");
  }

  const employees = await Employee.find().sort({ performanceScore: -1 });
  if (employees.length === 0) {
    throw new ApiError(400, "Add employees before requesting AI recommendations");
  }

  // Only anonymized, non-PII fields (code, department, skills, score,
  // experience) leave the server — names and emails never reach OpenRouter.
  const { anonymized, codeToName } = anonymizeEmployees(employees);

  const employeeList = anonymized
    .map(
      (e) =>
        `${e.code} | Dept: ${e.department} | Score: ${e.performanceScore}/100 | Experience: ${e.experience} yrs | Skills: ${e.skills.join(", ")}`
    )
    .join("\n");

  const prompt = `You are an expert HR consultant. Analyze these employees and provide recommendations. Refer to each employee only by their code (e.g. EMP-1).

Employees:
${employeeList}

For each employee provide:
1. Promotion Recommendation (Yes/No and why)
2. Training Suggestions (specific skills to learn)
3. Performance Feedback (2-3 sentences)
4. Overall Ranking with justification

Be specific and actionable in your recommendations.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.CORS_ORIGIN,
      "X-Title": "Employee Performance System",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  if (data.error) throw new ApiError(502, data.error.message || "AI provider error");

  const raw = data.choices?.[0]?.message?.content || "No response";
  const result = deanonymizeText(raw, codeToName);

  res.json({ result });
});
