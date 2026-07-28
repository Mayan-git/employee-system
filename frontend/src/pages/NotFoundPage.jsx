import { Link } from "react-router-dom";
import { CompassIcon } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center dark:bg-slate-950">
      <CompassIcon className="h-12 w-12 text-slate-300 dark:text-slate-700" />
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/employees">
        <Button>Back to Employees</Button>
      </Link>
    </div>
  );
}
