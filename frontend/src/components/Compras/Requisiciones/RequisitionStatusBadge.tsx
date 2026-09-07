import React from 'react';
import { RequisitionStatus, ReorderSuggestionStatus } from '../../../data/mockRequisitionsData';
import { StatusBadge } from '../../common/StatusBadge';
import { SemanticVariant } from '../../common/semanticTokens';

interface RequisitionStatusBadgeProps {
 status: RequisitionStatus | ReorderSuggestionStatus;
 size?: 'sm' | 'md';
}

export const RequisitionStatusBadge: React.FC<RequisitionStatusBadgeProps> = ({
 status,
 size = 'md',
}) => {
 let variant: SemanticVariant = 'neutral';

 switch (status) {
 case 'Borrador':
 variant = 'neutral';
 break;
 case 'Pendiente de autorización':
 variant = 'warning';
 break;
 case 'Autorizada':
 variant = 'info';
 break;
 case 'Lista para compra':
 variant = 'success';
 break;
 case 'Requiere corrección':
 variant = 'correction';
 break;
 case 'Rechazada':
 variant = 'danger';
 break;
 case 'Cancelada':
 variant = 'neutral';
 break;
 case 'Convertida en compra':
 variant = 'smart';
 break;

 // Reorder Suggestion Statuses
 case 'Reorden urgente':
 variant = 'danger';
 break;
 case 'Cobertura insuficiente':
 variant = 'warning';
 break;
 case 'Próximo a mínimo':
 variant = 'info';
 break;
 case 'Normal':
 variant = 'success';
 break;
 case 'Sobreinventario':
 variant = 'smart';
 break;
 default:
 variant = 'neutral';
 }

 return <StatusBadge variant={variant} label={status} size={size} />;
};

