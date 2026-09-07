import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SemanticVariant, SEMANTIC_TOKENS } from './semanticTokens';
import { SemanticBadge } from './SemanticBadge';

export interface AttentionCardProps {
 tone?: SemanticVariant;
 variant?: SemanticVariant;
 title: string;
 badgeLabel?: string;
 description: React.ReactNode;
 metadata?: string;
 actionText?: string;
 onClick?: () => void;
 className?: string;
 children?: React.ReactNode;
}

export const AttentionCard: React.FC<AttentionCardProps> = ({
 tone,
 variant,
 title,
 badgeLabel,
 description,
 metadata,
 actionText = 'Ver detalle',
 onClick,
 className = '',
 children,
}) => {
 const selectedTone: SemanticVariant = tone || variant || 'warning';
 const tokens = SEMANTIC_TOKENS[selectedTone];

 return (
 <div
 onClick={onClick}
 className={`p-4 rounded-2xl bg-white border border-theme-subtle hover:${tokens.kpi.border} space-y-3 cursor-pointer transition-all flex flex-col justify-between group shadow-2xs ${className}`}
 >
 <div className="space-y-1.5">
 <div className="flex items-center justify-between gap-1">
 <strong className="text-xs font-bold text-zinc-900 truncate">
 {title}
 </strong>
 {badgeLabel && (
 <SemanticBadge tone={selectedTone} label={badgeLabel} size="sm" />
 )}
 </div>

 <div className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
 {description}
 </div>

 {metadata && (
 <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-mono">
 {metadata}
 </span>
 )}

 {children}
 </div>

 {actionText && (
 <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-xs font-bold text-zinc-900 group-hover:text-rose-600 transition-colors">
 <span>{actionText}</span>
 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
 </div>
 )}
 </div>
 );
};
