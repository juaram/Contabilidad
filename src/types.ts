export type MovementType = 'ingreso' | 'gasto';

export interface Movement {
  id: string;
  date: string; // ISO or YYYY-MM-DD
  category: string;
  categoryCode: string;
  subcategory: string;
  description: string;
  type: MovementType;
  amount: number;
  balanceAfter?: number;
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  icon: string;
  colorBgClass: string;
  colorTextClass: string;
  subcategories: Subcategory[];
}

export interface UserPreferences {
  currency: string; // 'Euro (€) - EUR', 'Dólar ($) - USD', 'Libra (£) - GBP'
  dateFormat: string; // 'DD / MM / AAAA (31/12/2024)'
  highContrast: boolean;
}

export interface FilterState {
  year: number;
  month: string; // 'todos' | '01' | ... | '10'
  category: string;
  subcategory: string;
  searchQuery: string;
}

export interface MonthlyHistory {
  monthName: string;
  year: number;
  income: number;
  expense: number;
}
