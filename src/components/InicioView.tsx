import React, { useMemo } from 'react';
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

  // Format currency value
  const formatCurrency = (val: number, showSign = false) => {
    const formatted = val.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const sign = showSign && val > 0 ? '+ ' : val < 0 ? '- ' : '';
    return `${sign}${formatted}${currencySymbol}`;
  };

  // Compute Current Total Balance
  const totalBalance = useMemo(() => {
    return movements.reduce((acc, m) => {
      return m.type === 'ingreso' ? acc + m.amount : acc - m.amount;
    }, 0);
  }, [movements]);

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = now.getFullYear();
  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const currentMonthName = monthNames[now.getMonth()];

  const isCurrentMonth = (d: string) => d.startsWith(`${currentYear}-${currentMonth}`);
  const isCurrentYear = (d: string) => d.startsWith(`${currentYear}`);

  const monthlyStats = useMemo(() => {
    const income = movements
      .filter((m) => m.type === 'ingreso' && isCurrentMonth(m.date))
      .reduce((acc, m) => acc + m.amount, 0);

    const expense = movements
      .filter((m) => m.type === 'gasto' && isCurrentMonth(m.date))
      .reduce((acc, m) => acc + m.amount, 0);

    return { income, expense };
  }, [movements]);

  const yearlyStats = useMemo(() => {
    const income = movements
      .filter((m) => m.type === 'ingreso' && isCurrentYear(m.date))
      .reduce((acc, m) => acc + m.amount, 0);

    const expense = movements
      .filter((m) => m.type === 'gasto' && isCurrentYear(m.date))
      .reduce((acc, m) => acc + m.amount, 0);

    return { income, expense };
  }, [movements]);

  // Income progress percentage (against max target of 2500)
  const incomePercent = Math.min(100, Math.round((monthlyStats.income / 2500) * 100)) || 85;
  // Expense progress percentage (against max target of 2000)
  const expensePercent = Math.min(100, Math.round((monthlyStats.expense / 2000) * 100)) || 40;

  const shortMonths = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

  const monthlyHistory = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const mm = String(i + 1).padStart(2, '0');
      const income = movements
        .filter((mov) => mov.type === 'ingreso' && mov.date.startsWith(`${currentYear}-${mm}`))
        .reduce((acc, mov) => acc + mov.amount, 0);
      const expense = movements
        .filter((mov) => mov.type === 'gasto' && mov.date.startsWith(`${currentYear}-${mm}`))
        .reduce((acc, mov) => acc + mov.amount, 0);
      return { month: i, income, expense };
    });
  }, [movements]);

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
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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

          <button
            onClick={() => onOpenAddModal('ingreso')}
            className="group flex items-center justify-between p-4 md:p-6 bg-secondary text-on-secondary rounded-xl transition-all hover:scale-[1.01] active:scale-95 border-4 border-transparent focus:border-primary cursor-pointer shadow-sm"
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
            className="group flex items-center justify-between p-4 md:p-6 bg-error text-on-error rounded-xl transition-all hover:scale-[1.01] active:scale-95 border-4 border-transparent focus:border-primary cursor-pointer shadow-sm"
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

        {/* Subtle Background Blur Decoration */}
        <div className="absolute right-[5%] top-[10%] w-96 h-96 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      </section>

      {/* Monthly Summary Cards */}
      <section className="px-4 md:px-margin-desktop py-stack-lg">
        <div className="flex items-center gap-4 mb-stack-md">
          <span className="material-symbols-outlined text-primary text-[32px]">calendar_month</span>
          <h3 className="font-bold text-2xl md:text-3xl text-on-surface">Resumen de {currentMonthName}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Card */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-6 md:p-10 flex flex-col gap-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base text-on-surface-variant uppercase tracking-widest">
                Haber (Ingresos)
              </span>
              <span className="material-symbols-outlined text-secondary text-4xl md:text-[48px]">trending_up</span>
            </div>
            <span className="font-bold text-4xl md:text-[56px] text-secondary tabular-nums">
              + {monthlyStats.income.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
            </span>
            <div className="w-full bg-surface-container h-6 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full transition-all duration-1000"
                style={{ width: `${incomePercent}%` }}
              />
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-6 md:p-10 flex flex-col gap-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base text-on-surface-variant uppercase tracking-widest">
                Debe (Gastos)
              </span>
              <span className="material-symbols-outlined text-error text-4xl md:text-[48px]">trending_down</span>
            </div>
            <span className="font-bold text-4xl md:text-[56px] text-error tabular-nums">
              - {monthlyStats.expense.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
            </span>
            <div className="w-full bg-surface-container h-6 rounded-full overflow-hidden">
              <div
                className="bg-error h-full transition-all duration-1000"
                style={{ width: `${expensePercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Yearly Summary Cards */}
      <section className="px-4 md:px-margin-desktop py-stack-lg">
        <div className="flex items-center gap-4 mb-stack-md">
          <span className="material-symbols-outlined text-primary text-[32px]">calendar_month</span>
          <h3 className="font-bold text-2xl md:text-3xl text-on-surface">Resumen del Año {currentYear}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-6 md:p-10 flex flex-col gap-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base text-on-surface-variant uppercase tracking-widest">
                Ingresos
              </span>
              <span className="material-symbols-outlined text-secondary text-4xl md:text-[48px]">trending_up</span>
            </div>
            <span className="font-bold text-4xl md:text-[56px] text-secondary tabular-nums">
              + {yearlyStats.income.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
            </span>
          </div>

          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-6 md:p-10 flex flex-col gap-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base text-on-surface-variant uppercase tracking-widest">
                Gastos
              </span>
              <span className="material-symbols-outlined text-error text-4xl md:text-[48px]">trending_down</span>
            </div>
            <span className="font-bold text-4xl md:text-[56px] text-error tabular-nums">
              - {yearlyStats.expense.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
            </span>
          </div>
        </div>
      </section>

      {/* History Visualization Section */}
      <section className="px-4 md:px-margin-desktop py-stack-lg bg-surface-container-low border-t border-b border-outline-variant">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-stack-lg gap-4">
          <div>
            <h3 className="font-bold text-2xl md:text-3xl text-on-surface">Histórico de {currentYear}</h3>
            <p className="text-base md:text-lg text-on-surface-variant">
              Ingresos y gastos mensuales del año
            </p>
          </div>
          <button
            onClick={onGoToRegistro}
            className="flex items-center gap-3 px-6 md:px-8 h-14 bg-primary text-on-primary rounded-full font-semibold text-base md:text-lg hover:bg-primary-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">analytics</span>
            Ver detalles del informe
          </button>
        </div>

        {/* Bar Chart Visualization */}
        <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-6 md:p-10">
          <div className="flex items-end justify-between h-72 md:h-80 gap-1 md:gap-2">
            {monthlyHistory.map((item) => {
              const incomeH = maxAmount > 0 ? (item.income / maxAmount) * 100 : 0;
              const expenseH = maxAmount > 0 ? (item.expense / maxAmount) * 100 : 0;
              const isCurrent = item.month === now.getMonth();
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group min-w-0">
                  <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '100%' }}>
                    <div
                      className="w-full bg-error/30 rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                      style={{ height: `${expenseH}%` }}
                      title={`Gastos: ${item.expense.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`}
                    />
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 ${isCurrent ? 'bg-secondary' : 'bg-primary'}`}
                      style={{ height: `${incomeH}%` }}
                      title={`Ingresos: ${item.income.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`}
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
              <div className="w-5 h-5 bg-primary rounded-sm" />
              <span className="font-medium text-sm md:text-base text-on-surface-variant">Ingresos</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-error/30 rounded-sm" />
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
                    {isIncome ? '+' : '-'}{mov.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
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
    </div>
  );
};
