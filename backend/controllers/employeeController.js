import Employee from "../models/Employee.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex } from "../utils/escapeRegex.js";

export const addEmployee = asyncHandler(async (req, res) => {
  const { name, email, department, skills, performanceScore, experience } = req.body;

  const exists = await Employee.findOne({ email });
  if (exists) throw new ApiError(409, "An employee with this email already exists");

  const employee = await Employee.create({
    name,
    email,
    department,
    skills,
    performanceScore,
    experience,
    createdBy: req.user.id,
  });
  res.status(201).json(employee);
});

export const getEmployees = asyncHandler(async (req, res) => {
  const { department, name, page, limit } = req.query;

  const query = {};
  if (department) query.department = { $regex: escapeRegex(department), $options: "i" };
  if (name) query.name = { $regex: escapeRegex(name), $options: "i" };

  const skip = (page - 1) * limit;
  const [employees, total] = await Promise.all([
    Employee.find(query).sort({ performanceScore: -1 }).skip(skip).limit(limit),
    Employee.countDocuments(query),
  ]);

  res.json({
    employees,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const updateEmployee = asyncHandler(async (req, res) => {
  // Managers can only adjust performance scores; admins can edit any field.
  const updates =
    req.user.role === "admin"
      ? req.body
      : { performanceScore: req.body.performanceScore };

  if (updates.performanceScore === undefined && Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const employee = await Employee.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!employee) throw new ApiError(404, "Employee not found");
  res.json(employee);
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) throw new ApiError(404, "Employee not found");
  res.json({ message: "Employee deleted successfully" });
});
