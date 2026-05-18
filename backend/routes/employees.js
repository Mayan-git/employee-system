import express from "express";
import {
  addEmployee,
  getEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, addEmployee);
router.get("/", protect, getEmployees);
router.get("/search", protect, searchEmployees);
router.put("/:id", protect, updateEmployee);
router.delete("/:id", protect, deleteEmployee);

export default router;