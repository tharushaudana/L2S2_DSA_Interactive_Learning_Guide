import { useState } from 'react';
import { FileCode2 } from 'lucide-react';

export const CodeBlock = ({ tabs, filename = 'Main.java', title = 'Java Implementation' }) => {
  const [active, setActive] = useState(tabs[0]?.id);

  const code = tabs.find(t => t.id === active)?.code || '';

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-3 border-b border-slate-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileCode2 className="text-indigo-400" size={20} /> {title}
        </h3>
        <div className="flex bg-slate-800 rounded-lg p-1 overflow-x-auto max-w-full gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors
                ${active === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal bar */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="w-3 h-3 rounded-full bg-rose-500" />
        <div className="w-3 h-3 rounded-full bg-amber-500" />
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
        <span className="ml-2 text-xs font-mono text-slate-500">{filename}</span>
      </div>

      {/* Code */}
      <pre className="p-4 font-mono text-sm text-indigo-300 overflow-x-auto leading-relaxed max-h-[420px] overflow-y-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};
