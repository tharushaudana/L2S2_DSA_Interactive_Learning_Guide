import { Info, AlertTriangle, GraduationCap } from 'lucide-react';

const VARIANTS = {
  info:    { bg: 'bg-blue-50 dark:bg-blue-900/30',    border: 'border-blue-200 dark:border-blue-700',    text: 'text-blue-800 dark:text-blue-200',    icon: Info,          iconColor: 'text-blue-500 dark:text-blue-400' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-900/30',  border: 'border-amber-200 dark:border-amber-700',  text: 'text-amber-800 dark:text-amber-200',  icon: AlertTriangle, iconColor: 'text-amber-500 dark:text-amber-400' },
  exam:    { bg: 'bg-indigo-50 dark:bg-indigo-900/40',border: 'border-indigo-200 dark:border-indigo-700',text: 'text-indigo-800 dark:text-indigo-200',icon: GraduationCap, iconColor: 'text-indigo-500 dark:text-indigo-400' },
  success: { bg: 'bg-green-50 dark:bg-green-900/30',  border: 'border-green-200 dark:border-green-700',  text: 'text-green-800 dark:text-green-200',  icon: Info,          iconColor: 'text-green-500 dark:text-green-400' },
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
