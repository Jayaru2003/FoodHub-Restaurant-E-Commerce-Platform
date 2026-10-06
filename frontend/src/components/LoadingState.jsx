export default function LoadingState({ label = 'Loading delicious things...' }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 text-center shadow-soft">
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-brand-500" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
