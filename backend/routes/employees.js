import express from "express";
import {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  searchEmployeeSchema,
} from "../validators/employeeValidators.js";

const router = express.Router();

// Both roles can view; only admins can create or delete.
router.get("/", protect, validate({ query: searchEmployeeSchema }), getEmployees);
router.post(
  "/",
  protect,
  authorize("admin"),
  validate({ body: createEmployeeSchema }),
  addEmployee
);
router.put(
  "/:id",
  protect,
  validate({ body: updateEmployeeSchema }),
  updateEmployee
);
router.delete("/:id", protect, authorize("admin"), deleteEmployee);

export default router;
