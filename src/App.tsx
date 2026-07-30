import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InicioView } from './components/InicioView';
import { RegistroView } from './components/RegistroView';
import { AjustesView } from './components/AjustesView';
import { NuevaEntradaModal } from './components/NuevaEntradaModal';
import { NuevaCategoriaModal } from './components/NuevaCategoriaModal';
import { HelpModal } from './components/HelpModal';
import { Category, Movement, MovementType, UserPreferences } from './types';
import { INITIAL_CATEGORIES, INITIAL_MOVEMENTS, INITIAL_PREFERENCES } from './data/initialData';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'inicio' | 'registro' | 'ajustes'>('inicio');

  // App State with localStorage persistence
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('mc_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [movements, setMovements] = useState<Movement[]>(() => {
    const saved = localStorage.getItem('mc_movements');
    return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('mc_preferences');
    return saved ? JSON.parse(saved) : INITIAL_PREFERENCES;
  });

  // Modal States
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [entryModalType, setEntryModalType] = useState<MovementType>('gasto');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'category' | 'subcategory'>('category');
  const [parentCategoryForSub, setParentCategoryForSub] = useState<string>('');

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mc_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mc_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('mc_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Toast auto-clear
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers for Movements
  const handleOpenAddEntryModal = (type: MovementType = 'gasto') => {
    setEntryModalType(type);
    setIsEntryModalOpen(true);
  };

  const handleSaveMovement = (newMovData: Omit<Movement, 'id'>) => {
    const newMov: Movement = {
      ...newMovData,
      id: `mov-${Date.now()}`,
    };
    setMovements((prev) => [newMov, ...prev]);
    showToast(`✓ ${newMovData.type === 'ingreso' ? 'Ingreso' : 'Gasto'} registrado correctamente.`);
  };

  const handleDeleteMovement = (id: string) => {
    setMovements((prev) => prev.filter((m) => m.id !== id));
    showToast('✓ Movimiento eliminado.');
  };

  // Handlers for Categories
  const handleOpenAddCategoryModal = () => {
    setCategoryModalMode('category');
    setIsCategoryModalOpen(true);
  };

  const handleOpenAddSubcategoryModal = (parentCategoryName: string) => {
    setCategoryModalMode('subcategory');
    setParentCategoryForSub(parentCategoryName);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (name: string, code: string, icon: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      code,
      name,
      icon,
      colorBgClass: 'bg-primary-fixed',
      colorTextClass: 'text-on-primary-fixed',
      subcategories: [],
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`✓ Categoría "${name}" creada.`);
  };

  const handleSaveSubcategory = (parentName: string, subName: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.name === parentName) {
          return {
            ...cat,
            subcategories: [
              ...cat.subcategories,
              { id: `sub-${Date.now()}`, name: subName },
            ],
          };
        }
        return cat;
      })
    );
    showToast(`✓ Subcategoría "${subName}" añadida a ${parentName}.`);
  };

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter((s) => s.id !== subcategoryId),
          };
        }
        return cat;
      })
    );
    showToast('✓ Subcategoría eliminada.');
  };

  // Export / Import / Backup
  const handleExportData = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      window.print();
    } else {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        ['Fecha,Categoría,Subcategoría,Descripción,Tipo,Importe']
          .concat(
            movements.map(
              (m) =>
                `"${m.date}","${m.category}","${m.subcategory}","${m.description}","${m.type}","${m.amount}"`
            )
          )
          .join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Mis_Cuentas_Movimientos_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('✓ Archivo CSV exportado con éxito.');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv, .json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        showToast('✓ Archivo importado correctamente.');
      }
    };
    input.click();
  };

  const handleBackupData = () => {
    const backup = {
      categories,
      movements,
      preferences,
      exportDate: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Copia_Seguridad_Mis_Cuentas_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('✓ Copia de seguridad guardada.');
  };

  return (
    <div className={`min-h-screen bg-background font-sans text-on-background antialiased ${
      preferences.highContrast ? 'high-contrast' : ''
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-primary text-white font-semibold text-base px-6 py-4 rounded-xl shadow-2xl border-2 border-white/20 flex items-center gap-3 animate-slide-up">
          <span className="material-symbols-outlined text-secondary-container">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewEntry={() => handleOpenAddEntryModal('gasto')}
      />

      {/* Main View Router */}
      <main className="pt-24 min-h-screen bg-surface-container-lowest">
        {activeTab === 'inicio' && (
          <InicioView
            movements={movements}
            preferences={preferences}
            onOpenAddModal={handleOpenAddEntryModal}
            onGoToRegistro={() => setActiveTab('registro')}
          />
        )}

        {activeTab === 'registro' && (
          <RegistroView
            movements={movements}
            categories={categories}
            preferences={preferences}
            onOpenAddModal={() => handleOpenAddEntryModal('gasto')}
            onDeleteMovement={handleDeleteMovement}
            onExportPDF={() => handleExportData('pdf')}
          />
        )}

        {activeTab === 'ajustes' && (
          <AjustesView
            categories={categories}
            preferences={preferences}
            onUpdatePreferences={(updated) => setPreferences((prev) => ({ ...prev, ...updated }))}
            onOpenAddCategoryModal={handleOpenAddCategoryModal}
            onOpenAddSubcategoryModal={handleOpenAddSubcategoryModal}
            onDeleteSubcategory={handleDeleteSubcategory}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onBackupData={handleBackupData}
            onOpenHelpModal={() => setIsHelpModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <NuevaEntradaModal
        isOpen={isEntryModalOpen}
        initialType={entryModalType}
        categories={categories}
        onClose={() => setIsEntryModalOpen(false)}
        onSave={handleSaveMovement}
      />

      <NuevaCategoriaModal
        isOpen={isCategoryModalOpen}
        mode={categoryModalMode}
        parentCategoryName={parentCategoryForSub}
        onClose={() => setIsCategoryModalOpen(false)}
        onSaveCategory={handleSaveCategory}
        onSaveSubcategory={handleSaveSubcategory}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
