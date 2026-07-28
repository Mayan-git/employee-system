import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  department: z.string().trim().min(1, "Department is required"),
  skills: z.array(z.string().trim()).default([]),
  performanceScore: z.coerce.number().min(0).max(100),
  experience: z.coerce.number().min(0),
});

// Admins may update any field; the route layer restricts managers to
// performanceScore only regardless of what's sent here.
export const updateEmployeeSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  department: z.string().trim().min(1).optional(),
  skills: z.array(z.string().trim()).optional(),
  performanceScore: z.coerce.number().min(0).max(100).optional(),
  experience: z.coerce.number().min(0).optional(),
});

export const searchEmployeeSchema = z.object({
  department: z.string().trim().optional(),
  name: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
