import http from 'node:http';

const PORT = 8080;

const categories = [
  { id: 1, code: 'VIV', name: 'Vivienda / Hogar', icon: 'home', color_bg: 'bg-primary-fixed', color_text: 'text-on-primary-fixed', sort_order: 0, movement_count: 0, subcategories: [{ id: 1, category_id: 1, name: 'Luz' }, { id: 2, category_id: 1, name: 'Agua' }, { id: 3, category_id: 1, name: 'Alquiler' }] },
  { id: 2, code: 'ALM', name: 'Alimentación', icon: 'shopping_basket', color_bg: 'bg-primary-fixed', color_text: 'text-on-primary-fixed', sort_order: 1, movement_count: 0, subcategories: [{ id: 4, category_id: 2, name: 'Supermercado' }, { id: 5, category_id: 2, name: 'Restaurantes' }] },
  { id: 3, code: 'SAL', name: 'Salud', icon: 'medical_services', color_bg: 'bg-primary-fixed', color_text: 'text-on-primary-fixed', sort_order: 2, movement_count: 0, subcategories: [{ id: 6, category_id: 3, name: 'Farmacia' }, { id: 7, category_id: 3, name: 'Médico' }] },
  { id: 4, code: 'ING', name: 'Pensiones e Ingresos', icon: 'savings', color_bg: 'bg-primary-fixed', color_text: 'text-on-primary-fixed', sort_order: 3, movement_count: 0, subcategories: [{ id: 8, category_id: 4, name: 'Pensión' }, { id: 9, category_id: 4, name: 'Otros Ingresos' }] },
  { id: 5, code: 'VAR', name: 'Varios y Ocio', icon: 'category', color_bg: 'bg-primary-fixed', color_text: 'text-on-primary-fixed', sort_order: 4, movement_count: 0, subcategories: [{ id: 10, category_id: 5, name: 'Transporte' }, { id: 11, category_id: 5, name: 'Ocio' }] },
];

const movements = [
  { id: 1, date: '2024-10-15', category_id: 4, subcategory_id: 8, description: 'Cobro pensión octubre', type: 'ingreso', amount: 1250.00 },
  { id: 2, date: '2024-10-14', category_id: 2, subcategory_id: 4, description: 'Compra semanal Mercadona', type: 'gasto', amount: 85.30 },
  { id: 3, date: '2024-10-12', category_id: 1, subcategory_id: 1, description: 'Factura luz octubre', type: 'gasto', amount: 65.00 },
  { id: 4, date: '2024-10-10', category_id: 3, subcategory_id: 6, description: 'Paracetamol y vitaminas', type: 'gasto', amount: 12.50 },
  { id: 5, date: '2024-10-08', category_id: 2, subcategory_id: 5, description: 'Cena con amigos', type: 'gasto', amount: 45.00 },
  { id: 6, date: '2024-10-05', category_id: 4, subcategory_id: 9, description: 'Trabajo freelance', type: 'ingreso', amount: 350.00 },
  { id: 7, date: '2024-10-01', category_id: 1, subcategory_id: 2, description: 'Factura agua', type: 'gasto', amount: 35.00 },
  { id: 8, date: '2024-09-28', category_id: 5, subcategory_id: 10, description: 'Billete tren', type: 'gasto', amount: 25.00 },
  { id: 9, date: '2024-09-15', category_id: 4, subcategory_id: 8, description: 'Cobro pensión septiembre', type: 'ingreso', amount: 1250.00 },
  { id: 10, date: '2024-09-10', category_id: 2, subcategory_id: 4, description: 'Compra semanal Carrefour', type: 'gasto', amount: 92.00 },
];

const budgets = [
  { id: 1, category_id: 1, subcategory_id: 1, type: 'gasto', year: 2024, month: '00', amount: 70.00 },
  { id: 2, category_id: 1, subcategory_id: 2, type: 'gasto', year: 2024, month: '00', amount: 40.00 },
  { id: 3, category_id: 1, subcategory_id: 3, type: 'gasto', year: 2024, month: '00', amount: 600.00 },
  { id: 4, category_id: 2, subcategory_id: 4, type: 'gasto', year: 2024, month: '00', amount: 400.00 },
  { id: 5, category_id: 2, subcategory_id: 5, type: 'gasto', year: 2024, month: '00', amount: 80.00 },
  { id: 6, category_id: 3, subcategory_id: 6, type: 'gasto', year: 2024, month: '00', amount: 50.00 },
  { id: 7, category_id: 4, subcategory_id: 8, type: 'ingreso', year: 2024, month: '00', amount: 1250.00 },
  { id: 8, category_id: 4, subcategory_id: 9, type: 'ingreso', year: 2024, month: '00', amount: 300.00 },
  { id: 9, category_id: 5, subcategory_id: 10, type: 'gasto', year: 2024, month: '00', amount: 60.00 },
];

