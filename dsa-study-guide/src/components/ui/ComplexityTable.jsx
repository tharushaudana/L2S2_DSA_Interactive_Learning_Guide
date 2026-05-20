export const ComplexityTable = ({ rows, columns }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse text-sm">
      <thead>
        <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
          {columns.map((col, i) => (
            <th key={i} className="p-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30">
            {row.map((cell, j) => (
              <td
                key={j}
                className={`p-3 ${j === 0 ? 'font-medium text-slate-800 dark:text-slate-200' : 'font-mono'} ${
                  typeof cell === 'string' && cell.includes('log') ? 'text-green-600 dark:text-green-400' :
                  typeof cell === 'string' && cell.includes('n²') ? 'text-red-500 dark:text-red-400' :
                  typeof cell === 'string' && cell.startsWith('O(n)') ? 'text-orange-500 dark:text-orange-400' :
                  'text-slate-600 dark:text-slate-300'
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
