import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

export default function Pagination({ page, pages, total, onPageChange }) {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Page {page} of {pages} &middot; {total} total
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={clsx(
            "flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors",
            "hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40",
            "dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          )}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className={clsx(
            "flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors",
            "hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40",
            "dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          )}
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
