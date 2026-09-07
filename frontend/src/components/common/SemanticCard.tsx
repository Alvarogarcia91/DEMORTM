import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SemanticVariant, SEMANTIC_TOKENS } from './semanticTokens';

export interface SemanticCardProps {
 tone?: SemanticVariant;
 variant?: SemanticVariant;
 title?: React.ReactNode;
 value?: React.ReactNode;
 subtitle?: React.ReactNode;
 icon?: React.ComponentType<{ className?: string }>;
 badge?: React.ReactNode;
 linkText?: string;
 onClick?: () => void;
 selected?: boolean;
 className?: string;
 children?: React.ReactNode;
}

export const SemanticCard: React.FC<SemanticCardProps> = ({
 tone,
 variant,
 title,
 value,
 subtitle,
 icon: Icon,
 badge,
 linkText,
 onClick,
 selected = false,
 className = '',
 children,
}) => {
 const selectedTone: SemanticVariant = tone || variant || 'neutral';
 const styles = SEMANTIC_TOKENS[selectedTone].kpi;

 const borderClass = selected
 ? 'border-2 border-theme-primary ring-2 ring-theme-primary/20 shadow-xs'
 : `${styles.border} ${styles.borderHover} shadow-2xs`;

 return (
 <div
 onClick={onClick}
 className={`p-4 rounded-3xl bg-white ${borderClass} transition-all space-y-2 flex flex-col justify-between group select-none ${
 onClick ? 'cursor-pointer' : ''
 } ${className}`}
 >
 <div className="space-y-1.5">
 {(title || Icon || badge) && (
 <div className="flex items-center justify-between gap-1.5">
 <span className={`flex items-center gap-1.5 text-xs font-bold ${styles.title}`}>
 {Icon && <Icon className={`w-3.5 h-3.5 shrink-0 ${styles.icon}`} />}
 <span className="truncate">{title}</span>
 </span>
 {badge && (
 <div className="shrink-0 font-mono">
 {typeof badge === 'string' ? (
 <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-theme-muted text-theme-muted">
 {badge}
 </span>
 ) : (
 badge
 )}
 </div>
 )}
 </div>
 )}

 {value !== undefined && (
 <div className="flex items-baseline gap-1.5">
 <strong className="text-2xl font-mono font-black text-zinc-900 block">
 {value}
 </strong>
 </div>
 )}

 {subtitle && (
 <div className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium truncate">
 {subtitle}
 </div>
 )}

 {children}
 </div>

 {linkText && (
 <div className={`text-[11px] ${styles.link} flex items-center gap-1 pt-1.5 border-t border-theme-subtle group-hover:underline transition-all`}>
 <span>{linkText}</span>
 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
 </div>
 )}
 </div>
 );
};
