import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { SemanticVariant, SEMANTIC_TOKENS } from './semanticTokens';

export interface SemanticAlertProps {
 variant: SemanticVariant;
 title?: string;
 message?: React.ReactNode;
 icon?: React.ComponentType<{ className?: string }>;
 className?: string;
 children?: React.ReactNode;
 action?: React.ReactNode;
}

const DEFAULT_ICONS: Record<SemanticVariant, React.ComponentType<{ className?: string }>> = {
 success: CheckCircle2,
 warning: AlertTriangle,
 correction: AlertTriangle,
 danger: AlertCircle,
 info: Info,
 smart: Sparkles,
 neutral: Info,
};

export const SemanticAlert: React.FC<SemanticAlertProps> = ({
 variant,
 title,
 message,
 icon: CustomIcon,
 className = '',
 children,
 action,
}) => {
 const styles = SEMANTIC_TOKENS[variant].alert;
 const Icon = CustomIcon || DEFAULT_ICONS[variant];

 return (
 <div
 className={`p-3.5 rounded-2xl ${styles.container} flex items-start justify-between gap-3 text-xs ${className}`}
 >
 <div className="flex items-start gap-2.5 flex-1 min-w-0">
 <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${styles.icon}`} />
 <div className="space-y-0.5 flex-1">
 {title && <div className={`font-bold ${styles.title}`}>{title}</div>}
 {message && <div className={`text-[11px] ${styles.text}`}>{message}</div>}
 {children}
 </div>
 </div>
 {action && <div className="shrink-0">{action}</div>}
 </div>
 );
};
