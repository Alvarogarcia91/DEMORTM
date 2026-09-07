import React from 'react';
import { PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
 icon?: React.ComponentType<{ className?: string }>;
 title: string;
 description?: React.ReactNode;
 actionLabel?: string;
 onAction?: () => void;
 className?: string;
 children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
 icon: Icon = PackageOpen,
 title,
 description,
 actionLabel,
 onAction,
 className = '',
 children,
}) => {
 return (
 <div
 className={`p-8 sm:p-12 text-center rounded-3xl bg-white border border-theme-subtle shadow-2xs space-y-3 max-w-md mx-auto my-6 ${className}`}
 >
 <div className="w-12 h-12 rounded-2xl bg-theme-muted text-theme-muted flex items-center justify-center mx-auto">
 <Icon className="w-6 h-6" />
 </div>

 <div className="space-y-1">
 <h4 className="text-sm font-black text-zinc-900">
 {title}
 </h4>
 {description && (
 <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
 {description}
 </p>
 )}
 </div>

 {actionLabel && onAction && (
 <div className="pt-2">
 <button
 type="button"
 onClick={onAction}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
 >
 {actionLabel}
 </button>
 </div>
 )}

 {children}
 </div>
 );
};
