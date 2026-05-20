export const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
        <Icon size={24} />
      </div>
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
    </div>
    {description && <p className="text-slate-600 text-lg">{description}</p>}
  </div>
);
