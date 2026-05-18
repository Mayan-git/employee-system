import express from "express";
import { protect } from "../middleware/auth.js";
import Employee from "../models/Employee.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/recommend", protect, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    const employeeList = employees
      .map(
        (e, i) =>
          `${i + 1}. ${e.name} | Dept: ${e.department} | Score: ${e.performanceScore}/100 | Experience: ${e.experience} yrs | Skills: ${e.skills.join(", ")}`
      )
      .join("\n");

    const prompt = `You are an expert HR consultant. Analyze these employees and provide recommendations.

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
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://employee-system.vercel.app",
        "X-Title": "Employee Performance System",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const result = data.choices?.[0]?.message?.content || "No response";
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;