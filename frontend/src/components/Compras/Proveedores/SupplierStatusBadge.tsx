import React from 'react';
import { SupplierStatus } from '../../../data/mockSuppliersData';
import { StatusBadge } from '../../common/StatusBadge';

interface SupplierStatusBadgeProps {
 status: SupplierStatus;
 size?: 'sm' | 'md';
}

export const SupplierStatusBadge: React.FC<SupplierStatusBadgeProps> = ({
 status,
 size = 'md',
}) => {
 return (
 <StatusBadge
 variant={status === 'Activo' ? 'success' : 'neutral'}
 label={status}
 size={size}
 />
 );
};

