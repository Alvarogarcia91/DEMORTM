import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  Building2,
  User,
  Search,
  ShoppingCart,
  Percent,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Boxes,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  SalesCustomer,
  SalesPriceList,
  SalesQuote,
  SalesQuoteItem,
  getPriceFromList,
  evaluateCommercialPolicy
} from '../../../data/mockSalesData';
import { MOCK_MASTER_ARTICLES, MasterArticle } from '../../../data/mockArticlesData';
import {
  formatCurrencyMXN,
  formatPercentage,
  formatUnits,
} from '../../../utils/formatters';
import { ModalPortal } from '../../common/ModalPortal';

interface CreateQuoteWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: SalesCustomer[];
  priceLists: SalesPriceList[];
  onSaveQuote: (newQuote: SalesQuote) => void;
  onOpenQuickClientModal?: () => void;
  initialCustomerId?: string;
}

export const CreateQuoteWizardModal: React.FC<CreateQuoteWizardModalProps> = ({
  isOpen,
  onClose,
  customers = [],
  priceLists = [],
  onSaveQuote,
  onOpenQuickClientModal,
  initialCustomerId,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Cliente
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialCustomerId || (customers[0]?.id || '')
  );
  const [clientSearch, setClientSearch] = useState('');

  // Step 2: Sucursal y Lista de Precios
  const [selectedBranchId, setSelectedBranchId] = useState<string>('wh-suc-valle-oriente');
  const [selectedPriceListId, setSelectedPriceListId] = useState<string>('pl-general-2026');

  // Step 3: Partidas
  const [items, setItems] = useState<SalesQuoteItem[]>([]);
  const [selectedArticleSku, setSelectedArticleSku] = useState('');
  const [addQuantity, setAddQuantity] = useState(1);

  // Step 4: Condiciones
  const [paymentConditions, setPaymentConditions] = useState('Contado / Transferencia SPEI');
  const [validityDays, setValidityDays] = useState(15);
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState(3);
  const [notes, setNotes] = useState('');

  // Synchronize when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      if (initialCustomerId) {
        setSelectedCustomerId(initialCustomerId);
        const cust = customers.find((c) => c.id === initialCustomerId);
        if (cust?.preferredPriceListId) setSelectedPriceListId(cust.preferredPriceListId);
        if (cust?.preferredBranch) setSelectedBranchId(cust.preferredBranch);
      } else if (!selectedCustomerId && customers.length > 0) {
        setSelectedCustomerId(customers[0].id);
      }
    }
  }, [isOpen, initialCustomerId, customers]);

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const currentPriceList = priceLists.find((p) => p.id === selectedPriceListId) || priceLists[0];

  const branchName = selectedBranchId === 'wh-suc-valle-oriente' ? 'Sucursal Valle Oriente' : 'Sucursal Cumbres';

  const handleSelectCustomer = (cust: SalesCustomer) => {
    setSelectedCustomerId(cust.id);
    if (cust.preferredPriceListId) setSelectedPriceListId(cust.preferredPriceListId);
    if (cust.preferredBranch) setSelectedBranchId(cust.preferredBranch);
  };

  const handleAddItem = (article: MasterArticle) => {
    const pricing = getPriceFromList(currentPriceList, article.sku, addQuantity);
    const costRef = article.purchasing?.internalReferenceCost || 2800;
    const localStock = article.inventory?.byWarehouse?.find((w) => w.warehouseId === selectedBranchId)?.available ?? 8;
    const discount = currentCustomer?.baseDiscountPct || 0;
    const netPrice = Math.round(pricing.suggestedPrice * (1 - discount / 100) * 100) / 100;
    const subtotal = Math.round(netPrice * addQuantity * 100) / 100;

    const newItem: SalesQuoteItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      sku: article.sku,
      productName: article.name,
      brand: article.brand,
      size: article.size,
      quantity: addQuantity,
      listPrice: pricing.listPrice,
      discountPct: discount,
      netPrice,
      subtotal,
      costReference: costRef,
      localStock,
      isManualPrice: false,
      hasVolumeTierApplied: pricing.hasTier,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedArticleSku('');
    setAddQuantity(1);
  };

  const handleUpdateItemQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const pricing = getPriceFromList(currentPriceList, item.sku, newQty);
        const net = item.isManualPrice
          ? item.netPrice
          : Math.round(pricing.suggestedPrice * (1 - item.discountPct / 100) * 100) / 100;
        return {
          ...item,
          quantity: newQty,
          listPrice: pricing.listPrice,
          netPrice: net,
          subtotal: Math.round(net * newQty * 100) / 100,
          hasVolumeTierApplied: pricing.hasTier,
        };
      })
    );
  };

  const handleUpdateItemDiscount = (itemId: string, discount: number) => {
    const clampedDiscount = Math.max(0, Math.min(100, discount));
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const pricing = getPriceFromList(currentPriceList, item.sku, item.quantity);
        const net = Math.round(pricing.suggestedPrice * (1 - clampedDiscount / 100) * 100) / 100;
        return {
          ...item,
          discountPct: clampedDiscount,
          netPrice: net,
          subtotal: Math.round(net * item.quantity * 100) / 100,
          isManualPrice: false,
        };
      })
    );
  };

  const handleUpdateItemManualPrice = (itemId: string, manualPrice: number) => {
    if (manualPrice < 0) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const discountPct =
          item.listPrice > 0 ? Math.round(((item.listPrice - manualPrice) / item.listPrice) * 1000) / 10 : 0;
        return {
          ...item,
          netPrice: manualPrice,
          subtotal: Math.round(manualPrice * item.quantity * 100) / 100,
          discountPct: discountPct > 0 ? discountPct : 0,
          isManualPrice: true,
        };
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  // Financials & Margins
  const subtotalList = items.reduce((acc, i) => acc + i.listPrice * i.quantity, 0);
  const subtotalNet = items.reduce((acc, i) => acc + i.subtotal, 0);
  const totalDiscount = Math.max(0, subtotalList - subtotalNet);
  const taxIva = Math.round(subtotalNet * 0.16 * 100) / 100;
  const total = Math.round((subtotalNet + taxIva) * 100) / 100;

  const estimatedCost = items.reduce((acc, i) => acc + i.costReference * i.quantity, 0);
  const estimatedMarginAmount = Math.max(0, subtotalNet - estimatedCost);
  const estimatedMarginPct = subtotalNet > 0 ? Math.round((estimatedMarginAmount / subtotalNet) * 1000) / 10 : 0;

  const maxDiscountPct = items.length > 0 ? Math.max(...items.map((i) => i.discountPct)) : 0;
  const avgDiscountPct =
    subtotalList > 0 ? Math.round((totalDiscount / subtotalList) * 1000) / 10 : 0;
  const hasManualPrice = items.some((i) => i.isManualPrice);

  const policyEvaluation = useMemo(() => {
    return evaluateCommercialPolicy({
      maxDiscountPct,
      averageDiscountPct: avgDiscountPct,
      hasManualPrice,
      estimatedMarginPct,
      totalNet: subtotalNet,
    });
  }, [maxDiscountPct, avgDiscountPct, hasManualPrice, estimatedMarginPct, subtotalNet]);

  // Submit Final Quote
  const handleCreateQuote = (asDraft: boolean = false) => {
    const today = new Date();
    const validDate = new Date(today);
    validDate.setDate(validDate.getDate() + validityDays);

    const folioNum = Math.floor(10 + Math.random() * 90);
    const folio = `COT-2026-00${folioNum}`;

    const newQuote: SalesQuote = {
      id: 'cot-' + Date.now(),
      folio,
      createdAt: today.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      validUntil: validDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      customerId: currentCustomer?.id || 'cli-001',
      customerName: currentCustomer?.name || 'Cliente Mostrador',
      customerRfc: currentCustomer?.rfc || 'XAXX010101000',
      customerType: currentCustomer?.type || 'Persona',
      branchId: selectedBranchId,
      branchName,
      priceListId: selectedPriceListId,
      priceListName: currentPriceList?.name || 'Lista General Retail 2026',
      sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
      items,
      financials: {
        subtotalList,
        totalDiscountAmount: totalDiscount,
        subtotalNet,
        taxIva,
        total,
        estimatedCost,
        estimatedMarginAmount,
        estimatedMarginPct,
      },
      policyStatus: policyEvaluation.status,
      policyReasons: policyEvaluation.reasons,
      status: asDraft
        ? 'Borrador'
        : policyEvaluation.isAuthorizedAutomatically
        ? 'Enviada al cliente'
        : 'Pendiente de autorización',
      notes: notes || undefined,
      paymentConditions,
      estimatedDeliveryDays,
    };

    onSaveQuote(newQuote);
    onClose();
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.rfc.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.code.toLowerCase().includes(clientSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-4xl max-h-[92vh] bg-white border border-zinc-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              Paso {step} de 5
            </span>
            <div>
              <h2 className="text-base font-black text-zinc-900 tracking-tight">
                {step === 1 && 'Seleccionar Cliente'}
                {step === 2 && 'Sucursal y Lista de Precios'}
                {step === 3 && 'Cotizador Comercial de Partidas'}
                {step === 4 && 'Condiciones Comerciales y Logísticas'}
                {step === 5 && 'Resumen Comercial y Validación'}
              </h2>
              <p className="text-xs text-zinc-500">
                {step === 1 && 'Elige o busca el cliente destinatario de la propuesta.'}
                {step === 2 && 'Define el punto de venta de despacho y la lista de precios a aplicar.'}
                {step === 3 && 'Agrega artículos, ajusta descuentos por partida y monitorea el margen estimado.'}
                {step === 4 && 'Plazos de entrega, vigencia de propuesta y esquema de pago.'}
                {step === 5 && 'Revisión final de política de precios y dictamen automático.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Progress Bar */}
        <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          {[
            { s: 1, label: '1. Cliente' },
            { s: 2, label: '2. Sucursal / Lista' },
            { s: 3, label: '3. Partidas / Márgenes' },
            { s: 4, label: '4. Condiciones' },
            { s: 5, label: '5. Resumen' },
          ].map((item) => (
            <div
              key={item.s}
              className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                step === item.s
                  ? 'bg-rose-600 text-white shadow-xs'
                  : step > item.s
                  ? 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs'
                  : 'bg-white text-zinc-500 border border-zinc-200'
              }`}
            >
              {step > item.s ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* STEP 1: CLIENTE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Buscar por nombre, código o RFC..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:border-rose-500 text-xs shadow-2xs"
                  />
                </div>

                {onOpenQuickClientModal && (
                  <button
                    type="button"
                    onClick={onOpenQuickClientModal}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 font-bold text-xs shadow-2xs hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4 text-rose-600" />
                    <span>Alta Rápida de Cliente</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[45vh] overflow-y-auto pr-1">
                {filteredCustomers.map((cust) => {
                  const isSelected = cust.id === selectedCustomerId;
                  return (
                    <div
                      key={cust.id}
                      onClick={() => handleSelectCustomer(cust)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-white border-2 border-rose-600 shadow-md'
                          : 'bg-white border-zinc-200 hover:border-zinc-400 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-rose-600 text-xs">{cust.code}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white border border-zinc-300 text-zinc-900">
                          {cust.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-zinc-900 text-sm">{cust.name}</h4>
                      <div className="text-[11px] text-zinc-500 space-y-0.5">
                        <p>RFC: {cust.rfc} &bull; Tel: {cust.phone}</p>
                        <p>Lista asignada: <strong>{cust.preferredPriceListName}</strong></p>
                        {cust.baseDiscountPct > 0 && (
                          <p className="text-emerald-600 font-bold">Descuento base acordado: {cust.baseDiscountPct}%</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SUCURSAL Y LISTA */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                  1. Sucursal de Despacho / Piso de Venta
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'wh-suc-valle-oriente', name: 'Sucursal Valle Oriente', desc: 'San Pedro Garza García, N.L. (Showroom + Almacén Local)' },
                    { id: 'wh-suc-cumbres', name: 'Sucursal Cumbres', desc: 'Monterrey Poniente, N.L. (Showroom + Almacén Local)' },
                  ].map((branch) => {
                    const isSelected = selectedBranchId === branch.id;
                    return (
                      <div
                        key={branch.id}
                        onClick={() => setSelectedBranchId(branch.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-white border-2 border-rose-600 shadow-md'
                            : 'bg-white border-zinc-200 hover:border-zinc-400 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Building2 className="w-5 h-5 text-rose-600" />
                          {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                        </div>
                        <h4 className="font-bold text-zinc-900 text-sm">{branch.name}</h4>
                        <p className="text-zinc-500 text-[11px]">{branch.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                  2. Lista de Precios de Venta Aplicable
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {priceLists.map((plist) => {
                    const isSelected = selectedPriceListId === plist.id;
                    return (
                      <div
                        key={plist.id}
                        onClick={() => setSelectedPriceListId(plist.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-white border-2 border-rose-600 shadow-md'
                            : 'bg-white border-zinc-200 hover:border-zinc-400 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-rose-600 text-xs">{plist.code}</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white border border-zinc-300 text-zinc-900">
                            {plist.targetType}
                          </span>
                        </div>
                        <h4 className="font-bold text-zinc-900 text-sm">{plist.name}</h4>
                        <p className="text-zinc-500 text-[11px]">{plist.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: COTIZADOR POR PARTIDA */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Add item bar */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-2xs space-y-3">
                <span className="font-bold text-zinc-900 text-xs block">
                  Agregar Artículo a la Cotización:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                      Artículo del Catálogo
                    </label>
                    <select
                      value={selectedArticleSku}
                      onChange={(e) => setSelectedArticleSku(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-rose-500 shadow-2xs"
                    >
                      <option value="">-- Selecciona un colchón / artículo --</option>
                      {MOCK_MASTER_ARTICLES.filter((a) => a.isActive).map((art) => (
                        <option key={art.sku} value={art.sku}>
                          {art.sku} - {art.name} ({art.size})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={addQuantity}
                      onChange={(e) => setAddQuantity(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-mono font-bold text-center shadow-2xs"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!selectedArticleSku}
                    onClick={() => {
                      const art = MOCK_MASTER_ARTICLES.find((a) => a.sku === selectedArticleSku);
                      if (art) handleAddItem(art);
                    }}
                    className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Partida</span>
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase">
                      <th className="py-3 px-3">Artículo / SKU</th>
                      <th className="py-3 px-2 text-center">Cant.</th>
                      <th className="py-3 px-2 text-right">P. Lista</th>
                      <th className="py-3 px-2 text-center">Desc %</th>
                      <th className="py-3 px-2 text-right">P. Neto</th>
                      <th className="py-3 px-3 text-right">Subtotal</th>
                      <th className="py-3 px-2 text-center">Stock</th>
                      <th className="py-3 px-2 text-center">Quitar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-zinc-400 italic">
                          No hay partidas agregadas aún. Selecciona un artículo arriba para comenzar.
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-50/60">
                          <td className="py-3 px-3">
                            <strong className="text-zinc-900 block">{item.productName}</strong>
                            <span className="font-mono text-[10px] text-rose-600">{item.sku}</span>
                            {item.hasVolumeTierApplied && (
                              <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-white border border-purple-500 text-zinc-900 ml-1">
                                Escala volumen aplicada
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => handleUpdateItemQty(item.id, parseInt(e.target.value) || 1)}
                              className="w-14 p-1 rounded-lg border border-zinc-300 bg-white text-center font-mono font-bold text-zinc-900 text-xs"
                            />
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-zinc-500">
                            {formatCurrencyMXN(item.listPrice, false, false)}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="inline-flex items-center gap-0.5">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                step={0.5}
                                value={item.discountPct}
                                onChange={(e) => handleUpdateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                                className="w-12 p-1 rounded-lg border border-zinc-300 bg-white text-center font-mono font-bold text-rose-600 text-xs"
                              />
                              <span className="font-bold text-zinc-400">%</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right font-mono font-bold text-zinc-900">
                            {formatCurrencyMXN(item.netPrice, true, false)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-black text-zinc-900">
                            {formatCurrencyMXN(item.subtotal, true, false)}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
                              item.localStock >= item.quantity
                                ? 'border-emerald-600'
                                : 'border-amber-500'
                            }`}>
                              {formatUnits(item.localStock)} disp.
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Live Margin & Policy Diagnosis */}
              {items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Diagnosis Card */}
                  <div className={`p-4 rounded-2xl border shadow-2xs space-y-2 bg-white ${
                    policyEvaluation.severity === 'critical'
                      ? 'border-rose-500'
                      : policyEvaluation.severity === 'warning'
                      ? 'border-amber-500'
                      : 'border-emerald-600'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                        {policyEvaluation.severity === 'normal' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                        Validación Comercial: <strong>{policyEvaluation.status}</strong>
                      </span>
                    </div>
                    <ul className="text-[11px] space-y-1 text-zinc-600">
                      {policyEvaluation.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-zinc-400">&bull;</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Margins Card */}
                  <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1.5">
                    <span className="font-bold text-xs text-zinc-900 block">
                      Rentabilidad Estimada:
                    </span>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Margen Comercial Estimado:</span>
                      <span className="font-mono font-black text-emerald-700 text-sm">
                        {formatPercentage(estimatedMarginPct, 1)} ({formatCurrencyMXN(estimatedMarginAmount, false)})
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 italic pt-1 border-t border-zinc-200">
                      * Margen estimado para fines de demostración sobre costo de referencia.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CONDICIONES */}
          {step === 4 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-900 block">Condición de Pago:</label>
                  <input
                    type="text"
                    value={paymentConditions}
                    onChange={(e) => setPaymentConditions(e.target.value)}
                    placeholder="Ej. Contado / Crédito 30 días"
                    className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-900 block">Días de Vigencia:</label>
                  <input
                    type="number"
                    min={1}
                    value={validityDays}
                    onChange={(e) => setValidityDays(parseInt(e.target.value) || 15)}
                    className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-mono shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-900 block">Tiempo de Entrega (días):</label>
                  <input
                    type="number"
                    min={1}
                    value={estimatedDeliveryDays}
                    onChange={(e) => setEstimatedDeliveryDays(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-mono shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-900 block">Notas Comerciales y Observaciones:</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Entrega a pie de camión en torre residencial, cliente solicita horario matutino..."
                  className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs resize-none shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* STEP 5: RESUMEN FINAL */}
          {step === 5 && (
            <div className="space-y-6">
              {/* Top 3 Info Blocks */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Cliente</span>
                  <strong className="text-zinc-900 block text-xs">{currentCustomer?.name}</strong>
                  <span className="text-[10px] text-zinc-500 font-mono">RFC: {currentCustomer?.rfc}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Sucursal / Lista</span>
                  <strong className="text-zinc-900 block text-xs">{branchName}</strong>
                  <span className="text-[10px] text-zinc-500">{currentPriceList?.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Condiciones</span>
                  <strong className="text-zinc-900 block text-xs">{paymentConditions}</strong>
                  <span className="text-[10px] text-zinc-500">Vigencia: {validityDays} días &bull; Entrega: {estimatedDeliveryDays} días</span>
                </div>
              </div>

              {/* Totals Box */}
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Partidas</span>
                  <span className="text-sm font-black font-mono text-zinc-900">
                    {items.length} {items.length === 1 ? 'partida' : 'partidas'} ({formatUnits(items.reduce((acc, i) => acc + i.quantity, 0))})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Total Cotizado</span>
                  <span className="text-xl font-black font-mono text-zinc-900">
                    {formatCurrencyMXN(total)}
                  </span>
                </div>
              </div>

              {/* Final Policy Status Card */}
              <div className={`p-4 rounded-2xl border shadow-2xs space-y-1.5 bg-white ${
                policyEvaluation.isAuthorizedAutomatically
                  ? 'border-emerald-600'
                  : 'border-amber-500'
              }`}>
                <span className="font-bold text-zinc-900 block text-xs">
                  Estado al guardar: {policyEvaluation.isAuthorizedAutomatically ? (
                    <span className="text-emerald-700">Dentro de política (Se enviará al cliente)</span>
                  ) : (
                    <span className="text-amber-700">Requiere dictamen comercial (Quedará en Pendiente de autorización)</span>
                  )}
                </span>
                <p className="text-[11px] text-zinc-600">
                  {policyEvaluation.reasons.join(' ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-zinc-200 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as any) : s))}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 disabled:opacity-30 border border-zinc-300 text-zinc-900 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            {step === 5 ? (
              <>
                <button
                  type="button"
                  onClick={() => handleCreateQuote(true)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold text-xs shadow-2xs cursor-pointer"
                >
                  Guardar como Borrador
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateQuote(false)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Emitir Cotización</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={step === 3 && items.length === 0}
                onClick={() => setStep((s) => (s < 5 ? ((s + 1) as any) : s))}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