const catMap = Object.fromEntries(categories.map(c => [c.id, c]));
const subMap = {};
categories.forEach(c => c.subcategories.forEach(s => { subMap[s.id] = s; }));

function respond(res, data, code = 200) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
  });
}

const routes = {
  'GET /conta/api/categories.php': (req, res) => respond(res, [...categories].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))),
  'POST /conta/api/categories.php': async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const data = await parseBody(req);
    if (url.searchParams.get('_action') === 'reorder') {
      for (const item of data.order || []) {
        const idx = categories.findIndex(c => c.id === item.id);
        if (idx !== -1) categories[idx] = { ...categories[idx], sort_order: item.sort_order ?? 0 };
      }
      return respond(res, { message: 'Orden actualizado' });
    }
    if (url.searchParams.get('_method') === 'PUT') {
      const idx = categories.findIndex(c => c.id === data.id);
      if (idx === -1) return respond(res, { error: 'Categoría no encontrada' }, 404);
      categories[idx] = { ...categories[idx], name: data.name, icon: data.icon || 'category', color_bg: data.color_bg || 'bg-primary-fixed', color_text: data.color_text || 'text-on-primary-fixed' };
      return respond(res, { ...categories[idx], subcategories: categories[idx].subcategories || [], movement_count: 0 });
    }
    const { name, icon, color_bg, color_text } = data;
    const id = Math.max(...categories.map(c => c.id)) + 1;
    const cat = { id, name, icon: icon || 'category', color_bg: color_bg || 'bg-primary-fixed', color_text: color_text || 'text-on-primary-fixed', sort_order: Math.max(...categories.map(c => c.sort_order ?? 0), 0) + 1, movement_count: 0, subcategories: [] };
    categories.push(cat);
    respond(res, cat, 201);
  },
  'DELETE /conta/api/categories.php': (req, res) => {
    const id = parseInt(new URL(req.url, 'http://localhost').searchParams.get('id'));
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return respond(res, { error: 'No encontrada' }, 404);
    if (movements.some(m => m.category_id === id)) return respond(res, { error: 'No se puede eliminar: la categoría tiene movimientos' }, 409);
    categories.splice(idx, 1);
    respond(res, { message: 'Categoría eliminada' });
  },
  'POST /conta/api/subcategories.php': async (req, res) => {
    const { category_id, name } = await parseBody(req);
    const cat = categories.find(c => c.id === category_id);
    if (!cat) return respond(res, { error: 'Categoría no existe' }, 404);
    const id = Math.max(...Object.keys(subMap).map(Number), 0) + 1;
    const sub = { id, category_id, name };
    subMap[id] = sub;
    cat.subcategories.push(sub);
    respond(res, sub, 201);
  },
  'DELETE /conta/api/subcategories.php': (req, res) => {
    const id = parseInt(new URL(req.url, 'http://localhost').searchParams.get('id'));
    delete subMap[id];
    categories.forEach(c => { c.subcategories = c.subcategories.filter(s => s.id !== id); });
    respond(res, { message: 'Subcategoría eliminada' });
  },
  'GET /conta/api/movements.php': (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const catId = parseInt(url.searchParams.get('category_id')) || 0;
    const search = (url.searchParams.get('search') || '').toLowerCase();
    let filtered = movements;
    if (catId) filtered = filtered.filter(m => m.category_id === catId);
    if (search) filtered = filtered.filter(m => m.description.toLowerCase().includes(search));
    filtered.sort((a, b) => b.id - a.id);
    let income = 0, expense = 0, balance = 0;
    filtered.forEach(m => { if (m.type === 'ingreso') { income += m.amount; balance += m.amount; } else { expense += m.amount; balance -= m.amount; } });
    respond(res, {
      movements: filtered.map(m => ({ ...m, category: catMap[m.category_id]?.name, category_code: catMap[m.category_id]?.code, subcategory: subMap[m.subcategory_id]?.name || '' })),
      totals: { income, expense, balance },
      pagination: { page: 1, page_size: filtered.length, total_records: filtered.length, total_pages: 1 }
    });
  },
  'POST /conta/api/movements.php': async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const data = await parseBody(req);
    if (url.searchParams.get('_method') === 'PUT') {
      const idx = movements.findIndex(m => m.id === data.id);
      if (idx === -1) return respond(res, { error: 'Movimiento no encontrado' }, 404);
      movements[idx] = { ...movements[idx], date: data.date, category_id: data.category_id, subcategory_id: data.subcategory_id || null, description: data.description, type: data.type, amount: data.amount };
      const m = movements[idx];
      return respond(res, { ...m, category: catMap[m.category_id]?.name, category_code: catMap[m.category_id]?.code, subcategory: subMap[m.subcategory_id]?.name || '' });
    }
    const id = Math.max(...movements.map(m => m.id), 0) + 1;
    const m = { id, date: data.date, category_id: data.category_id, subcategory_id: data.subcategory_id || null, description: data.description, type: data.type, amount: data.amount };
    movements.unshift(m);
    respond(res, { ...m, category: catMap[m.category_id]?.name, category_code: catMap[m.category_id]?.code, subcategory: subMap[m.subcategory_id]?.name || '' }, 201);
  },
  'DELETE /conta/api/movements.php': (req, res) => {
    const id = parseInt(new URL(req.url, 'http://localhost').searchParams.get('id'));
    const idx = movements.findIndex(m => m.id === id);
    if (idx !== -1) movements.splice(idx, 1);
    respond(res, { message: 'Movimiento eliminado' });
  },
  'GET /conta/api/stats.php': (req, res) => {
    const totalIncome = movements.filter(m => m.type === 'ingreso').reduce((s, m) => s + m.amount, 0);
    const totalExpense = movements.filter(m => m.type === 'gasto').reduce((s, m) => s + m.amount, 0);
    respond(res, {
      balance: totalIncome - totalExpense,
      total_income: totalIncome,
      total_expense: totalExpense,
      monthly_history: [{ month_name: 'Sep', month_num: '09', year: 2024, income: 1250, expense: 117 }, { month_name: 'Oct', month_num: '10', year: 2024, income: 1600, expense: 242.80 }],
      last_movements: movements.slice(0, 3).map(m => ({ ...m, category: catMap[m.category_id]?.name, category_code: catMap[m.category_id]?.code, category_icon: catMap[m.category_id]?.icon, subcategory: subMap[m.subcategory_id]?.name || '' }))
    });
  },
  'GET /conta/api/preferences.php': (req, res) => respond(res, { id: 1, currency: 'Euro (€) - EUR', date_format: 'DD / MM / AAAA (31/12/2024)', high_contrast: 0, app_title: 'Mis Cuentas', app_subtitle: 'Control Financiero' }),
  'PUT /conta/api/preferences.php': async (req, res) => respond(res, { id: 1, ...await parseBody(req) }),
  'GET /conta/api/budgets.php': (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const year = parseInt(url.searchParams.get('year')) || 0;
    const month = url.searchParams.get('month') || '';
    const type = url.searchParams.get('type') || '';
    let filtered = budgets;
    if (year) filtered = filtered.filter(b => b.year === year);
    if (month && month !== 'todos') filtered = filtered.filter(b => b.month === month);
    if (type) filtered = filtered.filter(b => b.type === type);
    respond(res, filtered.map(b => ({ ...b, category: catMap[b.category_id]?.name, subcategory: subMap[b.subcategory_id]?.name || '' })));
  },
  'POST /conta/api/budgets.php': async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const data = await parseBody(req);
    if (url.searchParams.get('_method') === 'PUT') {
      const idx = budgets.findIndex(b => b.id === data.id);
      if (idx === -1) return respond(res, { error: 'Presupuesto no encontrado' }, 404);
      budgets[idx] = { ...budgets[idx], category_id: data.category_id, subcategory_id: data.subcategory_id || null, type: data.type, year: data.year, month: data.month, amount: data.amount };
      const b = budgets[idx];
      return respond(res, { ...b, category: catMap[b.category_id]?.name, subcategory: subMap[b.subcategory_id]?.name || '' });
    }
    const id = Math.max(...budgets.map(b => b.id), 0) + 1;
    const b = { id, category_id: data.category_id, subcategory_id: data.subcategory_id || null, type: data.type, year: data.year, month: data.month, amount: data.amount };
    budgets.push(b);
    respond(res, { ...b, category: catMap[b.category_id]?.name, subcategory: subMap[b.subcategory_id]?.name || '' }, 201);
  },
  'DELETE /conta/api/budgets.php': (req, res) => {
    const id = parseInt(new URL(req.url, 'http://localhost').searchParams.get('id'));
    const idx = budgets.findIndex(b => b.id === id);
    if (idx !== -1) budgets.splice(idx, 1);
    respond(res, { message: 'Presupuesto eliminado' });
  },
  'POST /conta/api/login.php': async (req, res) => {
    const { username, password } = await parseBody(req);
    if (username === 'admin' && password === 'password') {
      respond(res, { token: 'mock-token-123', user: { id: 1, username: 'admin' } });
    } else {
      respond(res, { error: 'Usuario o contraseña incorrectos' }, 401);
    }
  },
  'POST /conta/api/change-password.php': async (req, res) => {
    const { current_password, new_password } = await parseBody(req);
    if (current_password === 'password' && new_password.length >= 6) {
      respond(res, { message: 'Contraseña actualizada correctamente' });
    } else {
      respond(res, { error: 'La contraseña actual no es correcta' }, 401);
    }
  },
  'GET /conta/api/export.php': (req, res) => {
    const formatAmount = (n) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const csv = ['Fecha,Categoría,Código,Subcategoría,Descripción,Tipo,Importe', ...movements.map(m => `${m.date},${catMap[m.category_id]?.name},${catMap[m.category_id]?.code},${subMap[m.subcategory_id]?.name || ''},${m.description},${m.type},${formatAmount(m.amount)}`)].join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8' });
    res.end('\uFEFF' + csv);
  },
  'POST /conta/api/maintenance.php': async (req, res) => {
    const data = await parseBody(req);
    const { filter_category, filter_subcategory, filter_description = '', final_category, final_subcategory, final_description = '', preview } = data;

    const findSub = (catName, subName) => {
      const cat = categories.find(c => c.name === catName);
      if (!cat) return null;
      const sub = cat.subcategories.find(s => s.name === subName);
      return sub ? { cat, sub } : null;
    };

    const filterPair = findSub(filter_category, filter_subcategory);
    if (!filterPair) return respond(res, { error: `La subcategoría inicial '${filter_subcategory}' no existe en '${filter_category}'` }, 400);
    let finalPair = findSub(final_category, final_subcategory);
    if (!finalPair) {
      const cat = categories.find(c => c.name === final_category);
      if (!cat) return respond(res, { error: `La categoría final '${final_category}' no existe` }, 400);
      const id = Math.max(...Object.keys(subMap).map(Number), 0) + 1;
      const sub = { id, category_id: cat.id, name: final_subcategory };
      subMap[id] = sub;
      cat.subcategories.push(sub);
      finalPair = { cat, sub };
    }

    const patterns = [];
    if (filter_description.trim()) {
      for (const token of filter_description.split(/\s+OR\s+/i)) {
        const t = token.trim();
        if (t) patterns.push(t.replace(/\*/g, '%'));
      }
    }
    const matches = movements.filter(m =>
      m.category_id === filterPair.cat.id && m.subcategory_id === filterPair.sub.id &&
      (patterns.length === 0 || patterns.some(p => m.description.toLowerCase().includes(p.replace(/%/g, '').toLowerCase())))
    );
    const monthLiterals = ['', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    if (preview) {
      return respond(res, {
        preview: true,
        total: matches.length,
        movements: matches.map(m => ({ id: m.id, date: m.date, description: m.description, category: filterPair.cat.name, subcategory: filterPair.sub.name, type: m.type, amount: m.amount })),
      });
    }

    for (const m of matches) {
      let desc = m.description;
      if (final_description.trim()) {
        desc = final_description;
        if (desc.includes('#mes')) {
          const monthNum = parseInt(m.date.slice(5, 7), 10);
          desc = desc.replace(/#mes/g, monthLiterals[monthNum] || '');
        }
      }
      m.category_id = finalPair.cat.id;
      m.subcategory_id = finalPair.sub.id;
      m.description = desc;
    }
    respond(res, { preview: false, updated: matches.length });
  },
  'GET /conta/api/spellcheck.php': (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.searchParams.get('action') === 'dict') {
      return respond(res, { words: [] });
    }
    return respond(res, { error: 'Acción no válida' }, 400);
  },
  'POST /conta/api/spellcheck.php': async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const action = url.searchParams.get('action');
    const data = await parseBody(req);
    if (action === 'add_word') {
      return respond(res, { message: 'Palabra añadida al diccionario' });
    }
    if (action === 'replace') {
      const { word, replacement, movement_id } = data;
      const target = movement_id ? movements.filter(m => m.id === movement_id) : movements;
      const re = new RegExp(`(?<![\\p{L}\\p{N}])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'giu');
      const applyCase = (orig) => {
        if (orig === orig.toUpperCase()) return replacement.toUpperCase();
        if (orig === orig.charAt(0).toUpperCase() + orig.slice(1).toLowerCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
        }
        return replacement.toLowerCase();
      };
      let updated = 0;
      for (const m of target) {
        const before = m.description;
        m.description = before.replace(re, applyCase);
        if (m.description !== before) updated++;
      }
      return respond(res, { updated });
    }
    return respond(res, { error: 'Acción no válida' }, 400);
  },
};

const server = http.createServer((req, res) => {
  const key = `${req.method} ${req.url.split('?')[0]}`;
  console.log('Request:', key);
  const handler = routes[key];
  if (handler) return handler(req, res);
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found: ' + key);
});

server.listen(PORT, () => console.log(`Mock API server running on http://localhost:${PORT}`));
