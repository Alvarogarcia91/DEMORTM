import React, { useState } from 'react';
import { X, Plus, User, Building2, Phone, Mail, MapPin, Check } from 'lucide-react';
import { SalesCustomer } from '../../../data/mockSalesData';
import { ModalPortal } from '../../common/ModalPortal';

interface QuickClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomer: (newCustomer: SalesCustomer) => void;
}

export const QuickClientFormModal: React.FC<QuickClientFormModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomer,
}) => {
  const [type, setType] = useState<SalesCustomer['type']>('Empresa');
  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [rfc, setRfc] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [preferredBranch, setPreferredBranch] = useState('wh-alm-rtm');
  const [preferredPriceListId, setPreferredPriceListId] = useState('pl-ind-sbd-2026');
  const [street, setStreet] = useState('');
  const [extNumber, setExtNumber] = useState('1000');
  const [neighborhood, setNeighborhood] = useState('Parque Industrial Milimex');
  const [city, setCity] = useState('Apodaca');
  const [state, setState] = useState('Nuevo León');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const codeNum = Math.floor(100 + Math.random() * 900);
    const code = 'CLI-2026-' + codeNum;
    const branchName = preferredBranch === 'wh-alm-rtm' ? 'Planta Principal RTM' : 'Almacén Virtual / Control';
    const priceListName =
      preferredPriceListId === 'pl-ind-sbd-2026'
        ? 'Tarifa Industrial Stanley B&D 2026'
        : preferredPriceListId === 'pl-farmaceutica-2026'
        ? 'Tarifa Farmacéutica & Etiquetas 2026'
        : 'Tarifa General Flexo & Offset 2026';

    const newCust: SalesCustomer = {
      id: 'cust-' + Date.now(),
      code,
      name,
      legalName: legalName || name,
      rfc: rfc || 'XAXX010101000',
      type,
      phone,
      email: email || 'contacto@demo.com',
      preferredBranch,
      preferredBranchName: branchName,
      preferredPriceListId,
      preferredPriceListName: priceListName,
      baseDiscountPct: type === 'Convenio' ? 10 : type === 'Empresa' ? 5 : 0,
      creditDays: type === 'Persona' ? 0 : 30,
      status: 'Activo',
      contacts: [
        {
          id: 'con-' + Date.now(),
          name: contactName || name,
          role: type === 'Persona' ? 'Titular' : 'Compras / Contacto Principal',
          phone,
          email: email || 'contacto@demo.com',
          isMain: true,
        },
      ],
      addresses: street
        ? [
            {
              id: 'addr-' + Date.now(),
              type: 'Entrega',
              street,
              extNumber: extNumber || '1000',
              neighborhood: neighborhood || 'Parque Industrial Milimex',
              city,
              state,
              postalCode: '66600',
              reference: 'Dirección capturada en alta rápida industrial',
            },
          ]
        : [],
      totalQuotesCount: 0,
      totalOrdersCount: 0,
      totalSpent: 0,
      lastPurchaseDate: '',
      createdAt: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes: 'Alta rápida en sistema comercial RTM.',
    };

    onSaveCustomer(newCust);
    onClose();
  };

  return (
    <ModalPortal zIndex={1100} onClose={onClose} closeOnBackdropClick>
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 shadow-2xs text-theme-primary flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-zinc-900">
                Alta Rápida de Cliente
              </h3>
              <p className="text-xs text-zinc-500">
                Captura los datos básicos para cotización o venta industrial inmediata.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-900 block">Tipo de Cliente:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Persona', 'Empresa', 'Convenio'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    type === t
                      ? 'bg-theme-primary text-white shadow-xs'
                      : 'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-2xs'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-900 block">
              {type === 'Persona' ? 'Nombre Completo *' : 'Nombre Comercial / Empresa *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Stanley Black & Decker / Laboratorios Rex S.A."
              className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:border-theme-primary text-xs shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-900 block">RFC (Opcional):</label>
              <input
                type="text"
                value={rfc}
                onChange={(e) => setRfc(e.target.value.toUpperCase())}
                placeholder="XAXX010101000"
                className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 font-mono text-xs shadow-2xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-900 block">Teléfono *:</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="81 1234 5678"
                className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-900 block">Correo Electrónico:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="compras@cliente.com"
                className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs shadow-2xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-900 block">Persona de Contacto:</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Nombre de encargado de compras"
                className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-900 block">Planta / Destino Habitual:</label>
              <select
                value={preferredBranch}
                onChange={(e) => setPreferredBranch(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs shadow-2xs focus:outline-none"
              >
                <option value="wh-alm-rtm">Planta Principal RTM</option>
                <option value="wh-alm-virtual">Almacén Virtual / Control</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-900 block">Tarifa / Convenio Comercial Base:</label>
              <select
                value={preferredPriceListId}
                onChange={(e) => setPreferredPriceListId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs shadow-2xs focus:outline-none"
              >
                <option value="pl-ind-sbd-2026">Tarifa Industrial Stanley B&D 2026</option>
                <option value="pl-farmaceutica-2026">Tarifa Farmacéutica & Etiquetas 2026</option>
                <option value="pl-flexo-2026">Tarifa General Flexo & Offset 2026</option>
              </select>
            </div>
          </div>

          {/* Dirección inicial */}
          <div className="space-y-2 pt-2 border-t border-zinc-200">
            <label className="font-bold text-zinc-900 block">Dirección de Entrega (Opcional):</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Calle (Ej. Av. Industria Pesada)"
                  className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs shadow-2xs"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={extNumber}
                  onChange={(e) => setExtNumber(e.target.value)}
                  placeholder="Núm. Ext (Ej. 1000)"
                  className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs shadow-2xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Colonia (Ej. Parque Industrial Milimex)"
                className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs shadow-2xs"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ciudad / Municipio (Ej. Apodaca)"
                className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs shadow-2xs"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Cliente</span>
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};
