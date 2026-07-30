export type MovementType = 'ingreso' | 'gasto';

export interface Movement {
  id: string;
  date: string;
  category_id: string;
  category: string;
  subcategory_id: string | null;
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
  name: string;
  icon: string;
  colorBgClass: string;
  colorTextClass: string;
  subcategories: Subcategory[];
}

export interface UserPreferences {
  currency: string;
  dateFormat: string;
  highContrast: boolean;
  appTitle: string;
  appSubtitle: string;
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
