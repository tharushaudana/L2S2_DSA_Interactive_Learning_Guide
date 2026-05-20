import { Info, AlertTriangle, GraduationCap } from 'lucide-react';

const VARIANTS = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Info, iconColor: 'text-blue-500' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertTriangle, iconColor: 'text-amber-500' },
  exam: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', icon: GraduationCap, iconColor: 'text-indigo-500' },
  success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: Info, iconColor: 'text-green-500' },
};

export const InfoBox = ({ variant = 'info', children, className = '' }) => {
  const v = VARIANTS[variant] || VARIANTS.info;
  const Icon = v.icon;
  return (
    <div className={`flex gap-3 items-start p-4 rounded-lg border ${v.bg} ${v.border} ${className}`}>
      <Icon size={18} className={`${v.iconColor} shrink-0 mt-0.5`} />
      <div className={`${v.text} text-sm`}>{children}</div>
    </div>
  );
};
