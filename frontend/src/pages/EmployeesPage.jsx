import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Users2 } from "lucide-react";
import { useEmployees } from "../hooks/useEmployees.js";
import { useDebounce } from "../hooks/useDebounce.js";
import * as employeeService from "../services/employeeService.js";
import { getErrorMessage } from "../services/api.js";
import EmployeeSearchBar from "../components/employees/EmployeeSearchBar.jsx";
import EmployeeCard from "../components/employees/EmployeeCard.jsx";
import EditScoreModal from "../components/employees/EditScoreModal.jsx";
import EditEmployeeModal from "../components/employees/EditEmployeeModal.jsx";
import DeleteEmployeeModal from "../components/employees/DeleteEmployeeModal.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import { EmployeeCardSkeleton } from "../components/ui/Skeleton.jsx";

export default function EmployeesPage() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const debouncedName = useDebounce(name);
  const debouncedDepartment = useDebounce(department);

  const { employees, pagination, status, error, refetch } = useEmployees({
    name: debouncedName,
    department: debouncedDepartment,
    page,
  });

  const [scoreTarget, setScoreTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSearchChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleSaveScore = async (score) => {
    try {
      await employeeService.updateEmployee(scoreTarget._id, { performanceScore: score });
      toast.success("Score updated");
      setScoreTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSaveEdit = async (payload) => {
    try {
      await employeeService.updateEmployee(editTarget._id, payload);
      toast.success("Employee updated");
      setEditTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await employeeService.deleteEmployee(deleteTarget._id);
      toast.success("Employee removed");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employees</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Browse, search, and manage your team's performance records.
        </p>
      </div>

      <EmployeeSearchBar
        name={name}
        department={department}
        onNameChange={handleSearchChange(setName)}
        onDepartmentChange={handleSearchChange(setDepartment)}
        total={pagination.total}
      />

      {status === "loading" && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <EmployeeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {status === "error" && <ErrorState message={error} onRetry={refetch} />}

      {status === "success" && employees.length === 0 && (
        <EmptyState
          icon={Users2}
          title="No employees found"
          description="Try adjusting your search or filters."
        />
      )}

      {status === "success" && employees.length > 0 && (
        <>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {employees.map((employee) => (
                <EmployeeCard
                  key={employee._id}
                  employee={employee}
                  onEditScore={setScoreTarget}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                />
              ))}
            </AnimatePresence>
          </div>
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            onPageChange={setPage}
          />
        </>
      )}

      <EditScoreModal
        employee={scoreTarget}
        onClose={() => setScoreTarget(null)}
        onSave={handleSaveScore}
      />
      <EditEmployeeModal
        employee={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleSaveEdit}
      />
      <DeleteEmployeeModal
        employee={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
