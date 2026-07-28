import clsx from "clsx";
import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, className, id, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
          "dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
          error
            ? "border-rose-400 dark:border-rose-500"
            : "border-slate-300 dark:border-slate-700",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
});

export default Input;
