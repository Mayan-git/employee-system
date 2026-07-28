import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../components/ui/Card.jsx";
import EmployeeForm from "../components/employees/EmployeeForm.jsx";
import * as employeeService from "../services/employeeService.js";
import { getErrorMessage } from "../services/api.js";

export default function AddEmployeePage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      await employeeService.createEmployee(payload);
      toast.success("Employee added successfully");
      navigate("/employees");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Employee</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create a new employee performance record.
        </p>
      </div>
      <Card className="p-6 sm:p-8">
        <EmployeeForm onSubmit={handleSubmit} onCancel={() => navigate("/employees")} />
      </Card>
    </div>
  );
}
