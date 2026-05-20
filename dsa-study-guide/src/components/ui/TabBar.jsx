export const TabBar = ({ tabs, activeTab, onChange, className = '' }) => (
  <div className={`flex space-x-1 border-b border-slate-200 mb-6 overflow-x-auto pb-px ${className}`}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-4 py-2.5 font-medium text-sm rounded-t-lg whitespace-nowrap transition-colors flex-shrink-0
          ${activeTab === tab.id
            ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600 -mb-px'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
