import express from "express";
import { recommend } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/recommend", protect, recommend);

export default router;
