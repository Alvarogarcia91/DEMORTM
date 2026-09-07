import React, { createContext, useContext, useState } from 'react';

export type OperatingFacilityType = 'CEDIS' | 'SUCURSAL';

export interface OperatingFacilityOption {
  id: string; // 'wh-mty-norte' | 'wh-mty-sur' | 'wh-suc-valle-oriente' | 'wh-suc-cumbres'
  code: string; // 'MTY-N' | 'MTY-S' | 'SUC-VO' | 'SUC-CUM'
  name: string;
  type: OperatingFacilityType;
  address: string;
  tempReceivingLocation: string; // 'REC-01', 'REC-02', 'REC-SUC-VO', 'REC-SUC-CUM'
}

// Backward compatibility alias
export type CedisOption = OperatingFacilityOption;

export const OPERATING_FACILITIES_LIST: OperatingFacilityOption[] = [
  {
    id: 'wh-mty-norte',
    code: 'MTY-N',
    name: 'CEDIS Monterrey Norte',
    type: 'CEDIS',
    address: 'Parque Industrial Monterrey Norte #100',
    tempReceivingLocation: 'REC-01',
  },
  {
    id: 'wh-mty-sur',
    code: 'MTY-S',
    name: 'CEDIS Monterrey Sur',
    type: 'CEDIS',
    address: 'Carretera Nacional Km 268',
    tempReceivingLocation: 'REC-02',
  },
  {
    id: 'wh-suc-valle-oriente',
    code: 'SUC-VO',
    name: 'Sucursal Valle Oriente',
    type: 'SUCURSAL',
    address: 'Av. Lázaro Cárdenas #1000, Valle Oriente, San Pedro Garza García, N.L.',
    tempReceivingLocation: 'REC-SUC-VO',
  },
  {
    id: 'wh-suc-cumbres',
    code: 'SUC-CUM',
    name: 'Sucursal Cumbres',
    type: 'SUCURSAL',
    address: 'Av. Paseo de los Leones #2400, Cumbres 4to Sector, Monterrey, N.L.',
    tempReceivingLocation: 'REC-SUC-CUM',
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

