import React from 'react';
import { Navigation, MapPin, Clock } from 'lucide-react';

export const EnRutaPlaceholder: React.FC = () => {
  return (
    <div className="bg-theme-surface p-12 border border-theme-subtle rounded-3xl shadow-xs text-center space-y-4 animate-in fade-in duration-200">
      <div className="w-14 h-14 rounded-2xl bg-white border border-theme-primary/30 text-theme-primary flex items-center justify-center mx-auto shadow-sm">
        <Navigation className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-zinc-300 shadow-2xs uppercase">
          Módulo en construcción
        </span>
        <h2 className="text-lg font-black text-theme-main">
          Monitoreo En Ruta & GPS
        </h2>
        <p className="text-xs text-theme-muted">
          Seguimiento en vivo de unidades vehiculares en tránsito hacia clientes residenciales y sucursales.
        </p>
      </div>
    </div>
  );
};
