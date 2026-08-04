import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { InicioView } from './components/InicioView';
import { RegistroView } from './components/RegistroView';
import { PresupuestoView } from './components/PresupuestoView';
import { AjustesView } from './components/AjustesView';
import { NuevaEntradaModal } from './components/NuevaEntradaModal';
import { NuevaCategoriaModal } from './components/NuevaCategoriaModal';
import { HelpModal } from './components/HelpModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { UsersManagementModal } from './components/UsersManagementModal';
import { ImportacionErroresModal, InvalidRecord } from './components/ImportacionErroresModal';
import { Budget, Category, Movement, MovementType, UserPreferences } from './types';
import * as api from './api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<'inicio' | 'registro' | 'presupuestos' | 'ajustes'>('inicio');
  const [categories, setCategories] = useState<Category[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    currency: 'Euro (€) - EUR',
    dateFormat: 'DD / MM / AAAA (31/12/2024)',
    highContrast: false,
    appTitle: 'Mis Cuentas',
    appSubtitle: 'Control Financiero',
  });
  const [loading, setLoading] = useState(true);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [entryModalType, setEntryModalType] = useState<MovementType>('gasto');
  const [editingMovement, setEditingMovement] = useState<Movement | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'category' | 'subcategory'>('category');
  const [parentCategoryForSub, setParentCategoryForSub] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [importErrors, setImportErrors] = useState<InvalidRecord[]>([]);

  useEffect(() => {
    Promise.all([
      api.fetchCategories(),
      api.fetchMovements({ year: '', month: '' }),
      api.fetchPreferences(),
      api.fetchBudgets(),
    ]).then(([cats, movData, prefs, budgetData]) => {
      setCategories(cats.map(normalizeCategory));
      setMovements(movData.movements.map(normalizeMovement));
      setBudgets(budgetData.map(normalizeBudget));
      setPreferences({
        currency: prefs.currency,
        dateFormat: prefs.date_format,
        highContrast: prefs.high_contrast,
        appTitle: prefs.app_title || 'Mis Cuentas',
        appSubtitle: prefs.app_subtitle || 'Control Financiero',
      });
    }).catch(() => {
      showToast('Error al cargar los datos del servidor');
    }).finally(() => setLoading(false));
  }, [refreshKey]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddEntryModal = (type: MovementType = 'gasto') => {
    setEditingMovement(null);
    setEntryModalType(type);
    setIsEntryModalOpen(true);
  };

  const handleOpenEditEntryModal = (movement: Movement) => {
    setEditingMovement(movement);
    setEntryModalType(movement.type);
    setIsEntryModalOpen(true);
  };

  const handleSaveMovement = async (newMovData: Omit<Movement, 'id'>) => {
    try {
      const catId = parseInt(newMovData.category_id as any) || 0;
      const subId = newMovData.subcategory_id ? parseInt(newMovData.subcategory_id as any) : null;
      if (editingMovement) {
        const saved = await api.updateMovement(parseInt(editingMovement.id), {
          date: newMovData.date,
          category_id: catId,
          subcategory_id: subId,
          description: newMovData.description,
          type: newMovData.type,
          amount: newMovData.amount,
        });
        setMovements((prev) => prev.map((m) => (m.id === editingMovement.id ? normalizeMovement(saved) : m)));
        showToast(`✓ ${newMovData.type === 'ingreso' ? 'Ingreso' : 'Gasto'} actualizado correctamente.`);
      } else {
        const saved = await api.createMovement({
          date: newMovData.date,
          category_id: catId,
          subcategory_id: subId,
          description: newMovData.description,
          type: newMovData.type,
          amount: newMovData.amount,
        });
        setMovements((prev) => [normalizeMovement(saved), ...prev]);
        showToast(`✓ ${newMovData.type === 'ingreso' ? 'Ingreso' : 'Gasto'} registrado correctamente.`);
      }
      setEditingMovement(null);
      setIsEntryModalOpen(false);
    } catch {
      showToast('Error al guardar el movimiento');
    }
  };

  const handleDeleteMovement = async (id: string) => {
    try {
      await api.deleteMovement(parseInt(id));
      setMovements((prev) => prev.filter((m) => m.id !== id));
      showToast('✓ Movimiento eliminado.');
    } catch {
      showToast('Error al eliminar el movimiento');
    }
  };

  const handleOpenAddCategoryModal = () => {
    setCategoryModalMode('category');
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (category: Category) => {
    setCategoryModalMode('category');
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleOpenAddSubcategoryModal = (parentCategoryName: string) => {
    setCategoryModalMode('subcategory');
    setParentCategoryForSub(parentCategoryName);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (name: string, icon: string, colorBgClass: string, colorTextClass: string) => {
    try {
      if (editingCategory) {
        const saved = await api.updateCategory(parseInt(editingCategory.id), {
          name,
          icon,
          color_bg: colorBgClass,
          color_text: colorTextClass,
        });
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? { ...normalizeCategory(saved), subcategories: c.subcategories }
              : c
          )
        );
        showToast(`✓ Categoría "${name}" actualizada.`);
      } else {
        const saved = await api.createCategory(name, icon, colorBgClass, colorTextClass);
        setCategories((prev) => [...prev, normalizeCategory(saved)]);
        showToast(`✓ Categoría "${name}" creada.`);
      }
      setEditingCategory(null);
    } catch {
      showToast('Error al guardar la categoría');
    }
  };

  const handleSaveSubcategory = async (parentName: string, subName: string) => {
    try {
      const parent = categories.find((c) => c.name === parentName);
      if (!parent) { showToast('Error: categoría no encontrada'); return; }
      const saved = await api.createSubcategory(parseInt(parent.id), subName);
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === parent.id) {
            return { ...cat, subcategories: [...cat.subcategories, { id: String(saved.id), name: saved.name }] };
          }
          return cat;
        })
      );
      showToast(`✓ Subcategoría "${subName}" añadida a ${parentName}.`);
    } catch {
      showToast('Error al crear la subcategoría');
    }
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    try {
      await api.deleteSubcategory(parseInt(subcategoryId));
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === categoryId) {
            return { ...cat, subcategories: cat.subcategories.filter((s) => s.id !== subcategoryId) };
          }
          return cat;
        })
      );
      showToast('✓ Subcategoría eliminada.');
    } catch {
      showToast('Error al eliminar la subcategoría');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const saved = await api.deleteCategory(parseInt(categoryId));
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      showToast('✓ Categoría eliminada.');
    } catch {
      showToast('Error al eliminar la categoría');
    }
  };

  const handleSaveBudget = async (data: {
    id?: string;
    category_id: string;
    subcategory_id: string | null;
    type: MovementType;
    year: number;
    month: string;
    amount: number;
  }) => {
    try {
      const payload = {
        category_id: parseInt(data.category_id),
        subcategory_id: data.subcategory_id ? parseInt(data.subcategory_id) : null,
        type: data.type,
        year: data.year,
        month: data.month,
        amount: data.amount,
      };
      if (data.id) {
        const saved = await api.updateBudget(parseInt(data.id), payload);
        setBudgets((prev) => prev.map((b) => (b.id === data.id ? normalizeBudget(saved) : b)));
        showToast('✓ Presupuesto actualizado correctamente.');
      } else {
        const saved = await api.createBudget(payload);
        setBudgets((prev) => [...prev, normalizeBudget(saved)]);
        showToast('✓ Presupuesto creado correctamente.');
      }
    } catch {
      showToast('Error al guardar el presupuesto');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await api.deleteBudget(parseInt(id));
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      showToast('✓ Presupuesto eliminado.');
    } catch {
      showToast('Error al eliminar el presupuesto');
    }
  };

  const handleExportData = async (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      window.print();
    } else {
      window.open('/conta/api/export.php?format=csv', '_blank');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/conta/api/import.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`✓ ${data.message}`);
          setRefreshKey((k) => k + 1);
        } else if (data.invalid_records && data.invalid_records.length > 0) {
          setImportErrors(data.invalid_records);
        } else {
          showToast(data.error || data.message || 'Error al importar');
        }
      } catch {
        showToast('Error de conexión al importar');
      }
    };
    input.click();
  };

  const handleBackupData = () => {
    const backup = { categories, movements, budgets, preferences, exportDate: new Date().toISOString() };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `Copia_Seguridad_Mis_Cuentas_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('✓ Copia de seguridad guardada.');
  };

  const handleRestoreData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const backup = JSON.parse(await file.text());
        const res = await fetch('/conta/api/restore.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categories: backup.categories,
            movements: backup.movements,
            preferences: backup.preferences,
          }),
        });
        const data = await res.json();
        if (res.ok && data.message) {
          showToast(`✓ ${data.message}`);
          setRefreshKey((k) => k + 1);
        } else {
          showToast(data.error || 'Error al restaurar la copia de seguridad');
        }
      } catch {
        showToast('El archivo de copia de seguridad no es válido');
      }
    };
    input.click();
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={(u) => { setUsername(u); setIsAuthenticated(true); }} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-sans text-on-background antialiased flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
          <p className="mt-4 text-lg text-outline">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background font-sans text-on-background antialiased ${preferences.highContrast ? 'high-contrast' : ''}`}>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-primary text-white font-semibold text-base px-6 py-4 rounded-xl shadow-2xl border-2 border-white/20 flex items-center gap-3 animate-slide-up">
          <span className="material-symbols-outlined text-secondary-container">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <Header activeTab={activeTab} setActiveTab={setActiveTab} onOpenNewEntry={() => handleOpenAddEntryModal('gasto')} appTitle={preferences.appTitle} appSubtitle={preferences.appSubtitle} username={username} />

      <main className="pt-24 min-h-screen bg-surface-container-lowest">
        {activeTab === 'inicio' && (
          <InicioView movements={movements} budgets={budgets} preferences={preferences} onOpenAddModal={handleOpenAddEntryModal} onGoToRegistro={() => setActiveTab('registro')} />
        )}
        {activeTab === 'registro' && (
          <RegistroView movements={movements} categories={categories} budgets={budgets} preferences={preferences} onEditMovement={handleOpenEditEntryModal} onDeleteMovement={handleDeleteMovement} />
        )}
        {activeTab === 'presupuestos' && (
          <PresupuestoView budgets={budgets} categories={categories} movements={movements} preferences={preferences} onSaveBudget={handleSaveBudget} onDeleteBudget={handleDeleteBudget} />
        )}
        {activeTab === 'ajustes' && (
          <AjustesView categories={categories} preferences={preferences} username={username} onUpdatePreferences={(updated) => {
            const newPrefs = { ...preferences, ...updated };
            setPreferences(newPrefs);
            api.updatePreferences({
              currency: newPrefs.currency,
              date_format: newPrefs.dateFormat,
              high_contrast: newPrefs.highContrast,
              app_title: newPrefs.appTitle,
              app_subtitle: newPrefs.appSubtitle,
            }).catch(() => showToast('Error al guardar preferencias'));
          }} onOpenAddCategoryModal={handleOpenAddCategoryModal} onOpenEditCategoryModal={handleOpenEditCategoryModal} onOpenAddSubcategoryModal={handleOpenAddSubcategoryModal} onDeleteSubcategory={handleDeleteSubcategory} onDeleteCategory={handleDeleteCategory} onExportData={handleExportData} onImportData={handleImportData} onBackupData={handleBackupData} onRestoreData={handleRestoreData} onManageUsers={() => setIsUsersModalOpen(true)} onOpenHelpModal={() => setIsHelpModalOpen(true)} onChangePassword={() => setIsPasswordModalOpen(true)} onToast={showToast} onMaintenanceApplied={() => setRefreshKey((k) => k + 1)} />
        )}
      </main>

      <NuevaEntradaModal isOpen={isEntryModalOpen} initialType={entryModalType} categories={categories} editingMovement={editingMovement} onClose={() => { setEditingMovement(null); setIsEntryModalOpen(false); }} onSave={handleSaveMovement} />
      <NuevaCategoriaModal isOpen={isCategoryModalOpen} mode={categoryModalMode} parentCategoryName={parentCategoryForSub} editingCategory={editingCategory} onClose={() => { setEditingCategory(null); setIsCategoryModalOpen(false); }} onSaveCategory={handleSaveCategory} onSaveSubcategory={handleSaveSubcategory} />
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      <ImportacionErroresModal isOpen={importErrors.length > 0} records={importErrors} onClose={() => setImportErrors([])} />
      <ChangePasswordModal isOpen={isPasswordModalOpen} username={username} onClose={() => setIsPasswordModalOpen(false)} showToast={showToast} />
      <UsersManagementModal isOpen={isUsersModalOpen} currentUsername={username} onClose={() => setIsUsersModalOpen(false)} showToast={showToast} />
    </div>
  );
}

