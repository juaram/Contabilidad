import React, { useMemo, useState, useEffect } from 'react';
import { Movement, UserPreferences } from '../types';

interface InicioViewProps {
  movements: Movement[];
  preferences: UserPreferences;
  onOpenAddModal: (type: 'ingreso' | 'gasto') => void;
  onGoToRegistro: () => void;
}

export const InicioView: React.FC<InicioViewProps> = ({
  movements,
  preferences,
  onOpenAddModal,
  onGoToRegistro,
}) => {
  // Currency symbol helper
  const currencySymbol = useMemo(() => {
    if (preferences.currency.includes('USD') || preferences.currency.includes('$')) return '$';
    if (preferences.currency.includes('GBP') || preferences.currency.includes('£')) return '£';
    return '€';
  }, [preferences.currency]);

  // Format amount with decimal comma and thousands dot
  const formatAmount = (val: number) => {
    return val.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format currency value
  const formatCurrency = (val: number, showSign = false) => {
    const formatted = formatAmount(val);
    const sign = showSign && val > 0 ? '+ ' : val < 0 ? '- ' : '';
    return `${sign}${formatted}${currencySymbol}`;
  };

  const [chartTooltip, setChartTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [atTop, setAtTop] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY <= 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // First year with data (exception for the opening 'Ingreso'/'Anterior' entry)
  const firstYear = useMemo(() => {
    const years = movements
      .map((m) => new Date(m.date).getFullYear())
      .filter((y) => !isNaN(y));
    return years.length > 0 ? Math.min(...years) : new Date().getFullYear();
  }, [movements]);

  // Compute Current Total Balance
  const totalBalance = useMemo(() => {
    return movements.reduce((acc, m) => {
      const date = new Date(m.date);
      const isAnteriorOpening =
        m.type === 'ingreso' &&
        m.category.toLowerCase() === 'ingreso' &&
        m.subcategory.toLowerCase() === 'anterior' &&
        date.getMonth() === 0 &&
        date.getDate() === 1;
      if (isAnteriorOpening && date.getFullYear() !== firstYear) return acc;
      return m.type === 'ingreso' ? acc + m.amount : acc - m.amount;
    }, 0);
  }, [movements, firstYear]);

  const now = new Date();
  const currentYear = now.getFullYear();

  const availableYears = useMemo(() => {
    const years = new Set<number>(
      movements
        .map((m) => new Date(m.date).getFullYear())
        .filter((y) => !isNaN(y))
    );
    years.add(currentYear);
    return [...years].sort((a, b) => b - a);
  }, [movements, currentYear]);

  const yearlyStats = useMemo(() => {
    const income = movements
      .filter((m) => m.type === 'ingreso' && m.date.startsWith(`${selectedYear}-`))
      .reduce((acc, m) => acc + m.amount, 0);

    const expense = movements
      .filter((m) => m.type === 'gasto' && m.date.startsWith(`${selectedYear}-`))
      .reduce((acc, m) => acc + m.amount, 0);

    return { income, expense };
  }, [movements, selectedYear]);

  const shortMonths = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

  const monthlyHistory = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const mm = String(i + 1).padStart(2, '0');
      const income = movements
        .filter((mov) => mov.type === 'ingreso' && mov.date.startsWith(`${selectedYear}-${mm}`))
        .reduce((acc, mov) => acc + mov.amount, 0);
      const expense = movements
        .filter((mov) => mov.type === 'gasto' && mov.date.startsWith(`${selectedYear}-${mm}`))
        .reduce((acc, mov) => acc + mov.amount, 0);
      return { month: i, income, expense };
    });
  }, [movements, selectedYear]);

  const maxAmount = Math.max(...monthlyHistory.flatMap((m) => [m.income, m.expense]), 1);

  // Recent 3 movements
  const recentMovements = useMemo(() => {
    return [...movements]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [movements]);

  // Category Icon Resolver
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('ingreso') || name.includes('pens')) return 'payments';
    if (name.includes('aliment') || name.includes('super')) return 'shopping_basket';
    if (name.includes('viv') || name.includes('hogar') || name.includes('luz')) return 'bolt';
    if (name.includes('salud') || name.includes('farma')) return 'medical_services';
    return 'receipt';
  };

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-12">
      {/* Top Section: Balance + Action Buttons */}
      <section className="px-4 md:px-margin-desktop py-8 md:py-stack-lg relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-sm md:text-base text-on-surface-variant uppercase tracking-widest">
              Saldo Actual
            </span>
            <div className="flex items-baseline gap-4 flex-wrap">
              <h2 className="font-extrabold text-5xl md:text-[72px] leading-tight text-primary tabular-nums">
                {formatCurrency(totalBalance)}
              </h2>
              <span 
                className="material-symbols-outlined text-secondary text-4xl md:text-[56px]" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <p className="font-normal text-lg md:text-xl text-on-surface-variant">
              Actualizado hoy, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-4">
            <button
              onClick={() => onOpenAddModal('ingreso')}
              className="group flex items-center justify-between w-full md:w-auto min-w-[320px] p-4 md:p-6 bg-secondary text-on-secondary rounded-xl transition-all hover:scale-[1.01] active:scale-95 border-4 border-transparent focus:border-primary cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <span className="material-symbols-outlined text-3xl md:text-[48px]">add_circle</span>
                <span className="font-bold text-xl md:text-2xl">Añadir Ingreso</span>
              </div>
              <span className="material-symbols-outlined text-2xl md:text-[36px] opacity-70 group-hover:opacity-100 transition-opacity">
                arrow_forward_ios
              </span>
            </button>

            <button
              onClick={() => onOpenAddModal('gasto')}
              className="group flex items-center justify-between w-full md:w-auto min-w-[320px] p-4 md:p-6 bg-error text-on-error rounded-xl transition-all hover:scale-[1.01] active:scale-95 border-4 border-transparent focus:border-primary cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <span className="material-symbols-outlined text-3xl md:text-[48px]">remove_circle</span>
                <span className="font-bold text-xl md:text-2xl">Añadir Gasto</span>
              </div>
              <span className="material-symbols-outlined text-2xl md:text-[36px] opacity-70 group-hover:opacity-100 transition-opacity">
                arrow_forward_ios
              </span>
            </button>
          </div>
        </div>

        {/* Subtle Background Blur Decoration */}
        <div className="absolute right-[5%] top-[10%] w-96 h-96 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      </section>

      {/* Yearly Summary Cards */}
      <section className="px-4 md:px-margin-desktop py-stack-lg">
        <div className="flex items-center gap-4 mb-stack-md">
          <span className="material-symbols-outlined text-primary text-[32px]">calendar_month</span>
          <h3 className="font-bold text-2xl md:text-3xl text-on-surface">Resumen del Año {selectedYear}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-6 md:p-10 flex flex-col gap-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base text-on-surface-variant uppercase tracking-widest">
                Gastos
              </span>
              <span className="material-symbols-outlined text-error text-4xl md:text-[48px]">trending_down</span>
            </div>
            <span className="font-bold text-4xl md:text-[56px] text-error tabular-nums">
              - {formatAmount(yearlyStats.expense)}€
            </span>
          </div>

          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-6 md:p-10 flex flex-col gap-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base text-on-surface-variant uppercase tracking-widest">
                Ingresos
              </span>
              <span className="material-symbols-outlined text-secondary text-4xl md:text-[48px]">trending_up</span>
            </div>
            <span className="font-bold text-4xl md:text-[56px] text-secondary tabular-nums">
              + {formatAmount(yearlyStats.income)}€
            </span>
          </div>
        </div>
      </section>

      {/* History Visualization Section */}
      <section className="px-4 md:px-margin-desktop py-stack-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-stack-lg gap-4">
          <div>
            <h3 className="font-bold text-2xl md:text-3xl text-on-surface">Histórico de {selectedYear}</h3>
            <p className="text-base md:text-lg text-on-surface-variant">
              Ingresos y gastos mensuales del año
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="h-14 px-4 bg-white border-2 border-outline-variant font-semibold text-base rounded-full focus:border-primary outline-none cursor-pointer"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  Año {year}
                </option>
              ))}
            </select>
            <button
              onClick={onGoToRegistro}
              className="flex items-center justify-center gap-3 px-6 md:px-8 h-14 bg-primary text-on-primary rounded-full font-semibold text-base md:text-lg hover:bg-primary-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">analytics</span>
              Ver detalles del informe
            </button>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-6 md:p-10 shadow-sm overflow-hidden">
          <div className="flex items-end justify-between h-72 md:h-80 gap-1 md:gap-2">
            {monthlyHistory.map((item) => {
              const incomeH = maxAmount > 0 ? (item.income / maxAmount) * 100 : 0;
              const expenseH = maxAmount > 0 ? (item.expense / maxAmount) * 100 : 0;
              const isCurrent = selectedYear === now.getFullYear() && item.month === now.getMonth();
              return (
                <div key={item.month} className="flex-1 h-full flex flex-col items-center gap-2 group min-w-0">
                  <div className="w-full flex-1 flex flex-col justify-end gap-0.5">
                    <div
                      className="w-full bg-error rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                      style={{ height: `${expenseH}%`, minHeight: expenseH > 0 ? '0.25rem' : 0 }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setChartTooltip({
                          text: `Gastos: ${formatAmount(item.expense)}${currencySymbol}`,
                          x: rect.left,
                          y: rect.bottom + 8,
                        });
                      }}
                      onMouseLeave={() => setChartTooltip(null)}
                    />
                    <div
                      className="w-full bg-secondary rounded-t-sm transition-all duration-500"
                      style={{ height: `${incomeH}%`, minHeight: incomeH > 0 ? '0.25rem' : 0 }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setChartTooltip({
                          text: `Ingresos: ${formatAmount(item.income)}${currencySymbol}`,
                          x: rect.left,
                          y: rect.bottom + 8,
                        });
                      }}
                      onMouseLeave={() => setChartTooltip(null)}
                    />
                  </div>
                  <span className={`font-medium text-xs md:text-sm text-on-surface-variant uppercase ${isCurrent ? 'font-bold text-secondary' : ''}`}>
                    {shortMonths[item.month]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-6 md:gap-12 border-t-2 border-outline-variant pt-4 md:pt-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-secondary rounded-sm" />
              <span className="font-medium text-sm md:text-base text-on-surface-variant">Ingresos</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-error rounded-sm" />
              <span className="font-medium text-sm md:text-base text-on-surface-variant">Gastos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Movements List */}
      <section className="px-4 md:px-margin-desktop py-stack-lg">
        <div className="flex items-center justify-between mb-stack-md">
          <h3 className="font-bold text-2xl md:text-3xl text-on-surface">Últimos Movimientos</h3>
          <span className="text-on-surface-variant font-medium text-base">Viendo los últimos 3</span>
        </div>

        <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl divide-y-2 divide-outline-variant overflow-hidden shadow-sm">
          {recentMovements.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">No hay movimientos registrados.</div>
          ) : (
            recentMovements.map((mov) => {
              const isIncome = mov.type === 'ingreso';
              const icon = getCategoryIcon(mov.category || mov.description);

              return (
                <div
                  key={mov.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 hover:bg-surface-container-low transition-colors gap-4"
                >
                  <div className="flex items-center gap-6 md:gap-8">
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 ${
                        isIncome ? 'bg-secondary-container' : 'bg-error-container'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-3xl md:text-[40px] ${
                          isIncome ? 'text-on-secondary-container' : 'text-on-error-container'
                        }`}
                      >
                        {icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-xl md:text-2xl text-on-surface leading-tight">
                        {mov.description}
                      </p>
                      <p className="font-normal text-base text-on-surface-variant">
                        {mov.date} • {mov.category} ({mov.subcategory})
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-bold text-3xl md:text-[36px] tabular-nums ${
                      isIncome ? 'text-secondary' : 'text-error'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatAmount(mov.amount)}€
                  </span>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onGoToRegistro}
          className="w-full mt-stack-md h-[70px] md:h-[80px] border-4 border-primary text-primary font-bold text-xl md:text-2xl rounded-xl hover:bg-primary/5 transition-all flex items-center justify-center gap-4 cursor-pointer"
        >
          <span className="material-symbols-outlined text-3xl md:text-[32px]">list_alt</span>
          Ver todos los movimientos
        </button>
      </section>

      {/* Tooltip for chart bars */}
      {chartTooltip && (
        <div
          className="fixed z-50 px-4 py-2 bg-inverse-surface text-inverse-on-surface font-medium text-sm rounded-lg shadow-lg pointer-events-none"
          style={{ left: chartTooltip.x, top: chartTooltip.y }}
        >
          {chartTooltip.text}
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
    </div>
  );
};
