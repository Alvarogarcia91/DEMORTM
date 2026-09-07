// =========================================================================
// RTM DEMO — CONTEXTO GLOBAL DE ALERTAS TRANSVERSAL
// Permite consultar alertas, marcar atendida/resuelta y navegar directamente
// =========================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DemoAlert, INITIAL_MOCK_ALERTS, AlertStatus, AlertPriority, AlertModule } from '../data/mockAlertasData';

const STORAGE_KEY = 'rtm_demo_alerts_v1';

interface AlertasContextType {
  alerts: DemoAlert[];
  pendingCount: number;
  criticalCount: number;
  todayCount: number;
  resolvedTodayCount: number;
  markAsAttended: (alertId: string) => void;
  markAsResolved: (alertId: string, note?: string) => void;
  markAllAsAttended: () => void;
  resetAlerts: () => void;
}

const AlertasContext = createContext<AlertasContextType | undefined>(undefined);

export const AlertasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<DemoAlert[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_MOCK_ALERTS;
        }
      }
    }
    return INITIAL_MOCK_ALERTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [alerts]);

  const pendingCount = alerts.filter((a) => a.estado === 'Pendiente').length;
  const criticalCount = alerts.filter((a) => a.estado === 'Pendiente' && a.prioridad === 'Crítica').length;
  const todayCount = alerts.filter((a) => a.timing === 'Hoy' && a.estado !== 'Resuelta').length;
  const resolvedTodayCount = alerts.filter((a) => a.estado === 'Resuelta').length;

  const markAsAttended = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, estado: 'Atendida' as AlertStatus } : a))
    );
  };

  const markAsResolved = (alertId: string, note?: string) => {
    const todayStr = 'Hoy 08:45';
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              estado: 'Resuelta' as AlertStatus,
              resolucion: {
                resueltoPor: 'Admin Demo (Gerencia de Operaciones)',
                fecha: todayStr,
                accionRealizada: note || 'Alerta atendida y resuelta en módulo operativo.',
              },
            }
          : a
      )
    );
  };

  const markAllAsAttended = () => {
    setAlerts((prev) =>
      prev.map((a) => (a.estado === 'Pendiente' ? { ...a, estado: 'Atendida' as AlertStatus } : a))
    );
  };

  const resetAlerts = () => {
    setAlerts(INITIAL_MOCK_ALERTS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AlertasContext.Provider
      value={{
        alerts,
        pendingCount,
        criticalCount,
        todayCount,
        resolvedTodayCount,
        markAsAttended,
        markAsResolved,
        markAllAsAttended,
        resetAlerts,
      }}
    >
      {children}
    </AlertasContext.Provider>
  );
};

export const useAlertas = () => {
  const context = useContext(AlertasContext);
  if (!context) {
    throw new Error('useAlertas must be used within an AlertasProvider');
  }
  return context;
};
