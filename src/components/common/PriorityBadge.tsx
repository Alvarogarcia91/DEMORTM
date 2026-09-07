import React from 'react';
import { StatusBadge } from './StatusBadge';
import { SemanticVariant } from './semanticTokens';

export interface PriorityBadgeProps {
 priority: string;
 size?: 'sm' | 'md';
 className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
 priority,
 size = 'sm',
 className = '',
}) => {
 let variant: SemanticVariant = 'neutral';
 const p = (priority || '').toLowerCase().trim();

 if (p.includes('urgente') || p.includes('crític') || p.includes('critic')) {
 variant = 'danger';
 } else if (p.includes('alta') || p.includes('high')) {
 variant = 'warning';
 } else {
 variant = 'neutral';
 }

 return (
 <StatusBadge
 variant={variant}
 label={priority}
 size={size}
 className={className}
 />
 );
};
