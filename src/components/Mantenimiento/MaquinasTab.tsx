import React, { useState } from 'react';
import { 
  HardDrive, Search, Filter, Wrench, Shield, CheckCircle, 
  AlertTriangle, Clock, MapPin, Gauge, Eye, Plus, ChevronRight
} from 'lucide-react';
import { 
  MachineEquipment, 
  CRITICALITY_LABELS, 
  STATUS_LABELS 
} from '../../data/mockMaintenanceData';

interface MaquinasTabProps {
  machines: MachineEquipment[];
  onSelectMachine: (machine: MachineEquipment) => void;
  onNewOrderForMachine: (machineId: string) => void;
}

export const MaquinasTab: React.FC<MaquinasTabProps> = ({
  machines,
  onSelectMachine,
  onNewOrderForMachine
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all');

  const areas = Array.from(new Set(machines.map(m => m.area)));

  const filteredMachines = machines.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brandModelDemo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.serialNumberDemo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = selectedArea === 'all' || m.area === selectedArea;
    const matchesStatus = selectedStatus === 'all' || m.status === selectedStatus;
    const matchesCriticality = selectedCriticality === 'all' || m.criticality === selectedCriticality;

    return matchesSearch && matchesArea && matchesStatus && matchesCriticality;
  });

  const getStatusBadge = (status: MachineEquipment['status']) => {
    switch (status) {
      case 'Operativo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            {STATUS_LABELS[status]}
          </span>
        );
      case 'Fuera de servicio':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            {STATUS_LABELS[status]}
          </span>
        );
      case 'Mantenimiento programado':
      case 'En inspección':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            {STATUS_LABELS[status]}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
            {STATUS_LABELS[status]}
          </span>
        );
    }
  };

  const getCriticalityBadge = (crit: MachineEquipment['criticality']) => {
    const meta = CRITICALITY_LABELS[crit];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${meta.bgColor} ${meta.color} ${meta.borderColor}`}>
        <Shield className="w-3 h-3" />
        {meta.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, nombre, marca o serie..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
            />
          </div>

          {/* Area filter */}
          <div>
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
            >
              <option value="all">Todas las Áreas</option>
              {areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
            >
              <option value="all">Todos los Estados</option>
              <option value="Operativo">Operativo</option>
              <option value="Fuera de servicio">Fuera de servicio (Paro)</option>
              <option value="Mantenimiento programado">Mantenimiento programado</option>
              <option value="En inspección">En inspección</option>
            </select>
          </div>

          {/* Criticality filter */}
          <div>
            <select
              value={selectedCriticality}
              onChange={e => setSelectedCriticality(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
            >
              <option value="all">Criticidad (Todas)</option>
              <option value="Alta">Alta / Crítica</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-theme-muted pt-2 border-t border-theme-subtle">
          <span>Mostrando <strong className="text-theme-main">{filteredMachines.length}</strong> de {machines.length} equipos</span>
          {(searchTerm || selectedArea !== 'all' || selectedStatus !== 'all' || selectedCriticality !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedArea('all');
                setSelectedStatus('all');
                setSelectedCriticality('all');
              }}
              className="text-theme-primary font-semibold hover:underline"
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Machines Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredMachines.map(machine => (
          <div
            key={machine.id}
            className="p-5 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-theme-primary/40 transition-all shadow-sm flex flex-col justify-between space-y-4 group"
          >
            {/* Top row */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-theme-primary bg-theme-primary/10 px-2.5 py-0.5 rounded border border-theme-primary/20">
                      {machine.code}
                    </span>
                    {getCriticalityBadge(machine.criticality)}
                  </div>
                  <h3 className="text-sm font-bold text-theme-main group-hover:text-theme-primary transition-colors">
                    {machine.name}
                  </h3>
                  <p className="text-xs text-theme-muted flex items-center gap-1.5 mt-0.5">
                    <span>{machine.brandModelDemo}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      {machine.area}
                    </span>
                  </p>
                </div>

                <div className="shrink-0">
                  {getStatusBadge(machine.status)}
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-theme-subtle/20 border border-theme-subtle text-xs">
                <div>
                  <span className="text-theme-muted block text-[10px]">Horas acumuladas</span>
                  <span className="font-mono font-bold text-theme-main flex items-center gap-1 mt-0.5">
                    <Gauge className="w-3.5 h-3.5 text-theme-primary" />
                    {machine.totalOperatingHours.toLocaleString()} hrs
                  </span>
                </div>
                <div>
                  <span className="text-theme-muted block text-[10px]">Próximo Preventivo</span>
                  <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 block mt-0.5">
                    {machine.nextPreventiveDate}
                  </span>
                </div>
              </div>

              {/* Specs badges */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px] text-theme-muted">
                <span className="px-2 py-0.5 rounded bg-theme-subtle/40 border border-theme-subtle font-mono">
                  S/N: {machine.serialNumberDemo}
                </span>
                <span className="px-2 py-0.5 rounded bg-theme-subtle/40 border border-theme-subtle">
                  {machine.category}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-theme-subtle flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectMachine(machine)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-theme-subtle text-theme-main hover:bg-theme-subtle/80 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                Ficha Técnica
              </button>

              <button
                onClick={() => onNewOrderForMachine(machine.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-theme-primary text-theme-primary-contrast hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Wrench className="w-3.5 h-3.5" />
                Generar OT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
