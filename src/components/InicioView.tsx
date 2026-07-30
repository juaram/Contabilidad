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

  // Current Month Summary (October or latest month from data)
  const monthlyStats = useMemo(() => {
    const income = movements
      .filter((m) => m.type === 'ingreso')
      .reduce((acc, m) => acc + m.amount, 0);

    const expense = movements
      .filter((m) => m.type === 'gasto')
      .reduce((acc, m) => acc + m.amount, 0);

    return { income, expense };
  }, [movements]);

  // Income progress percentage (against max target of 2500)
  const incomePercent = Math.min(100, Math.round((monthlyStats.income / 2500) * 100)) || 85;
  // Expense progress percentage (against max target of 2000)
  const expensePercent = Math.min(100, Math.round((monthlyStats.expense / 2000) * 100)) || 40;

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
      {/* Top Section: Dynamic Balance Header */}
      <section className="px-4 md:px-margin-desktop py-8 md:py-stack-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col gap-2 mb-stack-sm">
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
        </div>

        {/* Subtle Background Blur Decoration */}
        <div className="absolute right-[5%] top-[10%] w-96 h-96 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      </section>

      {/* Action Hub: High-Contrast Big Buttons */}
      <section className="px-4 md:px-margin-desktop py-stack-md bg-surface-container-low border-y-2 border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => onOpenAddModal('ingreso')}
            className="group flex items-center justify-between p-6 md:p-8 bg-secondary text-on-secondary rounded-xl transition-all hover:scale-[1.01] active:scale-95 border-4 border-transparent focus:border-primary min-h-[120px] md:h-[140px] cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-6 md:gap-8">
              <span className="material-symbols-outlined text-4xl md:text-[64px]">add_circle</span>
              <span className="font-bold text-2xl md:text-3xl">Añadir Ingreso</span>
            </div>
            <span className="material-symbols-outlined text-3xl md:text-[48px] opacity-70 group-hover:opacity-100 transition-opacity">
              arrow_forward_ios
            </span>
          </button>

          <button
            onClick={() => onOpenAddModal('gasto')}
            className="group flex items-center justify-between p-6 md:p-8 bg-error text-on-error rounded-xl transition-all hover:scale-[1.01] active:scale-95 border-4 border-transparent focus:border-primary min-h-[120px] md:h-[140px] cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-6 md:gap-8">
              <span className="material-symbols-outlined text-4xl md:text-[64px]">remove_circle</span>
              <span className="font-bold text-2xl md:text-3xl">Añadir Gasto</span>
            </div>
            <span className="material-symbols-outlined text-3xl md:text-[48px] opacity-70 group-hover:opacity-100 transition-opacity">
              arrow_forward_ios
            </span>
          </button>
        </div>
      </section>

      {/* Monthly Summary Cards */}
      <section className="px-4 md:px-margin-desktop py-stack-lg">
        <div className="flex items-center gap-4 mb-stack-md">
          <span className="material-symbols-outlined text-primary text-[32px]">calendar_month</span>
          <h3 className="font-bold text-2xl md:text-3xl text-on-surface">Resumen de Octubre</h3>
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

      {/* History Visualization Section */}
      <section className="px-4 md:px-margin-desktop py-stack-lg bg-surface-container-low border-t border-b border-outline-variant">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-stack-lg gap-4">
          <div>
            <h3 className="font-bold text-2xl md:text-3xl text-on-surface">Histórico de 6 Meses</h3>
            <p className="text-base md:text-lg text-on-surface-variant">
              Comparativa de ingresos y ahorros mensuales
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
          <div className="flex items-end justify-between h-72 md:h-80 gap-3 md:gap-6">
            {/* MAY */}
            <div className="flex-1 flex flex-col items-center gap-4 group">
              <div className="w-full bg-primary/20 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: '60%' }}>
                <div className="bg-primary w-full h-[70%] group-hover:h-[75%] transition-all duration-500" />
              </div>
              <span className="font-medium text-sm md:text-base text-on-surface-variant uppercase">MAY</span>
            </div>

            {/* JUN */}
            <div className="flex-1 flex flex-col items-center gap-4 group">
              <div className="w-full bg-primary/20 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: '75%' }}>
                <div className="bg-primary w-full h-[65%] group-hover:h-[70%] transition-all duration-500" />
              </div>
              <span className="font-medium text-sm md:text-base text-on-surface-variant uppercase">JUN</span>
            </div>

            {/* JUL */}
            <div className="flex-1 flex flex-col items-center gap-4 group">
              <div className="w-full bg-primary/20 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: '45%' }}>
                <div className="bg-primary w-full h-[90%] group-hover:h-[95%] transition-all duration-500" />
              </div>
              <span className="font-medium text-sm md:text-base text-on-surface-variant uppercase">JUL</span>
            </div>

            {/* AGO */}
            <div className="flex-1 flex flex-col items-center gap-4 group">
              <div className="w-full bg-primary/20 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: '90%' }}>
                <div className="bg-primary w-full h-[40%] group-hover:h-[45%] transition-all duration-500" />
              </div>
              <span className="font-medium text-sm md:text-base text-on-surface-variant uppercase">AGO</span>
            </div>

            {/* SEP */}
            <div className="flex-1 flex flex-col items-center gap-4 group">
              <div className="w-full bg-primary/20 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: '80%' }}>
                <div className="bg-primary w-full h-[75%] group-hover:h-[80%] transition-all duration-500" />
              </div>
              <span className="font-medium text-sm md:text-base text-on-surface-variant uppercase">SEP</span>
            </div>

            {/* OCT */}
            <div className="flex-1 flex flex-col items-center gap-4 group">
              <div className="w-full bg-secondary/30 rounded-t-lg relative flex flex-col justify-end overflow-hidden border-2 border-secondary" style={{ height: '100%' }}>
                <div className="bg-secondary w-full h-[60%] group-hover:h-[65%] transition-all duration-500" />
              </div>
              <span className="font-bold text-base md:text-lg text-secondary uppercase">OCT</span>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-6 md:gap-12 border-t-2 border-outline-variant pt-6 md:pt-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary rounded-sm" />
              <span className="font-medium text-sm md:text-base text-on-surface-variant">Ingresos medios</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-sm" />
              <span className="font-medium text-sm md:text-base text-on-surface-variant">Gastos medios</span>
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
