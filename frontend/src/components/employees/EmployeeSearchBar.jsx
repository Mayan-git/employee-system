import { Search, Building2 } from "lucide-react";

export default function EmployeeSearchBar({ name, department, onNameChange, onDepartmentChange, total }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <div className="relative flex-1">
        <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          placeholder="Filter by department..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <span className="shrink-0 text-sm text-slate-500 dark:text-slate-400">
        {total} {total === 1 ? "employee" : "employees"}
      </span>
    </div>
  );
}
