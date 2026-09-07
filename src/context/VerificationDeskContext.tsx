import React, { createContext, useContext, useState } from 'react';

export type OperatingFacilityType = 'ALMACEN' | 'CEDIS' | 'SUCURSAL';

export interface OperatingFacilityOption {
  id: string; // 'wh-mty-norte' (ALM-MP) | 'wh-mty-sur' (ALM-PT)
  code: string; // 'ALM-MP' | 'ALM-PT'
  name: string;
  type: OperatingFacilityType;
  address: string;
  tempReceivingLocation: string; // 'REC-01', 'REC-02'
}

// Backward compatibility alias
export type CedisOption = OperatingFacilityOption;

export const OPERATING_FACILITIES_LIST: OperatingFacilityOption[] = [
  {
    id: 'wh-mty-norte',
    code: 'ALM-MP',
    name: 'Almacén Materia Prima',
    type: 'ALMACEN',
    address: 'Planta Principal Reynosa, Tamps. (Nave 1)',
    tempReceivingLocation: 'REC-01',
  },
  {
    id: 'wh-mty-sur',
    code: 'ALM-PT',
    name: 'Almacén Producto Terminado',
    type: 'ALMACEN',
    address: 'Planta Principal Reynosa, Tamps. (Nave 2)',
    tempReceivingLocation: 'REC-02',
  },
];

export const VERIFICATION_DESK_CEDIS_LIST = OPERATING_FACILITIES_LIST;

interface VerificationDeskContextValue {
  selectedFacilityId: string;
  selectedFacility: OperatingFacilityOption;
  facilityOptions: OperatingFacilityOption[];
  setSelectedFacilityId: (facilityId: string) => void;
  isSucursal: boolean;
  isCedis: boolean;

  // Backwards compatibility aliases
  selectedCedisId: string;
  selectedCedis: OperatingFacilityOption;
  cedisOptions: OperatingFacilityOption[];
  setSelectedCedisId: (cedisId: string) => void;
}

const VerificationDeskContext = createContext<VerificationDeskContextValue | undefined>(undefined);

const STORAGE_KEY = 'rtm_desk_active_facility';

export const VerificationDeskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFacilityId, setSelectedFacilityIdState] = useState<string>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved && OPERATING_FACILITIES_LIST.some((f) => f.id === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'wh-mty-norte';
  });

  const setSelectedFacilityId = (id: string) => {
    if (OPERATING_FACILITIES_LIST.some((f) => f.id === id)) {
      setSelectedFacilityIdState(id);
      try {
        sessionStorage.setItem(STORAGE_KEY, id);
      } catch {
        // ignore
      }
    }
  };

  const selectedFacility =
    OPERATING_FACILITIES_LIST.find((c) => c.id === selectedFacilityId) ||
    OPERATING_FACILITIES_LIST[0];

  const isSucursal = selectedFacility.type === 'SUCURSAL';
  const isCedis = selectedFacility.type === 'CEDIS';

  return (
    <VerificationDeskContext.Provider
      value={{
        selectedFacilityId,
        selectedFacility,
        facilityOptions: OPERATING_FACILITIES_LIST,
        setSelectedFacilityId,
        isSucursal,
        isCedis,

        // Aliases
        selectedCedisId: selectedFacilityId,
        selectedCedis: selectedFacility,
        cedisOptions: OPERATING_FACILITIES_LIST,
        setSelectedCedisId: setSelectedFacilityId,
      }}
    >
      {children}
    </VerificationDeskContext.Provider>
  );
};

export const useVerificationDeskCedis = (): VerificationDeskContextValue => {
  const ctx = useContext(VerificationDeskContext);
  if (!ctx) {
    throw new Error('useVerificationDeskCedis must be used within a VerificationDeskProvider');
  }
  return ctx;
};

