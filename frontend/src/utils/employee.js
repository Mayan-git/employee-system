export function scoreTone(score) {
  if (score >= 80) return "green";
  if (score >= 50) return "amber";
  return "rose";
}

export function validateEmployeeForm(form) {
  const errors = {};

  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!form.department.trim()) {
    errors.department = "Department is required";
  }
  const score = Number(form.performanceScore);
  if (form.performanceScore === "" || Number.isNaN(score) || score < 0 || score > 100) {
    errors.performanceScore = "Score must be between 0 and 100";
  }
  const experience = Number(form.experience);
  if (form.experience === "" || Number.isNaN(experience) || experience < 0) {
    errors.experience = "Enter a valid number of years";
  }

  return errors;
}
