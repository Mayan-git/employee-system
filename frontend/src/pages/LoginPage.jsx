import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const emptyForm = { name: "", email: "", password: "" };

export default function LoginPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        await signup(form.name.trim(), form.email.trim(), form.password);
        toast.success("Account created — welcome aboard!");
      } else {
        await login(form.email.trim(), form.password);
        toast.success("Welcome back!");
      }
      navigate("/employees", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">EmployeeAI</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            HR performance analytics, powered by AI
          </p>
        </div>

        <div className="mb-6 flex rounded-lg border border-slate-200 p-1 dark:border-slate-700">
          {["Login", "Sign Up"].map((label, i) => {
            const active = isSignup === Boolean(i);
            return (
              <button
                key={label}
                type="button"
                onClick={() => setIsSignup(Boolean(i))}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand-600 text-white"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <Input
              label="Full Name"
              name="name"
              placeholder="Aman Verma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={isSignup ? 8 : undefined}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            {isSignup ? "Create Account" : "Login"}
          </Button>
        </form>

        {isSignup && (
          <p className="mt-4 text-center text-xs text-slate-400">
            The very first account created becomes an admin automatically.
          </p>
        )}
      </motion.div>
    </div>
  );
}
