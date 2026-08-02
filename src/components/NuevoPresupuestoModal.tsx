import React, { useState, useEffect, useMemo } from 'react';
import { Budget, BudgetType, Category, Movement } from '../types';
import { suggestBudgetAmount } from '../budgetUtils';

interface NuevoPresupuestoModalProps {
  isOpen: boolean;
  categories: Category[];
  movements: Movement[];
  defaultYear: number;
  defaultCategoryId?: string;
  editingBudget: Budget | null;
  currencySymbol: string;
  onClose: () => void;
  onSave: (data: {
    category_id: string;
    subcategory_id: string | null;
    type: BudgetType;
    year: number;
    month: string;
    amount: number;
  }) => void;
}

const MONTHS = [
  { value: '01', name: 'Enero' },
  { value: '02', name: 'Febrero' },
  { value: '03', name: 'Marzo' },
  { value: '04', name: 'Abril' },
  { value: '05', name: 'Mayo' },
  { value: '06', name: 'Junio' },
  { value: '07', name: 'Julio' },
  { value: '08', name: 'Agosto' },
  { value: '09', name: 'Septiembre' },
  { value: '10', name: 'Octubre' },
  { value: '11', name: 'Noviembre' },
  { value: '12', name: 'Diciembre' },
];

function parseAmount(value: string): number {
  const s = value.trim();
  if (s === '') return NaN;
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');
  let normalized = s;
  if (hasComma && hasDot) {
    normalized = s.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    normalized = s.replace(',', '.');
  } else if (hasDot && s.split('.').length === 2 && /\.\d{1,2}$/.test(s)) {
    // Un único punto final: se interpreta como decimal
  } else if (hasDot) {
    normalized = s.replace(/\./g, '');
  }
  return parseFloat(normalized);
}

export const NuevoPresupuestoModal: React.FC<NuevoPresupuestoModalProps> = ({
  isOpen,
  categories,
  movements,
  defaultYear,
  defaultCategoryId = '',
  editingBudget,
  currencySymbol,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<BudgetType>('gasto');
  const [year, setYear] = useState<number>(defaultYear);
  const [month, setMonth] = useState<string>('00');
  const [categoryCode, setCategoryCode] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const availableYears = useMemo(() => {
    const years = new Set<number>([defaultYear, new Date().getFullYear()]);
    movements.forEach((m) => {
      const y = new Date(m.date).getFullYear();
      if (!isNaN(y)) years.add(y);
    });
    return [...years].sort((a, b) => b - a);
  }, [movements, defaultYear]);

  useEffect(() => {
    if (isOpen) {
      if (editingBudget) {
        setType(editingBudget.type);
        setYear(editingBudget.year);
        setMonth(editingBudget.month);
        setCategoryCode(editingBudget.category_id);
        setSubcategoryId(editingBudget.subcategory_id ?? '');
        setAmount(String(editingBudget.amount));
      } else {
        setType('gasto');
        setYear(defaultYear);
        setMonth('00');
        setCategoryCode(defaultCategoryId);
        setSubcategoryId('');
        setAmount('');
      }
      setError('');
    }
  }, [isOpen, editingBudget, defaultYear, defaultCategoryId]);

  const selectedCat = categories.find((c) => c.id === categoryCode);
  const selectedSub = selectedCat?.subcategories.find((s) => s.id === subcategoryId);

  const suggested = useMemo(() => {
    if (!categoryCode || editingBudget) return 0;
    return suggestBudgetAmount(movements, year, month, type, categoryCode, selectedSub?.name);
  }, [movements, year, month, type, categoryCode, selectedSub, editingBudget]);

  useEffect(() => {
    if (!editingBudget && suggested > 0) {
      setAmount(suggested.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [suggested, editingBudget]);

  const handleCategoryChange = (id: string) => {
    setCategoryCode(id);
    setSubcategoryId('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryCode) {
      setError('Por favor seleccione una categoría.');
      return;
    }
    const parsed = parseAmount(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Por favor ingrese un importe válido.');
      return;
    }
    onSave({
      category_id: categoryCode,
      subcategory_id: subcategoryId ? subcategoryId : null,
      type,
      year,
      month,
      amount: parsed,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className={`p-4 md:p-stack-md flex items-center justify-between text-white ${type === 'ingreso' ? 'bg-secondary' : 'bg-primary'}`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px]">savings</span>
            <h4 className="font-bold text-xl md:text-2xl">
              {editingBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
            </h4>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-stack-md space-y-4">
          {error && (
            <div className="bg-error-container text-error font-semibold text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* Type Selector */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-surface-container-low rounded-xl border border-outline-variant">
            <button
              type="button"
              onClick={() => setType('gasto')}
              className={`py-2.5 rounded-lg font-bold text-base transition-all cursor-pointer ${
                type === 'gasto'
                  ? 'bg-error text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Gastos
            </button>
            <button
              type="button"
              onClick={() => setType('ingreso')}
              className={`py-2.5 rounded-lg font-bold text-base transition-all cursor-pointer ${
                type === 'ingreso'
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Ingresos
            </button>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-base text-on-surface">Categoría</label>
              <select
                value={categoryCode}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base cursor-pointer"
              >
                <option value="">Elegir uno</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-base text-on-surface">Subcategoría</label>
              <select
                value={subcategoryId}
                onChange={(e) => { setSubcategoryId(e.target.value); setError(''); }}
                className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base cursor-pointer"
              >
                <option value="">Toda la categoría</option>
                {selectedCat?.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Year & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-base text-on-surface">Año</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base cursor-pointer"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-base text-on-surface">Periodo</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base cursor-pointer"
              >
                <option value="00">Recurrente (todos los meses)</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="block font-semibold text-base text-on-surface">
              Importe ({currencySymbol})
            </label>
            <input
              type="text"
              inputMode="decimal"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-bold text-2xl tabular-nums"
            />
            {!editingBudget && suggested > 0 && (
              <p className="text-sm font-medium text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                Sugerido según los últimos 2 años:{' '}
                <span className="font-bold text-primary">
                  {suggested.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currencySymbol}
                </span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 bg-surface-container-highest font-semibold text-base rounded-xl border-2 border-transparent hover:border-outline-variant transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 h-14 font-bold text-base text-white rounded-xl border-2 transition-all cursor-pointer ${
                type === 'ingreso'
                  ? 'bg-secondary border-secondary hover:bg-secondary/90'
                  : 'bg-primary border-primary hover:bg-primary-container'
              }`}
            >
              {editingBudget ? 'Guardar Cambios' : 'Guardar Presupuesto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
