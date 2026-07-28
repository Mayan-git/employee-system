import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: { type: String, required: true, trim: true },
    skills: { type: [String], default: [] },
    performanceScore: { type: Number, required: true, min: 0, max: 100 },
    experience: { type: Number, required: true, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ name: "text" });

export default mongoose.model("Employee", EmployeeSchema);
