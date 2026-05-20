export const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
        <Icon size={24} />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
    </div>
    {description && <p className="text-slate-600 dark:text-slate-400 text-lg">{description}</p>}
  </div>
);
