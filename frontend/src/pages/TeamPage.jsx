import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, Users2 } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import * as authService from "../services/authService.js";
import { getErrorMessage } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function TeamPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setStatus("loading");
    authService
      .listUsers()
      .then((data) => {
        setUsers(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(getErrorMessage(err));
        setStatus("error");
      });
  };

  useEffect(load, []);

  const handleRoleChange = async (id, role) => {
    setUpdatingId(id);
    try {
      await authService.updateUserRole(id, role);
      toast.success("Role updated");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage who has admin access to add, edit, and delete employee records.
        </p>
      </div>

      {status === "loading" && (
        <Card className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </Card>
      )}

      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "success" && users.length === 0 && (
        <EmptyState icon={Users2} title="No users yet" />
      )}

      {status === "success" && users.length > 0 && (
        <Card className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {u.name} {u.id === currentUser?.id && <span className="text-slate-400">(you)</span>}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {u.role === "admin" && (
                  <Badge tone="brand">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Admin
                  </Badge>
                )}
                <select
                  value={u.role}
                  disabled={u.id === currentUser?.id || updatingId === u.id}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
