import React, { useState, useEffect, useMemo } from 'react';
import { Category, Movement, UserPreferences } from '../types';
import { ConfirmarEliminarModal } from './ConfirmarEliminarModal';

interface RegistroViewProps {
  movements: Movement[];
  categories: Category[];
  preferences: UserPreferences;
  onOpenAddModal: () => void;
  onEditMovement: (movement: Movement) => void;
  onDeleteMovement: (id: string) => void;
}

export const RegistroView: React.FC<RegistroViewProps> = ({
  movements,
  categories,
  preferences,
  onOpenAddModal,
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Movement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
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

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth('todos');
    setSelectedCategory('todas');
    setSelectedSubcategory('todas');
    setSearchQuery('');
  };

  // Available subcategories: from the selected category, or all categories if none selected
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'todas') {
      return categories.flatMap((c) => c.subcategories);
    }
    const cat = categories.find((c) => c.id === selectedCategory || c.name === selectedCategory);
    return cat ? cat.subcategories : [];
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
      <section className="px-4 md:px-margin-desktop py-stack-lg bg-surface-container-low border-b-2 border-outline-variant">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-stack-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-semibold text-sm md:text-base text-on-surface-variant uppercase tracking-widest">
                Vista Histórica
              </span>
              <h2 className="font-bold text-3xl md:text-4xl text-primary">
                Registro de Movimientos
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-2 px-5 h-14 bg-primary text-on-primary font-semibold text-base rounded-lg border-2 border-primary hover:bg-primary-container transition-colors cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span>Nuevo Registro</span>
              </button>
            </div>
          </div>

          {/* Year Selector Tabs & Filters */}
          <div className="flex flex-col gap-4 sticky top-24 z-40 bg-surface-container-low -mx-4 md:-mx-margin-desktop px-4 md:px-margin-desktop py-4 border-b-2 border-outline-variant">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedYear(0)}
                  className={`px-6 h-12 font-bold text-base rounded-lg border-2 transition-all cursor-pointer ${
                    selectedYear === 0
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-white text-on-surface border-outline-variant hover:border-primary'
                  }`}
                >
                  Todos los años
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                    }}
                    className={`px-8 h-12 font-bold text-base rounded-lg border-2 transition-all cursor-pointer ${
                      selectedYear === year
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-white text-on-surface border-outline-variant hover:border-primary'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Month Selector */}
              <div className="flex items-center bg-white border-2 border-outline-variant rounded-lg h-12 px-3 gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">filter_alt</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                  }}
                  className="bg-transparent font-medium text-base outline-none cursor-pointer pr-2"
                >
                  <option value="todos">Todos los meses</option>
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
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('todas');
                }}
                className="h-12 px-4 bg-white border-2 border-outline-variant font-medium text-base rounded-lg focus:border-primary outline-none min-w-[150px] cursor-pointer"
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
                className="h-12 px-4 bg-white border-2 border-outline-variant font-medium text-base rounded-lg focus:border-primary outline-none min-w-[150px] cursor-pointer"
              >
                <option value="todas">Subcategoría (Todas)</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>

              {/* Reset Button */}
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-4 h-12 text-error font-semibold text-base hover:bg-error-container rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                <span>Restablecer</span>
              </button>

              {/* Search Bar — full width */}
              <div className="relative w-full">
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
                  className="w-full h-12 pl-10 pr-4 bg-white border-2 border-outline-variant font-medium text-base rounded-lg focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ledger Table Section */}
      <section className="px-4 md:px-margin-desktop py-stack-lg">
        <div className="w-full">
          <div className="bg-white border-2 border-outline-variant rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full border-collapse text-left min-w-[800px]">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant border-b-2 border-outline-variant">
                  <th className="px-6 py-4 font-semibold text-base w-[130px]">
                    <button
                      onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                      className="w-full flex items-center justify-between gap-1 cursor-pointer group"
                      title={sortOrder === 'desc' ? 'Ordenar fecha: descendente (más reciente)' : 'Ordenar fecha: ascendente (más antigua)'}
                    >
                      <span>Fecha</span>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-50 group-hover:opacity-100 transition-opacity text-[18px]">
                        {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                      </span>
                    </button>
                  </th>
                  <th className="px-4 py-4 font-semibold text-base w-[110px]">
                    <div className="flex items-center justify-between gap-1">
                      <span>Categoría</span>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-50 text-[18px]">unfold_more</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 font-semibold text-base w-[140px]">
                    <div className="flex items-center justify-between gap-1">
                      <span>Subcategoría</span>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-50 text-[18px]">unfold_more</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-base">
                    <div className="flex items-center justify-between gap-1">
                      <span>Descripción</span>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-50 text-[18px]">unfold_more</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-base text-right w-[130px]">
                    <div className="flex items-center justify-end gap-1">
                      <span>Debe</span>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-50 text-[18px]">unfold_more</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-base text-right w-[130px]">
                    <div className="flex items-center justify-end gap-1">
                      <span>Haber</span>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-50 text-[18px]">unfold_more</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-base text-right w-[150px] bg-surface-container-high">
                    <div className="flex items-center justify-end gap-1">
                      <span>Saldo</span>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-50 text-[18px]">unfold_more</span>
                    </div>
                  </th>
                  <th className="w-24 py-4 text-right pr-4">
                    <span className="text-on-surface-variant font-semibold text-base">Acciones</span>
                  </th>
                </tr>
              </thead>

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
                        <td className="px-6 py-2 font-normal text-base whitespace-nowrap">
                          {mov.date.includes('-')
                            ? mov.date.split('-').reverse().join('/')
                            : mov.date}
                        </td>

                        <td className="px-4 py-2 font-semibold text-sm">
                          <span className={`px-2 py-1 rounded ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}>
                            {mov.category}
                          </span>
                        </td>

                        <td className="px-4 py-2 font-medium text-base">
                          {mov.subcategory}
                        </td>

                        <td className="px-6 py-2 font-medium text-base">
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
                            className="block max-w-[420px] truncate"
                          >
                            {mov.description}
                          </span>
                        </td>

                        <td className="px-6 py-2 font-bold text-base text-right whitespace-nowrap">
                          {isExpense ? (
                            <span className={isSelected ? 'text-tertiary-fixed-dim' : 'text-error'}>
                              {mov.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} {currencySymbol}
                            </span>
                          ) : (
                            <span className="opacity-40">-</span>
                          )}
                        </td>

                        <td className="px-6 py-2 font-bold text-base text-right whitespace-nowrap">
                          {!isExpense ? (
                            <span className={isSelected ? 'text-secondary-container' : 'text-secondary'}>
                              {mov.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} {currencySymbol}
                            </span>
                          ) : (
                            <span className="opacity-40">-</span>
                          )}
                        </td>

                        <td className={`px-6 py-2 font-bold text-lg text-right whitespace-nowrap ${
                          isSelected ? 'bg-primary-container/40 text-white' : 'bg-surface-container-low text-primary'
                        }`}>
                          {mov.balanceAfter !== undefined
                            ? `${mov.balanceAfter.toLocaleString('es-ES', { minimumFractionDigits: 2 })} ${currencySymbol}`
                            : '-'}
                        </td>

                        <td className="px-2 py-2 text-right whitespace-nowrap">
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
                  <td className="px-6 py-5 font-extrabold text-xl md:text-2xl text-right text-tertiary-fixed whitespace-nowrap">
                    {totalExpense.toLocaleString('es-ES', { minimumFractionDigits: 2 })} {currencySymbol}
                  </td>
                  <td className="px-6 py-5 font-extrabold text-xl md:text-2xl text-right text-secondary-fixed whitespace-nowrap">
                    {totalIncome.toLocaleString('es-ES', { minimumFractionDigits: 2 })} {currencySymbol}
                  </td>
                  <td className="px-6 py-5 font-black text-2xl md:text-3xl text-right bg-primary-container text-white whitespace-nowrap" colSpan={2}>
                    {finalBalance.toLocaleString('es-ES', { minimumFractionDigits: 2 })} {currencySymbol}
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
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Presupuesto Mensual */}
          <div className="bg-white border-2 border-outline-variant rounded-xl p-stack-md flex flex-col gap-2 shadow-sm">
            <span className="font-semibold text-sm text-on-surface-variant uppercase tracking-wider">
              Presupuesto Mensual
            </span>
            <div className="flex items-end justify-between">
              <span className="font-bold text-3xl text-primary">1.800,00 {currencySymbol}</span>
              <span className="font-semibold text-base text-secondary">68% restante</span>
            </div>
            <div className="w-full bg-surface-container-high h-4 rounded-full mt-2 overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: '32%' }} />
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

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Ir hacia arriba"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg border-2 border-primary hover:bg-primary-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px]">arrow_upward</span>
        </button>
      )}

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
