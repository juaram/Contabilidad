import React, { useState, useEffect, useMemo } from 'react';
import { Budget, Category, Movement, UserPreferences } from '../types';
import { actualForPeriod, budgetForPeriod } from '../budgetUtils';
import { ConfirmarEliminarModal } from './ConfirmarEliminarModal';
import { categoryColorStyle } from '../categoryColors';

const formatAmount = (value: number): string => {
  const fixed = Math.abs(value).toFixed(2);
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${value < 0 ? '-' : ''}${grouped},${dec}`;
};

interface RegistroViewProps {
  movements: Movement[];
  categories: Category[];
  budgets: Budget[];
  preferences: UserPreferences;
  onEditMovement: (movement: Movement) => void;
  onDeleteMovement: (id: string) => void;
}

export const RegistroView: React.FC<RegistroViewProps> = ({
  movements,
  categories,
  budgets,
  preferences,
  onEditMovement,
  onDeleteMovement,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    movements.forEach((m) => {
      const y = new Date(m.date).getFullYear();
      if (!isNaN(y)) years.add(y);
    });
    const sorted = [...years].sort((a, b) => b - a);
    return sorted.length > 0 ? sorted : [new Date().getFullYear()];
  }, [movements]);
  const [selectedMonth, setSelectedMonth] = useState<string>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [atTop, setAtTop] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Movement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY <= 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Currency symbol
  const currencySymbol = useMemo(() => {
    if (preferences.currency.includes('USD')) return '$';
    if (preferences.currency.includes('GBP')) return '£';
    return '€';
  }, [preferences.currency]);

  const listFontClass = preferences.listFont === 'code' ? 'font-code' : 'font-sans';

  // Budget for the currently selected period (gastos)
  const periodBudget = useMemo(
    () => budgetForPeriod(budgets, selectedYear, selectedMonth, 'gasto'),
    [budgets, selectedYear, selectedMonth],
  );
  const periodSpent = useMemo(
    () => actualForPeriod(movements, selectedYear, selectedMonth, 'gasto'),
    [movements, selectedYear, selectedMonth],
  );
  const periodPctUsed = periodBudget > 0 ? (periodSpent / periodBudget) * 100 : 0;
  const periodBudgetStatus =
    periodBudget <= 0
      ? 'bg-surface-container-high'
      : periodPctUsed >= 100
        ? 'bg-error'
        : periodPctUsed >= 75
          ? 'bg-tertiary'
          : 'bg-secondary';

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth('todos');
    setSelectedCategory('todas');
    setSelectedSubcategory('todas');
    setSearchQuery('');
  };

  const filterBorderClass = (modified: boolean): string =>
    modified
      ? 'border-4 border-on-tertiary-container focus:border-on-tertiary-container'
      : 'border-2 border-outline-variant focus:border-primary';

  // Available subcategories: from the selected category, or all categories if none selected
  const availableSubcategories = useMemo(() => {
    const subs =
      selectedCategory === 'todas'
        ? categories.flatMap((c) => c.subcategories)
        : categories.find((c) => c.id === selectedCategory || c.name === selectedCategory)?.subcategories ?? [];

    const seen = new Set<string>();
    const unique = subs.filter((s) => {
      const key = s.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return unique.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, [categories, selectedCategory]);

  // Filtered movements
  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      // Date parsing
      const d = new Date(m.date);
      const year = d.getFullYear() || 2024;
      const month = String(d.getMonth() + 1).padStart(2, '0');

      if (selectedYear !== 0 && year !== selectedYear) return false;

      if (selectedMonth !== 'todos' && month !== selectedMonth) return false;

      if (selectedCategory !== 'todas') {
        if (m.category_id !== selectedCategory && m.category !== selectedCategory) {
          return false;
        }
      }

      if (selectedSubcategory !== 'todas') {
        if (m.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) {
          return false;
        }
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchDesc = m.description.toLowerCase().includes(query);
        const matchCat = m.category.toLowerCase().includes(query);
        const matchSub = m.subcategory.toLowerCase().includes(query);
        if (!matchDesc && !matchCat && !matchSub) return false;
      }

      return true;
    });
  }, [movements, selectedYear, selectedMonth, selectedCategory, selectedSubcategory, searchQuery]);

  // Category lookup by id to reuse each category's configured colors
  const categoryById = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  // Calculate Running Balance and Totals
  const { tableRows, totalExpense, totalIncome, finalBalance } = useMemo(() => {
    let running = 0;
    let expSum = 0;
    let incSum = 0;

    // Process chronologically for running balance
    const chrono = [...filteredMovements]
      .sort((a, b) => {
        const dateCmp = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateCmp !== 0) return dateCmp;
        return Number(a.id) - Number(b.id);
      });
    const rowsWithBalance = chrono.map((m) => {
      if (m.type === 'ingreso') {
        running += m.amount;
        incSum += m.amount;
      } else {
        running -= m.amount;
        expSum += m.amount;
      }
      return { ...m, balanceAfter: running };
    });

    // Display sort: by date (asc/desc) with ID as tiebreaker
    const dir = sortOrder === 'asc' ? 1 : -1;
    const tableRows = [...rowsWithBalance].sort((a, b) => {
      const dateCmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCmp !== 0) return dateCmp * dir;
      return (Number(a.id) - Number(b.id)) * dir;
    });

    return {
      tableRows,
      totalExpense: expSum,
      totalIncome: incSum,
      finalBalance: running,
    };
  }, [filteredMovements, sortOrder]);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Interactive Filters Header Section */}
      <section className="sticky top-24 z-40 bg-surface-container-low border-b-2 border-primary px-4 md:px-margin-desktop pt-2 pb-0">
        <div className="max-w-275 mx-auto flex flex-col gap-2">
          {/* Filters: single line */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={handleResetFilters}
              title="Restablecer filtros"
              className="w-10 h-10 shrink-0 flex items-center justify-center text-orange-500 hover:bg-error-container rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined icono-mas-grande text-[20px]">restart_alt</span>
            </button>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={`h-10 px-3 bg-white font-medium text-sm rounded-lg outline-none min-w-32.5 cursor-pointer shrink-0 ${filterBorderClass(
                selectedYear !== new Date().getFullYear(),
              )}`}
            >
              <option value={0}>Años (Todos)</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
              }}
              className={`h-10 px-3 bg-white font-medium text-sm rounded-lg outline-none min-w-32.5 cursor-pointer shrink-0 ${filterBorderClass(
                selectedMonth !== 'todos',
              )}`}
            >
              <option value="todos">Meses (Todos)</option>
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('todas');
              }}
              className={`h-10 px-3 bg-white font-medium text-sm rounded-lg outline-none min-w-35 cursor-pointer shrink-0 ${filterBorderClass(
                selectedCategory !== 'todas',
              )}`}
            >
              <option value="todas">Categoría (Todas)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Subcategory Filter */}
            <select
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.target.value);
              }}
              className={`h-10 px-3 bg-white font-medium text-sm rounded-lg outline-none min-w-35 cursor-pointer shrink-0 ${filterBorderClass(
                selectedSubcategory !== 'todas',
              )}`}
            >
              <option value="todas">Subcategoría (Todas)</option>
              {availableSubcategories.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>

            {/* Search Bar — takes remaining space */}
            <div className="relative flex-1 min-w-55">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="Buscar descripción..."
                className={`w-full h-10 pl-10 pr-4 bg-white font-medium text-sm rounded-lg outline-none ${filterBorderClass(
                  searchQuery.trim() !== '',
                )}`}
              />
            </div>
          </div>

          {/* Table Header (inside sticky section) */}
          <div className="bg-white border-2 border-b-0 border-primary rounded-t-xl overflow-hidden">
            <table className={`w-full border-collapse text-left table-fixed ${listFontClass}`}>
              <colgroup>
                <col style={{ width: '11%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '8%' }} />
              </colgroup>
              <thead>
                <tr className="bg-primary text-white border-b-2 border-primary">
                  <th className="px-3 py-3 font-semibold text-sm">
                    <button
                      onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                      className="w-full flex items-center justify-between gap-1 cursor-pointer group"
                      title={sortOrder === 'desc' ? 'Ordenar fecha: descendente (más reciente)' : 'Ordenar fecha: ascendente (más antigua)'}
                    >
                      <span>Fecha</span>
                      <span className="material-symbols-outlined text-on-tertiary-container opacity-100 group-hover:opacity-100 transition-opacity text-[18px]">
                        {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                      </span>
                    </button>
                  </th>
                  <th className="px-3 py-3 font-semibold text-sm">
                    <div className="flex items-center justify-between gap-1">
                      <span>Categoría</span>
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-sm">
                    <div className="flex items-center justify-between gap-1">
                      <span>Subcategoría</span>
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-sm">
                    <div className="flex items-center justify-between gap-1">
                      <span>Descripción</span>
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-sm text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>Debe</span>
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-sm text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>Haber</span>
                    </div>
                  </th>
                  <th className="px-3 py-3 font-semibold text-sm text-right bg-primary">
                    <div className="flex items-center justify-end gap-1">
                      <span>Saldo</span>
                    </div>
                  </th>
                  <th className="px-3 py-3 text-right">
                    <span className="text-on-outline font-semibold text-sm">Acciones</span>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </section>

      {/* Ledger Table Section */}
      <section className="px-4 md:px-margin-desktop pb-stack-lg">
        <div className="max-w-275 mx-auto w-full">
          <div className="bg-white border-2 border-t-0 border-outline-variant rounded-b-xl overflow-x-auto shadow-sm">
            <table className={`w-full border-collapse text-left table-fixed ${listFontClass}`}>
              <colgroup>
                <col style={{ width: '11%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '8%' }} />
              </colgroup>
              <tbody className="divide-y-2 divide-outline-variant">
                {tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-on-surface-variant text-lg">
                      No se encontraron registros para los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  tableRows.map((mov) => {
                    const isSelected = highlightedRowId === mov.id;
                    const isExpense = mov.type === 'gasto';

                    return (
                      <tr
                        key={mov.id}
                        onClick={() => setHighlightedRowId(mov.id)}
                        className={`transition-colors cursor-pointer group select-none ${
                          isSelected
                            ? 'bg-primary-container text-on-primary-container font-medium'
                            : 'hover:bg-surface-container-low text-on-surface'
                        }`}
                      >
                        <td className="px-3 py-2 font-normal text-sm whitespace-nowrap">
                          {mov.date.includes('-')
                            ? mov.date.split('-').reverse().join('/')
                            : mov.date}
                        </td>

                        <td className="px-3 py-2 font-semibold text-sm">
                          {(() => {
                            const movCat = categoryById.get(mov.category_id);
                            return (
                              <span
                                className={`px-2 py-1 rounded ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : movCat
                                      ? ''
                                      : 'bg-surface-container-high text-on-surface-variant'
                                }`}
                                style={movCat && !isSelected ? categoryColorStyle(movCat.colorBgClass, movCat.colorTextClass) : undefined}
                              >
                                {mov.category}
                              </span>
                            );
                          })()}
                        </td>

                        <td className="px-3 py-2 font-medium text-sm">
                          {mov.subcategory}
                        </td>

                        <td className="px-3 py-2 font-medium text-sm">
                          <span
                            onMouseEnter={(e) => {
                              const el = e.currentTarget;
                              if (el.scrollWidth > el.clientWidth) {
                                const rect = el.getBoundingClientRect();
                                setTooltip({
                                  text: mov.description,
                                  x: rect.left,
                                  y: rect.bottom + 8,
                                });
                              }
                            }}
                            onMouseLeave={() => setTooltip(null)}
                            className="block w-full truncate"
                          >
                            {mov.description}
                          </span>
                        </td>

                        <td className="px-3 py-2 font-bold text-sm text-right whitespace-nowrap">
                          {isExpense ? (
                            <span className={isSelected ? 'text-tertiary-fixed-dim' : 'text-error'}>
                              {formatAmount(mov.amount)} {currencySymbol}
                            </span>
                          ) : (
                            <span className="opacity-40">-</span>
                          )}
                        </td>

                        <td className="px-3 py-2 font-bold text-sm text-right whitespace-nowrap">
                          {!isExpense ? (
                            <span className={isSelected ? 'text-secondary-container' : 'text-secondary'}>
                              {formatAmount(mov.amount)} {currencySymbol}
                            </span>
                          ) : (
                            <span className="opacity-40">-</span>
                          )}
                        </td>

                        <td className={`px-3 py-2 font-bold text-base text-right whitespace-nowrap ${
                          isSelected ? 'bg-primary-container/40 text-white' : 'bg-surface-container-low text-primary'
                        }`}>
                          {mov.balanceAfter !== undefined
                            ? `${formatAmount(mov.balanceAfter)} ${currencySymbol}`
                            : '-'}
                        </td>

                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditMovement(mov);
                              }}
                              title="Editar movimiento"
                              className={`p-1 rounded hover:bg-secondary/20 ${isSelected ? 'text-white' : 'text-outline hover:text-secondary'}`}
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(mov);
                              }}
                              title="Eliminar movimiento"
                              className={`p-1 rounded hover:bg-error/20 ${isSelected ? 'text-white' : 'text-outline hover:text-error'}`}
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              <tfoot>
                <tr className="bg-primary text-on-primary">
                  <td colSpan={4} className="px-6 py-5 font-bold text-base md:text-lg text-right uppercase">
                    TOTAL ACUMULADO PERIODO:
                  </td>
                  <td className="px-6 py-5 font-extrabold text-sm md:text-base text-right text-tertiary-fixed whitespace-nowrap">
                    {formatAmount(totalExpense)} {currencySymbol}
                  </td>
                  <td className="px-6 py-5 font-extrabold text-sm md:text-base text-right text-secondary-fixed whitespace-nowrap">
                    {formatAmount(totalIncome)} {currencySymbol}
                  </td>
                  <td className="px-6 py-5 font-black text-2xl md:text-3xl text-right bg-primary-container text-white whitespace-nowrap" colSpan={2}>
                    {formatAmount(finalBalance)} {currencySymbol}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-stack-md flex items-center gap-6 text-on-surface-variant font-medium text-base">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-secondary border border-outline rounded-xs" />
              <span>Ingresos (Haber)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-error border border-outline rounded-xs" />
              <span>Gastos (Debe)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Cards Section at Bottom */}
      <section className="px-4 md:px-margin-desktop py-stack-lg bg-surface-container mt-4">
        <div className="max-w-275 mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Presupuesto Mensual */}
          <div className="bg-white border-2 border-outline-variant rounded-xl p-stack-md flex flex-col gap-2 shadow-sm">
            <span className="font-semibold text-sm text-on-surface-variant uppercase tracking-wider">
              {selectedMonth === 'todos' ? `Presupuesto ${selectedYear}` : 'Presupuesto Mensual'}
            </span>
            <div className="flex items-end justify-between">
              <span className="font-bold text-3xl text-primary">{formatAmount(periodBudget)} {currencySymbol}</span>
              <span className={`font-semibold text-base ${periodBudget <= 0 ? 'text-on-surface-variant' : periodPctUsed >= 100 ? 'text-error' : 'text-secondary'}`}>
                {periodBudget <= 0
                  ? 'Sin presupuesto'
                  : `${Math.max(0, 100 - periodPctUsed).toFixed(0)}% restante`}
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-4 rounded-full mt-2 overflow-hidden">
              <div className={`${periodBudgetStatus} h-full`} style={{ width: `${Math.min(periodPctUsed, 100)}%` }} />
            </div>
          </div>

          {/* Card 2: Gasto Promedio Día */}
          <div className="bg-white border-2 border-outline-variant rounded-xl p-stack-md flex flex-col gap-2 shadow-sm">
            <span className="font-semibold text-sm text-on-surface-variant uppercase tracking-wider">
              Gasto Promedio Día
            </span>
            <span className="font-bold text-3xl text-primary">24,50 {currencySymbol}</span>
            <span className="text-sm text-on-surface-variant italic">
              Basado en los últimos 30 días
            </span>
          </div>

          {/* Card 3: Ahorro este Año */}
          <div className="bg-white border-2 border-primary rounded-xl p-stack-md flex flex-col gap-2 relative overflow-hidden shadow-sm">
            <div className="absolute top-2 right-2">
              <span className="material-symbols-outlined text-primary opacity-20 text-[48px]">
                account_balance_wallet
              </span>
            </div>
            <span className="font-semibold text-sm text-on-surface-variant uppercase tracking-wider">
              Ahorro este Año
            </span>
            <span className="font-bold text-3xl text-secondary">+ 4.250,00 {currencySymbol}</span>
            <span className="font-semibold text-xs text-on-secondary-container bg-secondary-container px-3 py-1 self-start rounded-lg">
              Excelente progreso
            </span>
          </div>
        </div>
      </section>

      {/* Tooltip for description */}
      {tooltip && (
        <div
          className="fixed z-50 max-w-[320px] px-4 py-2 bg-inverse-surface text-inverse-on-surface font-medium text-sm rounded-lg shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Scroll to top / bottom button */}
      <button
        onClick={() =>
          atTop
            ? window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
            : window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        title={atTop ? 'Ir al final de la página' : 'Ir al principio de la página'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg border-2 border-primary hover:bg-primary-container transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">
          {atTop ? 'arrow_downward' : 'arrow_upward'}
        </span>
      </button>

      {/* Delete confirmation modal */}
      <ConfirmarEliminarModal
        isOpen={deleteTarget !== null}
        movement={deleteTarget}
        currencySymbol={currencySymbol}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) onDeleteMovement(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};
