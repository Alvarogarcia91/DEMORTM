import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';

interface ImportModalFakeProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  templateFileName: string;
  sampleColumns: string[];
  sampleRows: (string | number)[][];
  onSuccessMessage: string;
  onSuccess: () => void;
}

export const ImportModalFake: React.FC<ImportModalFakeProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  templateFileName,
  sampleColumns,
  sampleRows,
  onSuccessMessage,
  onSuccess,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateDrop = (fileName: string = templateFileName) => {
    setSelectedFile(fileName);
  };

  const handleProcessImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }, 850);
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="bg-theme-surface border border-theme-subtle rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-theme-main animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-theme-main">{title}</h3>
              <p className="text-xs text-theme-muted">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Template download notice */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-theme-subtle bg-white text-[11px]">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Formato oficial requerido: <strong>{templateFileName}</strong></span>
            </div>
            <button
              onClick={() => {
                handleSimulateDrop(templateFileName);
              }}
              className="px-2.5 py-1 rounded-lg border border-theme-subtle hover:bg-theme-muted font-semibold text-theme-primary flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Usar archivo muestra</span>
            </button>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleSimulateDrop(e.dataTransfer.files[0]?.name || templateFileName);
            }}
            onClick={() => handleSimulateDrop(templateFileName)}
            className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-theme-primary bg-theme-primary/5 ring-4 ring-theme-primary/10'
                : selectedFile
                ? 'border-emerald-500 bg-emerald-50/20'
                : 'border-theme-subtle hover:border-theme-subtle-hover bg-theme-muted/10'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedFile ? 'bg-emerald-50 text-emerald-600' : 'bg-theme-muted/40 text-theme-muted'}`}>
              {selectedFile ? <CheckCircle2 className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
            </div>

            {selectedFile ? (
              <div>
                <p className="font-bold text-sm text-theme-main">{selectedFile}</p>
                <p className="text-[11px] text-emerald-700 font-medium">Archivo cargado y validado correctamente</p>
                <p className="text-[10px] text-theme-muted mt-1">Haz clic para cambiar de archivo</p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-sm text-theme-main">Arrastra aquí tu archivo .xlsx o .csv</p>
                <p className="text-theme-muted text-[11px] mt-0.5">o haz clic para explorar en tu equipo</p>
                <p className="text-[10px] text-theme-muted mt-2">Compatible con CONTPAQi, ZKTeco, Excel y CSV UTF-8</p>
              </div>
            )}
          </div>

          {/* Validation Rules and Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[11px] uppercase tracking-wider text-theme-main">
                Vista previa de estructura (5 primeros registros)
              </span>
              <span className="text-[10px] text-theme-muted font-mono">30 filas detectadas</span>
            </div>

            <div className="border border-theme-subtle rounded-xl overflow-hidden bg-white">
              <div className="overflow-x-auto max-h-40">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-theme-muted/40 border-b border-theme-subtle text-[10px] uppercase font-bold text-theme-muted sticky top-0">
                    <tr>
                      {sampleColumns.map((col, idx) => (
                        <th key={idx} className="px-3 py-2 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle font-mono">
                    {sampleRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-theme-muted/10">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap text-theme-main">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-900 flex items-start gap-2 text-[11px]">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Validación automática RTM:</strong> El sistema verificará número de empleado, formato de hora, cruce con turnos de piso y coherencia de centros de costos antes de incorporar los datos.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme-subtle flex items-center justify-between bg-theme-muted/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleProcessImport}
            disabled={!selectedFile || isProcessing}
            className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Procesando registros...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmar e Importar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
