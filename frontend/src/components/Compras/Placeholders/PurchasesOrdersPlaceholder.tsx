import React from 'react';
import { ShoppingCart, FileSpreadsheet, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export const PurchasesOrdersPlaceholder: React.FC = () => {
 return (
 <div className="space-y-6">
 <div className="bg-theme-surface p-8 border border-theme-subtle rounded-3xl shadow-xs text-center space-y-4 max-w-2xl mx-auto my-8">
 <div className="w-14 h-14 rounded-3xl bg-white text-blue-600 flex items-center justify-center font-bold text-xl mx-auto border border-blue-500 shadow-2xs">
 <ShoppingCart className="w-7 h-7" />
 </div>
 
 <div className="space-y-1.5">
 <h3 className="text-base font-black text-theme-main">
 Órdenes de Compra
 </h3>
 <p className="text-xs text-theme-muted max-w-md mx-auto leading-relaxed">
 Este flujo se implementará en la siguiente iteración. Permitirá la emisión formal de órdenes de compra consolidadas a partir de requisiciones autorizadas, seguimiento de entregas y control de recepción.
 </p>
 </div>

 {/* Feature roadmap preview */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle text-left space-y-2 text-xs">
 <span className="text-[10px] uppercase font-black tracking-wider text-theme-muted block">
 Próximas capacidades del submódulo:
 </span>
 <ul className="space-y-1.5 text-[11px] text-theme-main">
 <li className="flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
 <span>Generación de OC a partir de requisiciones con estado <strong>Lista para compra</strong>.</span>
 </li>
 <li className="flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
 <span>Consolidación de compras por proveedor y condiciones comerciales.</span>
 </li>
 <li className="flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
 <span>Enlace directo con Recepción en Mesa de Verificación (Entradas).</span>
 </li>
 </ul>
 </div>
 </div>
 </div>
 );
};
