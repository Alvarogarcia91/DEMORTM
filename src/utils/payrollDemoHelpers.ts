// =====================================================================
// Impresos RTM - Payroll Demo Helpers
// =====================================================================

export const formatCurrency = (val: number): string => {
  return `$${val.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatHours = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m > 0 ? `${m}m` : ''}`;
};

export const generateMockUuid = (): string => {
  const hex = (len: number) => {
    let result = '';
    const chars = '0123456789ABCDEF';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${hex(4)}-${hex(12)}`;
};

export const simulateAsyncAction = async <T>(action: () => T, delayMs: number = 600): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(action());
    }, delayMs);
  });
};
