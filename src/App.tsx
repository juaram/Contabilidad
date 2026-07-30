import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { InicioView } from './components/InicioView';
import { RegistroView } from './components/RegistroView';
import { AjustesView } from './components/AjustesView';
import { NuevaEntradaModal } from './components/NuevaEntradaModal';
import { NuevaCategoriaModal } from './components/NuevaCategoriaModal';
import { HelpModal } from './components/HelpModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { Category, Movement, MovementType, UserPreferences } from './types';
import * as api from './api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<'inicio' | 'registro' | 'ajustes'>('inicio');
  const [categories, setCategories] = useState<Category[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
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
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'category' | 'subcategory'>('category');
  const [parentCategoryForSub, setParentCategoryForSub] = useState<string>('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    Promise.all([
      api.fetchCategories(),
      api.fetchMovements({ year: '', month: '', page: 1 }),
      api.fetchPreferences(),
    ]).then(([cats, movData, prefs]) => {
      setCategories(cats.map(normalizeCategory));
      setMovements(movData.movements.map(normalizeMovement));
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
    setEntryModalType(type);
    setIsEntryModalOpen(true);
  };

  const handleSaveMovement = async (newMovData: Omit<Movement, 'id'>) => {
    try {
      const catId = parseInt(newMovData.category_id as any) || 0;
      const subId = newMovData.subcategory_id ? parseInt(newMovData.subcategory_id as any) : null;
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
    setIsCategoryModalOpen(true);
  };

  const handleOpenAddSubcategoryModal = (parentCategoryName: string) => {
    setCategoryModalMode('subcategory');
    setParentCategoryForSub(parentCategoryName);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (name: string, code: string, icon: string) => {
    try {
      const saved = await api.createCategory(name, code, icon);
      setCategories((prev) => [...prev, normalizeCategory(saved)]);
      showToast(`✓ Categoría "${name}" creada.`);
    } catch {
      showToast('Error al crear la categoría');
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
    input.accept = '.csv, .json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) showToast('✓ Archivo importado correctamente.');
    };
    input.click();
  };

  const handleBackupData = () => {
    const backup = { categories, movements, preferences, exportDate: new Date().toISOString() };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `Copia_Seguridad_Mis_Cuentas_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('✓ Copia de seguridad guardada.');
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

      <Header activeTab={activeTab} setActiveTab={setActiveTab} onOpenNewEntry={() => handleOpenAddEntryModal('gasto')} appTitle={preferences.appTitle} appSubtitle={preferences.appSubtitle} />

      <main className="pt-24 min-h-screen bg-surface-container-lowest">
        {activeTab === 'inicio' && (
          <InicioView movements={movements} preferences={preferences} onOpenAddModal={handleOpenAddEntryModal} onGoToRegistro={() => setActiveTab('registro')} />
        )}
        {activeTab === 'registro' && (
          <RegistroView movements={movements} categories={categories} preferences={preferences} onOpenAddModal={() => handleOpenAddEntryModal('gasto')} onDeleteMovement={handleDeleteMovement} onExportPDF={() => handleExportData('pdf')} />
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
          }} onOpenAddCategoryModal={handleOpenAddCategoryModal} onOpenAddSubcategoryModal={handleOpenAddSubcategoryModal} onDeleteSubcategory={handleDeleteSubcategory} onExportData={handleExportData} onImportData={handleImportData} onBackupData={handleBackupData} onOpenHelpModal={() => setIsHelpModalOpen(true)} onChangePassword={() => setIsPasswordModalOpen(true)} />
        )}
      </main>

      <NuevaEntradaModal isOpen={isEntryModalOpen} initialType={entryModalType} categories={categories} onClose={() => setIsEntryModalOpen(false)} onSave={handleSaveMovement} />
      <NuevaCategoriaModal isOpen={isCategoryModalOpen} mode={categoryModalMode} parentCategoryName={parentCategoryForSub} onClose={() => setIsCategoryModalOpen(false)} onSaveCategory={handleSaveCategory} onSaveSubcategory={handleSaveSubcategory} />
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      <ChangePasswordModal isOpen={isPasswordModalOpen} username={username} onClose={() => setIsPasswordModalOpen(false)} showToast={showToast} />
    </div>
  );
}

function normalizeCategory(c: any): Category {
  return {
    id: String(c.id),
    code: c.code,
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
    categoryCode: m.category_code || m.cat_code || '',
    category_id: m.category_id ? String(m.category_id) : '',
    subcategory: m.subcategory || m.sub_name || '',
    subcategory_id: m.subcategory_id ? String(m.subcategory_id) : null,
    description: m.description,
    type: m.type,
    amount: m.amount,
  };
}