function normalizeCategory(c: any): Category {
  return {
    id: String(c.id),
    name: c.name,
    icon: c.icon,
    colorBgClass: c.color_bg || c.colorBgClass || 'bg-primary-fixed',
    colorTextClass: c.color_text || c.colorTextClass || 'text-on-primary-fixed',
    subcategories: (c.subcategories || []).map((s: any) => ({
      id: String(s.id),
      name: s.name,
    })),
  };
}

function normalizeMovement(m: any): Movement {
  return {
    id: String(m.id),
    date: m.date,
    category: m.category || m.cat_name || '',
    category_id: m.category_id ? String(m.category_id) : '',
    subcategory: m.subcategory || m.sub_name || '',
    subcategory_id: m.subcategory_id ? String(m.subcategory_id) : null,
    description: m.description,
    type: m.type,
    amount: m.amount,
  };
}

function normalizeBudget(b: any): Budget {
  return {
    id: String(b.id),
    category_id: b.category_id !== undefined ? String(b.category_id) : '',
    subcategory_id: b.subcategory_id ? String(b.subcategory_id) : null,
    type: b.type === 'ingreso' ? 'ingreso' : 'gasto',
    year: Number(b.year),
    month: String(b.month || '00'),
    amount: Number(b.amount),
  };
}
