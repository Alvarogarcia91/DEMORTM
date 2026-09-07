import React from 'react';
import { Truck, Users, ShieldCheck, Building2 } from 'lucide-react';
import { SUPPLIERS_LIST } from '../../../data/mockRequisitionsData';

export const SuppliersPlaceholder: React.FC = () => {
 return (
 <div className="space-y-6">
 <div className="bg-theme-surface p-8 border border-theme-subtle rounded-3xl shadow-xs text-center space-y-4 max-w-3xl mx-auto my-8">
 <div className="w-14 h-14 rounded-3xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center font-bold text-xl mx-auto shadow-xs">
 <Truck className="w-7 h-7" />
 </div>
 
 <div className="space-y-1.5">
 <h3 className="text-base font-black text-theme-main">
 Catálogo de Proveedores
 </h3>
 <p className="text-xs text-theme-muted max-w-lg mx-auto leading-relaxed">
 Este flujo se implementará en una siguiente iteración. Incluirá la administración de fabricantes de sustratos, tintas y empaque (Bio-Pappel, Avery Dennison, Sun Chemical, etc.), tiempos de entrega pactados, condiciones de pago y listas de precios preferenciales.
 </p>
 </div>

 {/* Directory preview */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle text-left space-y-3">
 <span className="text-[10px] uppercase font-black tracking-wider text-theme-muted block">
 Proveedores Registrados para Operación de Requisiciones:
 </span>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
 {SUPPLIERS_LIST.map((sup, idx) => (
 <div key={idx} className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle flex items-center gap-2">
 <Building2 className="w-3.5 h-3.5 text-theme-primary shrink-0" />
 <span className="font-semibold text-theme-main truncate">{sup}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
};
