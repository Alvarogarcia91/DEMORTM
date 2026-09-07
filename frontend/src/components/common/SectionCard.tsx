import React from 'react';

export interface SectionCardProps {
 title?: React.ReactNode;
 subtitle?: React.ReactNode;
 badge?: React.ReactNode;
 icon?: React.ComponentType<{ className?: string }>;
 actions?: React.ReactNode;
 className?: string;
 headerClassName?: string;
 contentClassName?: string;
 children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
 title,
 subtitle,
 badge,
 icon: Icon,
 actions,
 className = '',
 headerClassName = '',
 contentClassName = '',
 children,
}) => {
 const hasHeader = title || subtitle || badge || Icon || actions;

 return (
 <div className={`bg-white border border-theme-subtle rounded-3xl shadow-xs overflow-hidden ${className}`}>
 {hasHeader && (
 <div className={`p-5 border-b border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white ${headerClassName}`}>
 <div className="space-y-0.5 min-w-0">
 <div className="flex items-center gap-2 flex-wrap">
 {Icon && <Icon className="w-4 h-4 text-theme-primary shrink-0" />}
 {title && (
 <h3 className="text-sm font-black text-zinc-900 tracking-tight truncate">
 {title}
 </h3>
 )}
 {badge}
 </div>
 {subtitle && (
 <p className="text-xs text-zinc-600 dark:text-zinc-400">
 {subtitle}
 </p>
 )}
 </div>

 {actions && (
 <div className="flex items-center gap-2 shrink-0">
 {actions}
 </div>
 )}
 </div>
 )}

 <div className={contentClassName || 'p-5'}>
 {children}
 </div>
 </div>
 );
};
