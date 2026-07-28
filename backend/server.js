import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import aiRoutes from "./routes/ai.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "100kb" }));
if (env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ status: "ok", message: "API Running" }));
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

if (env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
    })
    .catch((err) => {
      console.error("DB connection error:", err.message);
      process.exit(1);
    });
}

export default app;
