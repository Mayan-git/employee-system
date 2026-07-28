export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
      {Icon && <Icon className="h-10 w-10 text-slate-400 dark:text-slate-600" strokeWidth={1.5} />}
      <div>
        <p className="font-semibold text-slate-700 dark:text-slate-200">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
