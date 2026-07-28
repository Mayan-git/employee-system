import { AlertTriangle } from "lucide-react";
import Button from "./Button.jsx";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-16 text-center dark:border-rose-900/50 dark:bg-rose-500/5">
      <AlertTriangle className="h-10 w-10 text-rose-500" strokeWidth={1.5} />
      <p className="max-w-sm text-sm font-medium text-rose-700 dark:text-rose-400">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
