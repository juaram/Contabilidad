import React, { useState, useMemo } from 'react';
import { Budget, BudgetType, Category, Movement, UserPreferences } from '../types';
import { actualForPeriod } from '../budgetUtils';
import { NuevoPresupuestoModal } from './NuevoPresupuestoModal';
import { CategoryIcon } from './CategoryIcon';
import { categoryColorStyle } from '../categoryColors';

interface PresupuestoViewProps {
  budgets: Budget[];
  categories: Category[];
  movements: Movement[];
  preferences: UserPreferences;
  onSaveBudget: (data: {
    id?: string;
    category_id: string;
    subcategory_id: string | null;
    type: BudgetType;
    year: number;
    month: string;
    amount: number;
  }) => void;
  onDeleteBudget: (id: string) => void;
}

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const PERIODS = [
  { value: 'todos', label: 'Año completo' },
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

const formatAmount = (val: number): string =>
  val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function effectiveSubBudget(budgets: Budget[], year: number, month: string, type: BudgetType, categoryId: string, subcategoryId: string | null): number {
  const relevant = budgets.filter(
    (b) =>
      b.year === year &&
      b.type === type &&
      b.category_id === categoryId &&
      (b.subcategory_id ?? null) === subcategoryId,
  );
  const isAnnual = month === 'todos' || month === '' || month === '00';
  let total = 0;
  for (const b of relevant) {
    if (b.month === '13') {
      total += isAnnual ? b.amount : b.amount / 12;
    } else if (b.month === '00') {
      total += isAnnual ? b.amount * 12 : b.amount;
    } else {
      const idx = parseInt(b.month, 10) - 1;
      if (isAnnual || idx === parseInt(month, 10) - 1) total += b.amount;
    }
  }
  return total;
}

function periodLabel(budgetRows: Budget[]): string {
  const rec = budgetRows.some((b) => b.month === '00');
  const anual = budgetRows.some((b) => b.month === '13');
  const spec = budgetRows.filter((b) => b.month !== '00' && b.month !== '13');
  const parts: string[] = [];
  if (rec) parts.push('Recurrente');
  if (anual) parts.push('Anual');
  if (spec.length > 0) parts.push(spec.map((b) => MONTH_NAMES[parseInt(b.month, 10) - 1]).join(', '));
  return parts.join(' + ') || '—';
}

interface SubRow {
  key: string;
  label: string;
  subcategoryId: string | null;
  budgeted: number;
  actual: number;
  budgetRows: Budget[];
  hasBudget: boolean;
}

interface CategoryAgg {
  category: Category;
  budgeted: number;
  actual: number;
  rows: SubRow[];
}

export const PresupuestoView: React.FC<PresupuestoViewProps> = ({
  budgets,
  categories,
  movements,
  preferences,
  onSaveBudget,
  onDeleteBudget,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<BudgetType>('gasto');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<Budget | null>(null);
  const [collapsedCatIds, setCollapsedCatIds] = useState<string[]>(() => categories.map((c) => c.id));

  const toggleCategory = (id: string) => {
    setCollapsedCatIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const currencySymbol = useMemo(() => {
    if (preferences.currency.includes('USD')) return '$';
    if (preferences.currency.includes('GBP')) return '£';
    return '€';
  }, [preferences.currency]);

  const availableYears = useMemo(() => {
    const years = new Set<number>([new Date().getFullYear()]);
    movements.forEach((m) => {
      const y = new Date(m.date).getFullYear();
      if (!isNaN(y)) years.add(y);
    });
    budgets.forEach((b) => years.add(b.year));
    return [...years].sort((a, b) => b - a);
  }, [movements, budgets]);

  const categoryAggs = useMemo<CategoryAgg[]>(() => {
    return categories.map((cat) => {
      const makeRow = (subcategoryId: string | null, label: string, subName?: string): SubRow | null => {
        const budgetRows = budgets.filter(
          (b) =>
            b.year === selectedYear &&
            b.type === selectedType &&
            b.category_id === cat.id &&
            (b.subcategory_id ?? null) === subcategoryId,
        );
        const budgeted = effectiveSubBudget(budgets, selectedYear, selectedMonth, selectedType, cat.id, subcategoryId);
        const actual = actualForPeriod(movements, selectedYear, selectedMonth, selectedType, cat.id, subName);
        if (budgeted > 0 || actual > 0 || budgetRows.length > 0) {
          return {
            key: subcategoryId ?? 'cat',
            label,
            subcategoryId,
            budgeted,
            actual,
            budgetRows,
            hasBudget: budgetRows.length > 0,
          };
        }
        return null;
      };

      const subRows = cat.subcategories
        .map((s) => makeRow(s.id, s.name, s.name))
        .filter((r): r is SubRow => r !== null);
      const hasSubs = cat.subcategories.length > 0;

      // Categoría con subcategorías: el item "Toda la categoría" solo agrega
      // el importe real de las subcategorías SIN presupuesto informado, evitando
      // duplicar en la cabecera el total de las que sí tienen presupuesto.
      let rows: SubRow[];
      if (hasSubs) {
        const catBudgetRows = budgets.filter(
          (b) =>
            b.year === selectedYear &&
            b.type === selectedType &&
            b.category_id === cat.id &&
            (b.subcategory_id ?? null) === null,
        );
        const unbudgetedRows = subRows.filter((r) => !r.hasBudget);
        const catRow =
          catBudgetRows.length > 0
            ? makeRow(null, 'Toda la categoría')
            : unbudgetedRows.length > 0
              ? {
                  key: 'cat',
                  label: 'Toda la categoría',
                  subcategoryId: null,
                  budgeted: 0,
                  actual: unbudgetedRows.reduce((s, r) => s + r.actual, 0),
                  budgetRows: [],
                  hasBudget: false,
                }
              : null;
        rows = catRow ? [catRow] : [];
        rows = rows.concat(subRows.filter((r) => r.hasBudget));
      } else {
        rows = makeRow(null, 'Toda la categoría') ? [makeRow(null, 'Toda la categoría')!] : [];
      }

      return {
        category: cat,
        budgeted: rows.reduce((s, r) => s + r.budgeted, 0),
        actual: rows.reduce((s, r) => s + r.actual, 0),
        rows,
      };
    }).filter((agg) => agg.rows.length > 0);
  }, [categories, budgets, movements, selectedYear, selectedMonth, selectedType]);

  const totals = useMemo(() => {
    const budgeted = categoryAggs.reduce((s, a) => s + a.budgeted, 0);
    const actual = categoryAggs.reduce((s, a) => s + a.actual, 0);
    const remaining = budgeted - actual;
    const pct = budgeted > 0 ? (actual / budgeted) * 100 : 0;
    return { budgeted, actual, remaining, pct };
  }, [categoryAggs]);

  const handleOpenNew = (categoryId = '') => {
    setEditingBudget(null);
    setDefaultCategoryId(categoryId);
    setIsModalOpen(true);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setDefaultCategoryId('');
    setIsModalOpen(true);
  };

  const statusColor = (actual: number, budgeted: number): string => {
    if (budgeted <= 0) return 'bg-surface-container-high';
    const pct = actual / budgeted;
    if (pct >= 1) return 'bg-error';
    if (pct >= 0.75) return 'bg-tertiary';
    return 'bg-secondary';
  };

  const remainingColor = (actual: number, budgeted: number): string => {
    if (budgeted <= 0) return 'text-on-surface-variant';
    const pct = actual / budgeted;
    if (pct >= 1) return 'text-error';
    if (pct >= 0.75) return 'text-tertiary';
    return 'text-secondary';
  };

  const categoryName = (id: string): string => categories.find((c) => c.id === id)?.name ?? 'Categoría';
  const subcategoryName = (subId: string | null): string => {
    if (!subId) return 'Toda la categoría';
    for (const c of categories) {
      const s = c.subcategories.find((x) => x.id === subId);
      if (s) return s.name;
    }
    return 'Subcategoría';
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Filters Header */}
      <section className="sticky top-24 z-40 bg-surface-container-low border-b-2 border-outline-variant px-4 md:px-margin-desktop pt-2 pb-2">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide">
            {/* Type Toggle */}
            <div className="flex items-center gap-1 bg-white border-2 border-outline-variant rounded-lg p-1 shrink-0">
              <button
                onClick={() => setSelectedType('gasto')}
                className={`h-8 px-4 rounded-md font-bold text-sm transition-all cursor-pointer ${
                  selectedType === 'gasto' ? 'bg-error text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Gastos
              </button>
              <button
                onClick={() => setSelectedType('ingreso')}
                className={`h-8 px-4 rounded-md font-bold text-sm transition-all cursor-pointer ${
                  selectedType === 'ingreso' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Ingresos
              </button>
            </div>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="h-10 px-3 bg-white border-2 border-outline-variant font-medium text-sm rounded-lg focus:border-primary outline-none min-w-[110px] cursor-pointer shrink-0"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Period Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-10 px-3 bg-white border-2 border-outline-variant font-medium text-sm rounded-lg focus:border-primary outline-none min-w-[150px] cursor-pointer shrink-0"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleOpenNew()}
              className="h-10 px-4 ml-auto bg-primary text-on-primary font-bold text-sm rounded-lg border-2 border-primary hover:bg-primary-container transition-colors cursor-pointer shrink-0 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nuevo presupuesto
            </button>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-4 md:px-margin-desktop pt-4 pb-stack-lg">
        <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-6">
          {/* Totals summary */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm text-on-surface-variant uppercase tracking-widest">
                  {selectedType === 'gasto' ? 'Presupuesto de Gastos' : 'Objetivo de Ingresos'} ·{' '}
                  {selectedMonth === 'todos' ? `Año ${selectedYear}` : `${MONTH_NAMES[parseInt(selectedMonth, 10) - 1]} ${selectedYear}`}
                </span>
                <span className="font-bold text-3xl md:text-4xl text-primary tabular-nums">
                  {formatAmount(totals.budgeted)} {currencySymbol}
                </span>
              </div>
              <div className="flex flex-col md:items-end gap-1">
                <span className="font-semibold text-base text-on-surface-variant">
                  {selectedType === 'gasto' ? 'Gastado' : 'Ingresado'}: <span className="font-bold text-on-surface">{formatAmount(totals.actual)} {currencySymbol}</span>
                </span>
                <span className={`font-bold text-lg ${remainingColor(totals.actual, totals.budgeted)}`}>
                  Restante: {formatAmount(totals.remaining)} {currencySymbol}
                </span>
              </div>
            </div>
            <div className="w-full bg-surface-container-high h-5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusColor(totals.actual, totals.budgeted)}`}
                style={{ width: `${Math.min(totals.pct, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm font-semibold text-on-surface-variant">
              <span>{formatAmount(0)} {currencySymbol}</span>
              <span>{totals.pct.toFixed(0)}% utilizado</span>
              <span>{formatAmount(totals.budgeted)} {currencySymbol}</span>
            </div>
          </div>

          {/* Category breakdown */}
          {categoryAggs.length === 0 ? (
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-10 text-center text-on-surface-variant text-lg">
              No hay presupuestos ni movimientos para los filtros seleccionados. Pulsa "Nuevo presupuesto" para empezar.
            </div>
          ) : (
            categoryAggs.map((agg) => {
              const isExpanded = !collapsedCatIds.includes(agg.category.id);
              return (
              <div key={agg.category.id} className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
                {/* Category header (accordion toggle) */}
                <button
                  onClick={() => toggleCategory(agg.category.id)}
                  className="w-full bg-surface-container-high px-4 md:px-6 py-4 flex items-center gap-4 border-b-2 border-outline-variant text-left cursor-pointer hover:bg-surface-container-highest transition-colors"
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={categoryColorStyle(agg.category.colorBgClass, agg.category.colorTextClass)}>
                    <CategoryIcon icon={agg.category.icon} className="text-[24px]" imgClassName="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-bold text-lg md:text-xl text-on-surface truncate">{agg.category.name}</span>
                      <span className="text-sm font-semibold text-on-surface-variant whitespace-nowrap">
                        {formatAmount(agg.actual)} {currencySymbol} de {formatAmount(agg.budgeted)} {currencySymbol}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${statusColor(agg.actual, agg.budgeted)}`}
                        style={{ width: `${Math.min(agg.budgeted > 0 ? (agg.actual / agg.budgeted) * 100 : 0, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={`material-symbols-outlined text-primary text-[32px] shrink-0 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {/* Sub rows */}
                {isExpanded && (
                <div className="divide-y-2 divide-outline-variant/60">
                  {agg.rows.map((row) => (
                    <div key={row.key} className="px-4 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-base text-on-surface truncate">{row.label}</span>
                          {row.hasBudget ? (
                            <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded whitespace-nowrap">
                              {periodLabel(row.budgetRows)}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-tertiary px-2 py-1 rounded whitespace-nowrap">Sin presupuesto</span>
                          )}
                        </div>
                        <div className="mt-2 w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${statusColor(row.actual, row.budgeted)}`}
                            style={{ width: `${Math.min(row.budgeted > 0 ? (row.actual / row.budgeted) * 100 : 0, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-sm font-medium text-on-surface-variant">
                          <span>Real: {formatAmount(row.actual)} {currencySymbol}</span>
                          <span>{row.budgeted > 0 ? `${((row.actual / row.budgeted) * 100).toFixed(0)}%` : ''}</span>
                          <span>Previsto: {formatAmount(row.budgeted)} {currencySymbol}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {row.hasBudget ? (
                          <>
                            <button
                              onClick={() => handleEdit(row.budgetRows[0])}
                              title="Editar presupuesto"
                              className="p-2 rounded hover:bg-secondary/20 text-outline hover:text-secondary transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => setDeleteTarget(row.budgetRows[0])}
                              title="Eliminar presupuesto"
                              className="p-2 rounded hover:bg-error/20 text-outline hover:text-error transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenNew(agg.category.id)}
                            title="Añadir presupuesto"
                            className="p-2 rounded hover:bg-secondary/20 text-secondary transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            );
            })
          )}
        </div>
      </section>

      {/* New/Edit modal */}
      <NuevoPresupuestoModal
        isOpen={isModalOpen}
        categories={categories}
        movements={movements}
        defaultYear={selectedYear}
        defaultCategoryId={defaultCategoryId}
        editingBudget={editingBudget}
        currencySymbol={currencySymbol}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => onSaveBudget(editingBudget ? { ...data, id: editingBudget.id } : data)}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border-2 border-error rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-error p-4 flex items-center justify-between text-on-error">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">warning</span>
                <h4 className="font-bold text-xl">Eliminar Presupuesto</h4>
              </div>
              <button onClick={() => setDeleteTarget(null)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-base text-on-surface">
                ¿Estás seguro de que quieres eliminar este presupuesto? Esta acción no se puede deshacer.
              </p>
              <div className="bg-surface-container-low border-2 border-outline-variant rounded-xl p-4 flex flex-col gap-2">
                <span className="font-semibold text-base text-on-surface">{categoryName(deleteTarget.category_id)} · {subcategoryName(deleteTarget.subcategory_id)}</span>
                <div className="flex items-center justify-between text-sm text-on-surface-variant">
                  <span>{periodLabel([deleteTarget])}</span>
                  <span className={`font-bold text-base ${deleteTarget.type === 'gasto' ? 'text-error' : 'text-secondary'}`}>
                    {formatAmount(deleteTarget.amount)} {currencySymbol}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 h-12 bg-surface-container-highest font-semibold text-base rounded-xl border-2 border-transparent hover:border-outline-variant transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onDeleteBudget(deleteTarget.id);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 h-12 bg-error text-on-error font-bold text-base rounded-xl border-2 border-error hover:bg-error/90 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
