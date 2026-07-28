import { motion } from "framer-motion";
import { Star, Mail, Briefcase, Pencil, Trash2 } from "lucide-react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import { scoreTone } from "../../utils/employee.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function EmployeeCard({ employee, onEditScore, onEdit, onDelete }) {
  const { isAdmin } = useAuth();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      <Card className="p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {employee.name}
              </h3>
              <Badge tone="brand">{employee.department}</Badge>
              <Badge tone={scoreTone(employee.performanceScore)}>
                <Star className="mr-1 h-3 w-3 fill-current" />
                {employee.performanceScore}/100
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {employee.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" /> {employee.experience} yrs experience
              </span>
            </div>

            {employee.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {employee.skills.map((skill) => (
                  <Badge key={skill} tone="slate">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => (isAdmin ? onEdit(employee) : onEditScore(employee))}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Pencil className="h-3.5 w-3.5" />
              {isAdmin ? "Edit" : "Edit Score"}
            </button>
            {isAdmin && (
              <button
                onClick={() => onDelete(employee)}
                aria-label={`Delete ${employee.name}`}
                className="flex items-center justify-center rounded-lg border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
