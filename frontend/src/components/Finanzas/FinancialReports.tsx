import React, { useState } from 'react';
import { AccountReceivable, SupplierInvoice } from '../../data/mockFinanzasData';
import { ReportLibraryLanding } from './reports/ReportLibraryLanding';
import { ReportViewer } from './reports/ReportViewer';

interface FinancialReportsProps {
  d?: any;
  cxc: AccountReceivable[];
  cxp: SupplierInvoice[];
  toast: (msg: string) => void;
  initialReportId?: string | null;
  onNavigateToAsset?: (assetId: string) => void;
  onNavigateToMaintenance?: (machineCode: string) => void;
  onNavigateToInvoice?: (folio: string) => void;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({
  cxc,
  cxp,
  toast,
  initialReportId = null,
  onNavigateToAsset,
  onNavigateToMaintenance,
  onNavigateToInvoice
}) => {
  const [activeReportId, setActiveReportId] = useState<string | null>(initialReportId);

  return (
    <div className="w-full">
      {activeReportId ? (
        <ReportViewer
          reportId={activeReportId}
          onBack={() => setActiveReportId(null)}
          cxc={cxc}
          cxp={cxp}
          onNavigateToAsset={onNavigateToAsset}
          onNavigateToMaintenance={onNavigateToMaintenance}
          onNavigateToInvoice={onNavigateToInvoice}
          toast={toast}
        />
      ) : (
        <ReportLibraryLanding
          onSelectReport={(reportId) => setActiveReportId(reportId)}
        />
      )}
    </div>
  );
};
