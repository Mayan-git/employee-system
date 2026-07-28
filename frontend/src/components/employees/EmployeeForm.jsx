import { useState } from "react";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { validateEmployeeForm } from "../../utils/employee.js";

const emptyForm = {
  name: "",
  email: "",
  department: "",
  skills: "",
  performanceScore: "",
  experience: "",
};

export default function EmployeeForm({ initialValues, submitLabel = "Add Employee", onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initialValues,
    skills: Array.isArray(initialValues?.skills) ? initialValues.skills.join(", ") : "",
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateEmployeeForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full Name"
          name="name"
          placeholder="Aman Verma"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="aman@company.com"
          value={form.email}
          onChange={handleChange("email")}
          error={errors.email}
        />
        <Input
          label="Department"
          name="department"
          placeholder="Engineering"
          value={form.department}
          onChange={handleChange("department")}
          error={errors.department}
        />
        <Input
          label="Skills (comma separated)"
          name="skills"
          placeholder="React, Node.js, MongoDB"
          value={form.skills}
          onChange={handleChange("skills")}
        />
        <Input
          label="Performance Score (0-100)"
          name="performanceScore"
          type="number"
          min="0"
          max="100"
          placeholder="85"
          value={form.performanceScore}
          onChange={handleChange("performanceScore")}
          error={errors.performanceScore}
        />
        <Input
          label="Years of Experience"
          name="experience"
          type="number"
          min="0"
          step="0.5"
          placeholder="3"
          value={form.experience}
          onChange={handleChange("experience")}
          error={errors.experience}
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
