import Employee from "../models/Employee.js";

export const addEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;
    if (!name || !email || !department || performanceScore === undefined || !experience)
      return res.status(400).json({ message: "All fields required" });

    const exists = await Employee.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const employee = await Employee.create({
      name, email, department, skills, performanceScore, experience,
    });
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

export const searchEmployees = async (req, res, next) => {
  try {
    const { department, name } = req.query;
    const query = {};
    if (department) query.department = { $regex: department, $options: "i" };
    if (name) query.name = { $regex: name, $options: "i" };
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    next(err);
  }
};