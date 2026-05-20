export const Card = ({ children, className = '', onClick, onMouseEnter, onMouseLeave }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
);
