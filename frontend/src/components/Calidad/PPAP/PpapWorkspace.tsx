import React, { useState } from 'react';
import {
  FileText,
  Layers,
  LayoutDashboard,
  Plus,
} from 'lucide-react';
import {
  INITIAL_PPAP_CASES,
  INITIAL_PPAP_SUGGESTIONS,
  PpapCase,
  PpapSystemSuggestion,
} from '../../../data/mockPpapData';
import { PpapDashboard } from './PpapDashboard';
import { PpapCasesList } from './PpapCasesList';
import { PpapCase360Modal } from './PpapCase360Modal';
import { PpapCreateWizardModal } from './PpapCreateWizardModal';

interface Props {
  onNavigateToProduccion?: (opFolio?: string) => void;
  onNavigateToTraceability?: (opFolio?: string) => void;
  onNotice?: (msg: string) => void;
}

export const PpapWorkspace: React.FC<Props> = ({
  onNavigateToProduccion,
  onNavigateToTraceability,
  onNotice,
}) => {
  const [cases, setCases] = useState<PpapCase[]>(INITIAL_PPAP_CASES);
  const [suggestions, setSuggestions] = useState<PpapSystemSuggestion[]>(INITIAL_PPAP_SUGGESTIONS);
  const [selectedCase, setSelectedCase] = useState<PpapCase | null>(null);
  const [selectedInitialTab, setSelectedInitialTab] = useState<string>('Resumen');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'dashboard' | 'cases'>('dashboard');

  const handleOpenCase = (c: PpapCase, initialTab: string = 'Resumen') => {
    setSelectedCase(cases.find((item) => item.id === c.id) || c);
    setSelectedInitialTab(initialTab);
  };

  const handleCreateCase = (newCase: PpapCase) => {
    setCases((prev) => [newCase, ...prev]);
    setIsWizardOpen(false);
    setSelectedCase(newCase);
    setSelectedInitialTab('Resumen');
    if (onNotice) {
      onNotice(`✓ Expediente ${newCase.folio} creado exitosamente para ${newCase.client}.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Subnavegación Dashboard vs Expedientes */}
      <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveSubView('dashboard')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeSubView === 'dashboard'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/20'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Tablero General
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('cases')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeSubView === 'cases'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/20'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Directorio de Expedientes ({cases.length})
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-theme-primary/40 bg-theme-primary/10 px-3 py-1.5 text-xs font-bold text-theme-primary hover:bg-theme-primary/20 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo Expediente
        </button>
      </div>

      {/* Vista Activa */}
      {activeSubView === 'dashboard' ? (
        <div className="space-y-8">
          <PpapDashboard
            cases={cases}
            suggestions={suggestions}
            onOpenCase={handleOpenCase}
            onNewCase={() => setIsWizardOpen(true)}
          />

          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-theme-main">
                Todos los Expedientes PPAP
              </h2>
              <button
                type="button"
                onClick={() => setActiveSubView('cases')}
                className="text-xs font-bold text-theme-primary hover:underline"
              >
                Ver tabla completa &rarr;
              </button>
            </div>
            <PpapCasesList cases={cases} onOpenCase={handleOpenCase} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-theme-main">Directorio Maestro de Expedientes PPAP</h2>
            <p className="text-xs text-theme-muted">
              Filtrado avanzado por cliente, proceso, avance y estatus de aprobación.
            </p>
          </div>
          <PpapCasesList cases={cases} onOpenCase={handleOpenCase} />
        </div>
      )}

      {/* Modal de Expediente 360 */}
      {selectedCase && (
        <PpapCase360Modal
          ppapCase={cases.find((c) => c.id === selectedCase.id) || selectedCase}
          initialTab={selectedInitialTab}
          onClose={() => setSelectedCase(null)}
          onNavigateToOp={onNavigateToProduccion}
          onNavigateToTraceability={onNavigateToTraceability}
          onToast={onNotice}
        />
      )}

      {/* Modal Wizard de Nuevo Expediente */}
      {isWizardOpen && (
        <PpapCreateWizardModal
          onClose={() => setIsWizardOpen(false)}
          onCreateCase={handleCreateCase}
        />
      )}
    </div>
  );
};
