import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export interface StrategyMetric {
 label: string;
 value: string | number;
 isEmphasized?: boolean;
}

export interface StrategyCardProps {
 title: string;
 badge?: string;
 isSelected?: boolean;
 onClick?: () => void;
 metrics?: StrategyMetric[];
 ratingStars?: number;
 icon?: React.ComponentType<{ className?: string }>;
 isRecommended?: boolean;
 className?: string;
 children?: React.ReactNode;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
 title,
 badge,
 isSelected = false,
 onClick,
 metrics = [],
 ratingStars,
 icon: CustomIcon,
 isRecommended = false,
 className = '',
 children,
}) => {
 return (
 <div
 onClick={onClick}
 className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative overflow-hidden bg-white select-none ${
 isSelected
 ? 'border-2 border-theme-primary ring-2 ring-theme-primary/20 text-zinc-900 shadow-xs'
 : 'border-theme-subtle hover:border-theme-primary/40 text-theme-main'
 } ${className}`}
 >
 {/* Header with Title and Badge/Sparkles/Check */}
 <div className="flex items-center justify-between gap-1.5">
 <div className="flex items-center gap-1.5 min-w-0">
 {CustomIcon ? (
 <CustomIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-theme-primary' : 'text-theme-muted'}`} />
 ) : isSelected ? (
 <Check className="w-3.5 h-3.5 text-theme-primary shrink-0 font-bold" />
 ) : null}
 <span className="text-xs font-black truncate">{title}</span>
 </div>

 {isRecommended ? (
 <Sparkles className="w-3.5 h-3.5 text-rose-600 shrink-0" />
 ) : badge ? (
 <span
 className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
 isSelected
 ? 'bg-theme-primary/10 text-theme-primary border border-theme-primary/30'
 : 'bg-theme-muted text-theme-muted'
 }`}
 >
 {badge}
 </span>
 ) : null}
 </div>

 {/* Metrics list */}
 {metrics.length > 0 && (
 <div className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono space-y-0.5">
 {metrics.map((m, idx) => (
 <div key={idx} className={m.isEmphasized ? 'text-zinc-900 font-bold' : ''}>
 {m.label}: <strong className="text-zinc-900">{m.value}</strong>
 </div>
 ))}
 </div>
 )}

 {children}

 {/* Rating stars if provided */}
 {ratingStars !== undefined && (
 <div className="flex items-center text-rose-600 text-[10px]">
 {Array.from({ length: 5 }, (_, i) => (
 <span key={i} className={i < ratingStars ? 'opacity-100' : 'opacity-25'}>
 ★
 </span>
 ))}
 </div>
 )}
 </div>
 );
};
