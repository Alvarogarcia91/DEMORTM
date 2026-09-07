import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SemanticVariant, SEMANTIC_TOKENS } from './semanticTokens';

export interface SemanticKpiCardProps {
 variant: SemanticVariant;
 title: string;
 value: React.ReactNode;
 subtitle?: React.ReactNode;
 icon?: React.ComponentType<{ className?: string }>;
 linkText?: string;
 onClick?: () => void;
 className?: string;
 badge?: string;
}

export const SemanticKpiCard: React.FC<SemanticKpiCardProps> = ({
 variant,
 title,
 value,
 subtitle,
 icon: Icon,
 linkText,
 onClick,
 className = '',
 badge,
}) => {
 const styles = SEMANTIC_TOKENS[variant].kpi;

 return (
 <div
 onClick={onClick}
 className={`p-4 rounded-3xl bg-theme-surface ${styles.border} ${styles.borderHover} shadow-2xs space-y-2 flex flex-col justify-between group ${
 onClick ? 'cursor-pointer' : ''
 } ${className}`}
 >
 <div className="space-y-1.5">
 <div className="flex items-center justify-between gap-1.5">
 <span className={`flex items-center gap-1.5 ${styles.title}`}>
 {Icon && <Icon className={`w-3.5 h-3.5 ${styles.icon}`} />}
 <span>{title}</span>
 </span>
 {badge && (
 <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-theme-muted text-theme-muted font-mono">
 {badge}
 </span>
 )}
 </div>

 <div className="flex items-baseline gap-1.5">
 <strong className={`text-2xl ${styles.value} block`}>
 {value}
 </strong>
 </div>

 {subtitle && (
 <div className="text-[10px] text-theme-muted truncate">
 {subtitle}
 </div>
 )}
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
