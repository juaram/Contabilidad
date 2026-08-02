import { Budget, BudgetType, Movement } from './types';

/**
 * Presupuesto efectivo de cada mes del año para un tipo dado.
 * Modelo aditivo: los presupuestos recurrentes (month='00') se suman a todos los meses;
 * los de mes concreto se suman solo a ese mes.
 */
export function monthlyBudgetsForYear(budgets: Budget[], year: number, type: BudgetType): number[] {
  const result = new Array<number>(12).fill(0);
  for (const b of budgets) {
    if (b.year !== year || b.type !== type) continue;
    if (b.month === '00') {
      for (let i = 0; i < 12; i++) result[i] += b.amount;
    } else {
      const idx = parseInt(b.month, 10) - 1;
      if (idx >= 0 && idx < 12) result[idx] += b.amount;
    }
  }
  return result;
}

export function budgetForPeriod(budgets: Budget[], year: number, month: string, type: BudgetType): number {
  if (month === '00' || month === 'todos' || month === '') {
    return monthlyBudgetsForYear(budgets, year, type).reduce((s, v) => s + v, 0);
  }
  const idx = parseInt(month, 10) - 1;
  if (idx < 0 || idx > 11) return 0;
  return monthlyBudgetsForYear(budgets, year, type)[idx];
}

export function actualForPeriod(
  movements: Movement[],
  year: number,
  month: string,
  type: BudgetType,
  categoryId?: string,
  subcategoryName?: string,
): number {
  return movements.reduce((sum, m) => {
    if (m.type !== type) return sum;
    const d = new Date(m.date);
    const y = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    if (y !== year) return sum;
    if (month !== '00' && month !== 'todos' && month !== '' && mm !== month) return sum;
    if (categoryId && m.category_id !== categoryId) return sum;
    if (subcategoryName && m.subcategory.toLowerCase() !== subcategoryName.toLowerCase()) return sum;
    return sum + m.amount;
  }, 0);
}

/**
 * Sugerencia basada en la media de los dos últimos años naturales anteriores a `year`.
 * Para periodo mensual devuelve la media mensual; para anual la media anual total.
 */
export function suggestBudgetAmount(
  movements: Movement[],
  year: number,
  month: string,
  type: BudgetType,
  categoryId?: string,
  subcategoryName?: string,
): number {
  const years = [year - 1, year - 2];
  let total = 0;
  let count = 0;
  for (const y of years) {
    const yearlyTotal = movements.reduce((sum, m) => {
      if (m.type !== type) return sum;
      const d = new Date(m.date);
      if (d.getFullYear() !== y) return sum;
      if (categoryId && m.category_id !== categoryId) return sum;
      if (subcategoryName && m.subcategory.toLowerCase() !== subcategoryName.toLowerCase()) return sum;
      return sum + m.amount;
    }, 0);
    total += yearlyTotal;
    count++;
  }
  if (count === 0 || total === 0) return 0;
  const avgYear = total / count;
  const isMonthly = month !== '00' && month !== 'todos' && month !== '';
  return isMonthly ? avgYear / 12 : avgYear;
}

export function progressStatus(actual: number, budgeted: number): 'ok' | 'warn' | 'over' | 'none' {
  if (budgeted <= 0) return 'none';
  const pct = actual / budgeted;
  if (pct >= 1) return 'over';
  if (pct >= 0.75) return 'warn';
  return 'ok';
}
