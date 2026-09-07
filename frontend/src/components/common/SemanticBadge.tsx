import React from 'react';
import { SemanticVariant, SEMANTIC_TOKENS } from './semanticTokens';

export interface SemanticBadgeProps {
 /** Tone / semantic variant: success, warning, correction, danger, info, smart, neutral */
 tone?: SemanticVariant;
 /** Alias for tone */
 variant?: SemanticVariant;
 /** Label text (or pass via children) */
 label?: string;
 children?: React.ReactNode;
 size?: 'sm' | 'md' | 'xs';
 icon?: React.ComponentType<{ className?: string }>;
 showDot?: boolean;
 className?: string;
}

export const SemanticBadge: React.FC<SemanticBadgeProps> = ({
 tone,
 variant,
 label,
 children,
 size = 'md',
 icon: Icon,
 showDot = true,
 className = '',
}) => {
 const selectedTone: SemanticVariant = tone || variant || 'neutral';
 const styles = SEMANTIC_TOKENS[selectedTone].pill;
 
 const sizeClasses =
 size === 'xs'
 ? 'px-1.5 py-0.2 text-[10px]'
 : size === 'sm'
 ? 'px-2.5 py-0.5 text-[11px]'
 : 'px-3 py-1 text-xs';

 const iconColor = styles.dot.replace('bg-', 'text-');
 const content = label || children;

 return (
 <span
 className={`inline-flex items-center gap-1.5 rounded-full ${styles.base} ${sizeClasses} whitespace-nowrap shadow-2xs font-semibold leading-tight select-none ${className}`}
 >
 {Icon ? (
 <Icon className={`w-3 h-3 shrink-0 ${iconColor}`} />
 ) : showDot ? (
 <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
 ) : null}
 <span className="text-zinc-900 font-semibold">{content}</span>
 </span>
 );
};
