import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export const FlashcardGrid = ({ questions }) => {
  const [revealed, setRevealed] = useState({});
  const toggle = (idx) => setRevealed(prev => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {questions.map((q, idx) => (
        <div
          key={idx}
          onClick={() => toggle(idx)}
          className={`relative p-6 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm
            ${revealed[idx]
              ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'}`}
        >
          <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded">
              {q.type}
            </span>
            {q.topic && (
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                {q.topic}
              </span>
            )}
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
              {revealed[idx] ? 'Hide' : 'Reveal'}
              <ChevronRight size={14} className={`transition-transform duration-300 ${revealed[idx] ? 'rotate-90' : ''}`} />
            </span>
          </div>

          <p className="text-slate-800 dark:text-slate-100 font-medium leading-relaxed">{q.question}</p>

          <div className={`mt-4 overflow-hidden transition-all duration-300 ${revealed[idx] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pt-4 border-t border-indigo-200 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {q.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
