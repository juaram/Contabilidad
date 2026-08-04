import type { Movement, Category, Budget } from './types';

const BASE = '/conta/api/';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  let data: any;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'El servidor devolvió una respuesta vacía. Revisa que PHP no tenga errores.');
  }
  if (!res.ok) {
    throw new Error(data.error || 'Error de conexión con el servidor');
  }
  return data as T;
}

export interface MovementFilters {
  year?: string;
  month?: string;
  category_id?: number;
  subcategory_id?: number;
  search?: string;
  page?: number;
}

export interface PaginatedMovements {
  movements: Movement[];
  totals: {
    income: number;
    expense: number;
    balance: number;
  };
  pagination: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export interface DashboardStats {
  balance: number;
  total_income: number;
  total_expense: number;
  monthly_history: { month_name: string; month_num: string; year: number; income: number; expense: number }[];
  last_movements: Movement[];
}

export async function fetchCategories(): Promise<Category[]> {
  return request<Category[]>('categories.php');
}

export async function createCategory(
  name: string,
  icon: string,
  colorBgClass: string,
  colorTextClass: string
): Promise<Category> {
  return request<Category>('categories.php', {
    method: 'POST',
    body: JSON.stringify({ name, icon, color_bg: colorBgClass, color_text: colorTextClass }),
  });
}

export async function updateCategory(
  id: number,
  data: { name?: string; icon?: string; color_bg?: string; color_text?: string }
): Promise<Category> {
  return request<Category>('categories.php?_method=PUT', {
    method: 'POST',
    body: JSON.stringify({ id, ...data }),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  await request(`categories.php?_method=DELETE&id=${id}`, { method: 'POST' });
}

export async function reorderCategories(order: { id: number; sort_order: number }[]): Promise<{ message: string }> {
  return request<{ message: string }>('categories.php?_action=reorder', {
    method: 'POST',
    body: JSON.stringify({ order }),
  });
}

export async function createSubcategory(categoryId: number, name: string): Promise<{ id: number; category_id: number; name: string }> {
  return request('subcategories.php', {
    method: 'POST',
    body: JSON.stringify({ category_id: categoryId, name }),
  });
}

export async function deleteSubcategory(id: number): Promise<void> {
  await request(`subcategories.php?_method=DELETE&id=${id}`, { method: 'POST' });
}

export async function fetchMovements(filters: MovementFilters = {}): Promise<PaginatedMovements> {
  const params = new URLSearchParams();
  if (filters.year) params.set('year', filters.year);
  if (filters.month) params.set('month', filters.month);
  if (filters.category_id) params.set('category_id', String(filters.category_id));
  if (filters.subcategory_id) params.set('subcategory_id', String(filters.subcategory_id));
  if (filters.search) params.set('search', filters.search);
  if (filters.page) params.set('page', String(filters.page));
  const qs = params.toString();
  return request<PaginatedMovements>(`movements.php${qs ? '?' + qs : ''}`);
}

export async function createMovement(data: {
  date: string;
  category_id: number;
  subcategory_id?: number | null;
  description: string;
  type: 'ingreso' | 'gasto';
  amount: number;
}): Promise<Movement> {
  return request<Movement>('movements.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMovement(
  id: number,
  data: {
    date: string;
    category_id: number;
    subcategory_id?: number | null;
    description: string;
    type: 'ingreso' | 'gasto';
    amount: number;
  }
): Promise<Movement> {
  return request<Movement>('movements.php?_method=PUT', {
    method: 'POST',
    body: JSON.stringify({ id, ...data }),
  });
}

export async function deleteMovement(id: number): Promise<void> {
  await request(`movements.php?_method=DELETE&id=${id}`, { method: 'POST' });
}

export async function fetchStats(): Promise<DashboardStats> {
  return request<DashboardStats>('stats.php');
}

export async function fetchPreferences(): Promise<any> {
  return request('preferences.php');
}

export async function updatePreferences(data: Record<string, any>): Promise<any> {
  return request('preferences.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(username: string, password: string): Promise<{ token: string; user: { id: number; username: string } }> {
  return request('login.php', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function changePassword(username: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return request('change-password.php', {
    method: 'POST',
    body: JSON.stringify({ username, current_password: currentPassword, new_password: newPassword }),
  });
}

export interface User {
  id: string;
  username: string;
  created_at?: string;
}

export async function fetchUsers(): Promise<User[]> {
  return request<User[]>('users.php');
}

export async function createUser(username: string, password: string): Promise<{ message: string; id: number; username: string }> {
  return request('users.php', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function updateUser(id: number, username: string, password?: string): Promise<{ message: string }> {
  return request('users.php?_method=PUT', {
    method: 'POST',
    body: JSON.stringify({ id, username, password }),
  });
}

export async function deleteUser(id: number): Promise<{ message: string }> {
  return request(`users.php?_method=DELETE&id=${id}`, { method: 'POST' });
}

export interface MaintenanceRule {
  filter_category: string;
  filter_subcategory: string;
  filter_description?: string;
  final_category: string;
  final_subcategory: string;
  final_description?: string;
}

export interface MaintenancePreviewItem {
  id: number;
  date: string;
  description: string;
  category: string;
  subcategory: string;
  type: 'ingreso' | 'gasto';
  amount: number;
}

export interface MaintenanceResult {
  preview: boolean;
  total?: number;
  movements?: MaintenancePreviewItem[];
  updated?: number;
  created_subcategories?: string[];
}

export async function runMaintenance(rule: MaintenanceRule, preview: boolean = true): Promise<MaintenanceResult> {
  return request<MaintenanceResult>('maintenance.php', {
    method: 'POST',
    body: JSON.stringify({ ...rule, preview }),
  });
}

export interface BudgetFilters {
  year?: number;
  month?: string;
  type?: string;
}

export interface BudgetPayload {
  category_id: number;
  subcategory_id?: number | null;
  type: 'gasto' | 'ingreso';
  year: number;
  month: string;
  amount: number;
}

export async function fetchBudgets(filters: BudgetFilters = {}): Promise<Budget[]> {
  const params = new URLSearchParams();
  if (filters.year) params.set('year', String(filters.year));
  if (filters.month) params.set('month', filters.month);
  if (filters.type) params.set('type', filters.type);
  const qs = params.toString();
  return request<Budget[]>(`budgets.php${qs ? '?' + qs : ''}`);
}

export async function createBudget(data: BudgetPayload): Promise<Budget> {
  return request<Budget>('budgets.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBudget(id: number, data: BudgetPayload): Promise<Budget> {
  return request<Budget>('budgets.php?_method=PUT', {
    method: 'POST',
    body: JSON.stringify({ id, ...data }),
  });
}

export async function deleteBudget(id: number): Promise<{ message: string }> {
  return request(`budgets.php?_method=DELETE&id=${id}`, { method: 'POST' });
}
