/**
 * Formatters centralizados para localización es-MX en Impresos RTM ERP.
 */

/**
 * Formatea un monto monetario en pesos mexicanos (MXN).
 * Ejemplo: formatCurrencyMXN(115253.77) -> "$115,253.77 MXN"
 * Ejemplo: formatCurrencyMXN(601000, false) -> "$601,000 MXN"
 */
export function formatCurrencyMXN(
  amount: number | null | undefined,
  includeDecimals: boolean = true,
  includeCurrencyCode: boolean = true
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return includeCurrencyCode ? '$0.00 MXN' : '$0.00';
  }

  const formattedNumber = amount.toLocaleString('es-MX', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });

  return includeCurrencyCode
    ? `$${formattedNumber} MXN`
    : `$${formattedNumber}`;
}

/**
 * Formatea montos para KPIs grandes o tarjetas ejecutivas con separadores completos de miles.
 * Ejemplo: formatKpiCurrency(601000) -> "$601,000 MXN"
 */
export function formatKpiCurrency(amount: number | null | undefined): string {
  return formatCurrencyMXN(amount, false, true);
}

/**
 * Formatea un porcentaje localizado en español con coma decimal.
 * Ejemplo: formatPercentage(33.33) -> "33,3 %"
 * Ejemplo: formatPercentage(50, 0) -> "50 %"
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals: number = 1
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0 %';
  }

  const formatted = value
    .toFixed(decimals)
    .replace('.', ',');

  return `${formatted} %`;
}

/**
 * Formatea cantidades con sustantivo en español ("unidad" / "unidades" / "pza").
 * Ejemplo: formatUnits(1) -> "1 unidad"
 * Ejemplo: formatUnits(38) -> "38 unidades"
 */
export function formatUnits(
  count: number | null | undefined,
  singular: string = 'unidad',
  plural: string = 'unidades'
): string {
  const val = count ?? 0;
  return `${val} ${val === 1 ? singular : plural}`;
}

/**
 * Formatea fechas a formato estándar mexicano (ej. "27 Ago 2026").
 */
export function formatDateMX(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-';
  
  if (typeof dateInput === 'string' && /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/.test(dateInput.trim())) {
    // Normalizar capitalización "27 Ago 2026"
    const parts = dateInput.trim().split(/\s+/);
    if (parts.length === 3) {
      const month = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
      return `${parts[0]} ${month} ${parts[2]}`;
    }
  }

  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    const day = d.getDate();
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return String(dateInput);
  }
}
