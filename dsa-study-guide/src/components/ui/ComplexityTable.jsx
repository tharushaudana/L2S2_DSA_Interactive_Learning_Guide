export const ComplexityTable = ({ rows, columns }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col, i) => (
              <th key={i} className="p-3 font-semibold text-slate-600 whitespace-nowrap">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`p-3 ${j === 0 ? 'font-medium text-slate-800' : 'font-mono'} ${
                    typeof cell === 'string' && cell.includes('log') ? 'text-green-600' :
                    typeof cell === 'string' && cell.includes('n²') ? 'text-red-500' :
                    typeof cell === 'string' && cell.startsWith('O(n)') ? 'text-orange-500' :
                    'text-slate-600'
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
};
