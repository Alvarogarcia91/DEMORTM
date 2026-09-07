import React from 'react';
import { PurchaseOrderStatus } from '../../../data/mockPurchasesOrdersData';
import { StatusBadge } from '../../common/StatusBadge';
import { SemanticVariant } from '../../common/semanticTokens';

interface PurchaseOrderStatusBadgeProps {
 status: PurchaseOrderStatus;
 size?: 'sm' | 'md';
 delayDays?: number;
}

export const PurchaseOrderStatusBadge: React.FC<PurchaseOrderStatusBadgeProps> = ({
 status,
 size = 'md',
 delayDays,
}) => {
 let variant: SemanticVariant = 'neutral';
 const label = status === 'Atrasada' && delayDays ? `Atrasada (${delayDays}d)` : status;

 switch (status) {
 case 'Borrador':
 variant = 'neutral';
 break;
 case 'Emitida':
 variant = 'info';
 break;
 case 'Confirmada por proveedor':
 variant = 'smart';
 break;
 case 'En tránsito':
 variant = 'info';
 break;
 case 'Parcialmente recibida':
 variant = 'correction';
 break;
 case 'Recibida':
 variant = 'success';
 break;
 case 'Atrasada':
 variant = 'danger';
 break;
 case 'Cancelada':
 variant = 'neutral';
 break;
 default:
 variant = 'neutral';
 }

 return <StatusBadge variant={variant} label={label} size={size} />;
};

