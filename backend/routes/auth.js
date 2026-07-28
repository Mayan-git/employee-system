import express from "express";
import {
  signup,
  login,
  getMe,
  listUsers,
  updateUserRole,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { signupSchema, loginSchema, updateRoleSchema } from "../validators/authValidators.js";

const router = express.Router();

router.post("/signup", authLimiter, validate({ body: signupSchema }), signup);
router.post("/login", authLimiter, validate({ body: loginSchema }), login);
router.get("/me", protect, getMe);

// Admin-only user management (role assignment)
router.get("/users", protect, authorize("admin"), listUsers);
router.patch(
  "/users/:id/role",
  protect,
  authorize("admin"),
  validate({ body: updateRoleSchema }),
  updateUserRole
);

export default router;
