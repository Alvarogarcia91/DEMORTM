import React from 'react';
import { SemanticVariant } from './semanticTokens';
import { SemanticBadge } from './SemanticBadge';

export interface StatusBadgeProps {
 variant: SemanticVariant;
 label: string;
 size?: 'xs' | 'sm' | 'md';
 icon?: React.ComponentType<{ className?: string }>;
 showDot?: boolean;
 className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
 variant,
 label,
 size = 'md',
 icon,
 showDot = true,
 className = '',
}) => {
 return (
 <SemanticBadge
 tone={variant}
 label={label}
 size={size}
 icon={icon}
 showDot={showDot}
 className={className}
 />
 );
};
