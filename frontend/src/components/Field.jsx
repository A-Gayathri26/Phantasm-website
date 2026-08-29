export default function Field({ label, icon, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-slate-300">{label}</span>
      <div className="field flex h-12 items-center rounded-xl border border-slate-700/80 bg-[#061524]/80 px-3">
        <span className="mr-3 text-sm text-slate-500" aria-hidden="true">{icon}</span>
        <input {...props} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600" />
      </div>
    </label>
  )
}
