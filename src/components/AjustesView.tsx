import React, { useState, useEffect } from 'react';
import { Category, Movement, UserPreferences } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { categoryColorStyle } from '../categoryColors';
import { MantenimientoMovimientos } from './MantenimientoMovimientos';
import { CorreccionOrtografica } from './CorreccionOrtografica';
import { SelectorList } from './SelectorList';

interface AjustesViewProps {
  categories: Category[];
  movements: Movement[];
  preferences: UserPreferences;
  username: string;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onOpenAddCategoryModal: () => void;
  onOpenEditCategoryModal: (category: Category) => void;
  onOpenAddSubcategoryModal: (categoryName: string) => void;
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  onToggleSubcategory: (categoryId: string, subcategoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategories: (orderedIds: string[]) => void;
  onExportData: (type: 'pdf' | 'excel') => void;
  onImportData: () => void;
  onBackupData: () => void;
  onRestoreData: () => void;
  onManageUsers: () => void;
  onOpenHelpModal: () => void;
  onChangePassword: () => void;
  onToast: (msg: string) => void;
  onMaintenanceApplied: () => void;
}

type AjustesTab = 'categorias' | 'mantenimiento' | 'preferencias' | 'seguridad' | 'ayuda';

const TABS: { id: AjustesTab; icon: string; label: string }[] = [
  { id: 'categorias', icon: 'category', label: 'Categorías' },
  { id: 'mantenimiento', icon: 'swap_vert', label: 'Movimientos' },
  { id: 'preferencias', icon: 'settings', label: 'Preferencias Generales' },
  { id: 'seguridad', icon: 'database', label: 'Seguridad y Datos' },
  { id: 'ayuda', icon: 'help', label: 'Info/Ayuda' },
];

export const AjustesView: React.FC<AjustesViewProps> = ({
  categories,
  movements,
  preferences,
  username,
  onUpdatePreferences,
  onOpenAddCategoryModal,
  onOpenEditCategoryModal,
  onOpenAddSubcategoryModal,
  onDeleteSubcategory,
  onToggleSubcategory,
  onDeleteCategory,
  onReorderCategories,
  onExportData,
  onImportData,
  onBackupData,
  onRestoreData,
  onManageUsers,
  onOpenHelpModal,
  onChangePassword,
  onToast,
  onMaintenanceApplied,
}) => {
  const [ajustesTab, setAjustesTab] = useState<AjustesTab>('categorias');
  const [expandedCatIds, setExpandedCatIds] = useState<string[]>(['cat-hogar', 'cat-alimentacion']);
  const [localTitle, setLocalTitle] = useState(preferences.appTitle);
  const [localSubtitle, setLocalSubtitle] = useState(preferences.appSubtitle);
  const [dirty, setDirty] = useState(false);
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    setLocalTitle(preferences.appTitle);
    setLocalSubtitle(preferences.appSubtitle);
    setDirty(false);
  }, [preferences.appTitle, preferences.appSubtitle]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    try {
      e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    } catch {
      /* noop */
    }
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overId !== id) setOverId(id);
  };

  const handleDragLeave = (id: string) => {
    if (overId === id) setOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const fromId = e.dataTransfer.getData('text/plain') || draggedId;
    setDraggedId(null);
    setOverId(null);
    if (!fromId || fromId === targetId) return;
    const fromIdx = localCategories.findIndex((c) => c.id === fromId);
    const toIdx = localCategories.findIndex((c) => c.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const next = [...localCategories];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setLocalCategories(next);
    onReorderCategories(next.map((c) => c.id));
  };

  const handleSaveTextPrefs = () => {
    onUpdatePreferences({ appTitle: localTitle, appSubtitle: localSubtitle });
    setDirty(false);
  };

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCatIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Ajustes sub-tabs */}
      <section className="bg-blue-200 border-b-2 border-primary px-4 md:px-margin-desktop pt-2 pb-2">
        <div className="max-w-275 mx-auto w-full flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAjustesTab(tab.id)}
              className={`flex items-center h-touch-target-min px-4 md:px-6 rounded-lg transition-all font-semibold text-base select-none ${
                ajustesTab === tab.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'border-2 border-primary text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined mr-2 text-[22px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {ajustesTab === 'mantenimiento' ? (
        <section className="px-4 md:px-margin-desktop py-stack-lg">
          <div className="max-w-275 mx-auto w-full flex flex-col gap-6">
            <CorreccionOrtografica movements={movements} onToast={onToast} onApplied={onMaintenanceApplied} />
            <MantenimientoMovimientos categories={categories} onToast={onToast} onApplied={onMaintenanceApplied} />
          </div>
        </section>
      ) : ajustesTab === 'preferencias' ? (
        <section className="px-4 md:px-margin-desktop py-stack-lg">
          <div className="max-w-275 mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-high p-4 md:p-stack-md border-b-2 border-outline-variant flex items-center justify-between">
                <h3 className="font-bold text-xl md:text-2xl text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">settings</span>
                  <span>Preferencias Generales</span>
                </h3>
              </div>

              <div className="p-4 md:p-stack-md flex flex-col gap-6">
                {/* Currency */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-base text-on-surface-variant">Moneda principal</label>
                  <SelectorList
                    value={preferences.currency}
                    onChange={(v) => onUpdatePreferences({ currency: v })}
                    options={[
                      { value: 'Euro (€) - EUR', label: 'Euro (€) - EUR' },
                      { value: 'Dólar ($) - USD', label: 'Dólar ($) - USD' },
                      { value: 'Libra (£) - GBP', label: 'Libra (£) - GBP' },
                    ]}
                    className="w-full h-14 px-4 font-normal text-lg border-2 border-outline rounded-lg bg-surface"
                  />
                </div>

                {/* Date Format */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-base text-on-surface-variant">Formato de Fecha</label>
                  <SelectorList
                    value={preferences.dateFormat}
                    onChange={(v) => onUpdatePreferences({ dateFormat: v })}
                    options={[
                      { value: 'DD / MM / AAAA (31/12/2024)', label: 'DD / MM / AAAA (31/12/2024)' },
                      { value: 'DD de Mes de AAAA', label: 'DD de Mes de AAAA' },
                    ]}
                    className="w-full h-14 px-4 font-normal text-lg border-2 border-outline rounded-lg bg-surface"
                  />
                </div>

                {/* High Contrast Toggle */}
                <div className="flex items-center justify-between py-2 border-t border-outline-variant/60">
                  <div className="flex flex-col">
                    <span className="font-bold text-base text-on-surface">Alto Contraste</span>
                    <span className="font-medium text-sm text-on-surface-variant">Mejora la visibilidad del texto</span>
                  </div>
                  <button
                    onClick={() => onUpdatePreferences({ highContrast: !preferences.highContrast })}
                    className={`w-16 h-8 rounded-full relative transition-colors duration-300 cursor-pointer ${
                      preferences.highContrast ? 'bg-secondary' : 'bg-outline-variant'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                        preferences.highContrast ? 'translate-x-8' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* App Title */}
                <div className="flex flex-col gap-2 border-t border-outline-variant/60 pt-4">
                  <label className="font-semibold text-base text-on-surface-variant">Título de la aplicación</label>
                  <input
                    type="text"
                    value={localTitle}
                    onChange={(e) => { setLocalTitle(e.target.value); setDirty(true); }}
                    className="w-full h-14 px-4 font-normal text-lg border-2 border-outline rounded-lg bg-surface focus:border-primary outline-none"
                  />
                </div>

                {/* App Subtitle */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-base text-on-surface-variant">Subtítulo de la aplicación</label>
                  <input
                    type="text"
                    value={localSubtitle}
                    onChange={(e) => { setLocalSubtitle(e.target.value); setDirty(true); }}
                    className="w-full h-14 px-4 font-normal text-lg border-2 border-outline rounded-lg bg-surface focus:border-primary outline-none"
                  />
                </div>

                {dirty && (
                  <button
                    onClick={handleSaveTextPrefs}
                    className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">save</span>
                    Guardar cambios
                  </button>
                )}
              </div>
            </div>

            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-high p-4 md:p-stack-md border-b-2 border-outline-variant flex items-center justify-between">
                <h3 className="font-bold text-xl md:text-2xl text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">list_alt</span>
                  <span>Preferencias Registro</span>
                </h3>
              </div>

              <div className="p-4 md:p-stack-md flex flex-col gap-6">
                {/* Multi Registro Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-base text-on-surface">Registros múltiples</span>
                    <span className="font-medium text-sm text-on-surface-variant">Permitir añadir varios registros al añadir un ingreso o un gasto</span>
                  </div>
                  <button
                    onClick={() => onUpdatePreferences({ multiRegistro: !preferences.multiRegistro })}
                    className={`w-16 h-8 rounded-full relative transition-colors duration-300 cursor-pointer ${
                      preferences.multiRegistro ? 'bg-secondary' : 'bg-outline-variant'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                        preferences.multiRegistro ? 'translate-x-8' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Registro List Font */}
                <div className="flex flex-col gap-2 border-t border-outline-variant/60 pt-4">
                  <label className="font-semibold text-base text-on-surface-variant">Fuente del listado de Registro</label>
                  <SelectorList
                    value={preferences.listFont}
                    onChange={(v) => onUpdatePreferences({ listFont: v })}
                    options={[
                      { value: 'sans', label: 'Inter (actual)' },
                      { value: 'code', label: 'Camingo Code' },
                    ]}
                    className="w-full h-14 px-4 font-normal text-lg border-2 border-outline rounded-lg bg-surface"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-high p-4 md:p-stack-md border-b-2 border-outline-variant flex items-center justify-between">
                <h3 className="font-bold text-xl md:text-2xl text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">palette</span>
                  <span>Preferencias Desplegables</span>
                </h3>
              </div>

              <div className="p-4 md:p-stack-md flex flex-col gap-6">
                <p className="text-xs font-medium text-on-surface-variant">
                  Configura el aspecto de los desplegables de la aplicación (calendarios, año, mes, categoría, subcategoría, sugerencias de descripción, …).
                </p>

                {/* Preview */}
                <div
                  style={{
                    backgroundColor: preferences.dropdownBg,
                    borderColor: preferences.dropdownBorder,
                    borderWidth: preferences.dropdownBorderWidth,
                    borderRadius: preferences.dropdownRadius,
                    borderStyle: 'solid',
                  }}
                  className="overflow-hidden"
                >
                  {['Opción elegida', 'Otra opción', 'Última opción'].map((opt, idx) => (
                    <div
                      key={opt}
                      className={`px-4 py-2.5 font-medium text-base ${
                        idx === 0
                          ? 'font-bold'
                          : 'hover:bg-black/10'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>

                {/* Colores */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-base text-on-surface-variant">Color de fondo</label>
                    <div className="flex items-center gap-2 h-14 px-3 border-2 border-outline rounded-lg bg-surface">
                      <input
                        type="color"
                        value={preferences.dropdownBg || '#bfdbfe'}
                        onChange={(e) => onUpdatePreferences({ dropdownBg: e.target.value })}
                        className="h-8 w-10 shrink-0 cursor-pointer border-0 bg-transparent p-0"
                      />
                      <span className="text-sm text-on-surface-variant">{preferences.dropdownBg || '#bfdbfe'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-base text-on-surface-variant">Color del borde</label>
                    <div className="flex items-center gap-2 h-14 px-3 border-2 border-outline rounded-lg bg-surface">
                      <input
                        type="color"
                        value={preferences.dropdownBorder || '#93c5fd'}
                        onChange={(e) => onUpdatePreferences({ dropdownBorder: e.target.value })}
                        className="h-8 w-10 shrink-0 cursor-pointer border-0 bg-transparent p-0"
                      />
                      <span className="text-sm text-on-surface-variant">{preferences.dropdownBorder || '#93c5fd'}</span>
                    </div>
                  </div>
                </div>

                {/* Grosor y radio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-base text-on-surface-variant">Grosor del borde</label>
                    <SelectorList
                      value={String(preferences.dropdownBorderWidth ?? 2)}
                      onChange={(v) => onUpdatePreferences({ dropdownBorderWidth: Number(v) })}
                      options={[0, 1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n} px` }))}
                      className="w-full h-14 px-4 font-normal text-lg border-2 border-outline rounded-lg bg-surface"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-base text-on-surface-variant">Radio de las esquinas</label>
                    <SelectorList
                      value={String(preferences.dropdownRadius ?? 12)}
                      onChange={(v) => onUpdatePreferences({ dropdownRadius: Number(v) })}
                      options={[0, 4, 8, 12, 16, 20, 24].map((n) => ({ value: String(n), label: `${n} px` }))}
                      className="w-full h-14 px-4 font-normal text-lg border-2 border-outline rounded-lg bg-surface"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : ajustesTab === 'seguridad' ? (
        <section className="px-4 md:px-margin-desktop py-stack-lg">
          <div className="max-w-275 mx-auto w-full">
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-high p-4 md:p-stack-md border-b-2 border-outline-variant flex items-center justify-between">
                <h3 className="font-bold text-xl md:text-2xl text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">database</span>
                  <span>Seguridad y Datos</span>
                </h3>
              </div>

              <div className="p-4 md:p-stack-md grid grid-cols-1 gap-4">
                <button
                  onClick={onManageUsers}
                  className="flex items-center gap-4 p-4 border-2 border-outline rounded-xl hover:bg-surface-container-low transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[32px]">manage_accounts</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base text-on-surface">Gestión de Usuarios</span>
                    <span className="font-medium text-sm text-on-surface-variant">Crear, editar y eliminar usuarios</span>
                  </div>
                </button>

                <button
                  onClick={onChangePassword}
                  className="flex items-center gap-4 p-4 border-2 border-outline rounded-xl hover:bg-surface-container-low transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[32px]">lock</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base text-on-surface">Cambiar Contraseña</span>
                    <span className="font-medium text-sm text-on-surface-variant">Actualizar la contraseña de acceso</span>
                  </div>
                </button>

                <button
                  onClick={onImportData}
                  className="flex items-center gap-4 p-4 border-2 border-outline rounded-xl hover:bg-surface-container-low transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[32px]">upload_file</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base text-on-surface">Importar Datos</span>
                    <span className="font-medium text-sm text-on-surface-variant">Subir archivo CSV (separador ;)</span>
                  </div>
                </button>

                <button
                  onClick={() => onExportData('excel')}
                  className="flex items-center gap-4 p-4 border-2 border-primary rounded-xl hover:bg-primary/5 transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary text-[32px]">file_download</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base text-primary">Exportar Datos</span>
                    <span className="font-medium text-sm text-on-surface-variant">Descargar CSV (separador ;)</span>
                  </div>
                </button>

                <button
                  onClick={onBackupData}
                  className="flex items-center gap-4 p-4 border-2 border-outline rounded-xl hover:bg-surface-container-low transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[32px]">cloud_upload</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base text-on-surface">Copia de Seguridad</span>
                    <span className="font-medium text-sm text-on-surface-variant">Guardar estado actual</span>
                  </div>
                </button>

                <button
                  onClick={onRestoreData}
                  className="flex items-center gap-4 p-4 border-2 border-outline rounded-xl hover:bg-surface-container-low transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[32px]">settings_backup_restore</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base text-on-surface">Restaurar Copia de Seguridad</span>
                    <span className="font-medium text-sm text-on-surface-variant">Recuperar estado desde un archivo</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : ajustesTab === 'ayuda' ? (
        <section className="px-4 md:px-margin-desktop py-stack-lg">
          <div className="max-w-275 mx-auto w-full">
            <div className="bg-surface-container-low p-stack-md rounded-xl border-2 border-outline-variant flex flex-col items-center gap-4 text-center shadow-sm">
              <div className="flex flex-col">
                <span className="font-bold text-lg text-on-surface">Mis Cuentas v2.4.0</span>
                <span className="font-medium text-sm text-on-surface-variant">Última actualización: Hoy, 09:30</span>
              </div>
              <button
                onClick={onOpenHelpModal}
                className="w-full bg-white border-2 border-primary text-primary font-semibold text-base h-14 flex items-center justify-center gap-2 rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">help</span>
                <span>Centro de Ayuda</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
      {/* Main Settings Grid */}
      <section className="px-4 md:px-margin-desktop py-stack-lg">
        <div className="max-w-275 mx-auto w-full">
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-primary p-4 md:p-stack-md flex items-center justify-between text-on-primary">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-primary text-[28px]">category</span>
                  <h3 className="font-bold text-xl md:text-2xl text-on-primary">
                    Gestión de Categorías
                  </h3>
                </div>
                <button
                  onClick={onOpenAddCategoryModal}
                  className="bg-secondary-container text-on-secondary-container font-semibold text-base px-5 py-2 rounded-full border-2 border-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer"
                >
                  + Nueva
                </button>
              </div>

              {/* Category Items List */}
              <div className="px-4 md:px-stack-md pt-3 flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                <span className="font-medium text-sm">
                  Arrastra las categorías para ordenarlas. Este orden se aplica en presupuestos y desplegables.
                </span>
              </div>
              <div className="flex flex-col divide-y-2 divide-outline-variant">
                {localCategories.map((cat) => {
                  const isExpanded = expandedCatIds.includes(cat.id);
                  const isDragged = draggedId === cat.id;
                  const isOver = overId === cat.id && draggedId !== null && draggedId !== cat.id;

                  return (
                    <div
                      key={cat.id}
                      className="group relative"
                      onDragOver={(e) => handleDragOver(e, cat.id)}
                      onDragLeave={() => handleDragLeave(cat.id)}
                      onDrop={(e) => handleDrop(e, cat.id)}
                    >
                      {isOver && (
                        <div className="absolute left-0 right-0 -top-px h-0.75 bg-primary rounded-full z-10" />
                      )}
                      <div
                        className={`w-full flex items-center justify-between p-4 md:p-stack-md transition-colors ${
                          isDragged
                            ? 'opacity-40 bg-surface-container-low ring-2 ring-primary ring-inset'
                            : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <button
                          onClick={() => toggleCategoryExpand(cat.id)}
                          className="flex items-center gap-4 md:gap-6 text-left flex-1 cursor-pointer"
                        >
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0" style={categoryColorStyle(cat.colorBgClass, cat.colorTextClass)}>
                            <CategoryIcon icon={cat.icon} className="text-[28px] md:text-[32px]" imgClassName="w-7 h-7 md:w-8 md:h-8" />
                          </div>
                          <div>
                            <span className="font-bold text-xl md:text-2xl text-on-surface">
                              {cat.name}
                            </span>
                            <p className="font-medium text-sm text-on-surface-variant">
                              {cat.subcategories.filter((s) => s.active !== false).length} subcategorías activas
                            </p>
                          </div>
                        </button>
                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            draggable
                            onDragStart={(e) => handleDragStart(e, cat.id)}
                            onDragEnd={() => { setDraggedId(null); setOverId(null); }}
                            title="Arrastrar para ordenar"
                            className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high cursor-grab active:cursor-grabbing select-none"
                          >
                            <span className="material-symbols-outlined text-[22px]">drag_indicator</span>
                          </span>
                          <button
                            onClick={() => onOpenEditCategoryModal(cat)}
                            title="Editar categoría"
                            className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[24px]">edit</span>
                          </button>
                          <button
                            onClick={() => onDeleteCategory(cat.id)}
                            title="Eliminar categoría"
                            className="p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[24px]">delete</span>
                          </button>
                          <button
                            onClick={() => toggleCategoryExpand(cat.id)}
                            title={isExpanded ? 'Contraer categoría' : 'Desplegar categoría'}
                            className="p-1 rounded-full text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                          >
                            <span
                              className={`material-symbols-outlined text-[32px] transition-transform duration-300 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            >
                              expand_more
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Expanded Subcategory List */}
                      {isExpanded && (
                        <div className="bg-surface-container-lowest px-6 md:px-16 pb-stack-md flex flex-col gap-2 border-t border-outline-variant/40 pt-3">
                          {cat.subcategories.length === 0 ? (
                            <p className="text-sm text-on-surface-variant py-2 italic">Sin subcategorías.</p>
                          ) : (
                            cat.subcategories.map((sub) => {
                              const isActive = sub.active !== false;
                              return (
                                <div
                                  key={sub.id}
                                  className={`flex items-center justify-between py-3 border-b border-outline-variant/60 ${isActive ? '' : 'opacity-50'}`}
                                >
                                  <div className="flex flex-col min-w-0">
                                    <span className={`font-medium text-lg ${isActive ? 'text-on-surface' : 'text-on-surface-variant line-through decoration-outline'}`}>{sub.name}</span>
                                    <span className="text-xs font-medium text-on-surface-variant">
                                      {isActive ? 'Activa' : 'Desactivada'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <button
                                      onClick={() => onToggleSubcategory(cat.id, sub.id)}
                                      title={isActive ? 'Desactivar subcategoría' : 'Activar subcategoría'}
                                      aria-pressed={isActive}
                                      className={`w-14 h-7 rounded-full relative transition-colors duration-300 cursor-pointer ${
                                        isActive ? 'bg-secondary' : 'bg-outline-variant'
                                      }`}
                                    >
                                      <div
                                        className={`absolute top-0.5 left-0.5 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                                          isActive ? 'translate-x-7' : 'translate-x-0'
                                        }`}
                                      />
                                    </button>
                                    <button
                                      onClick={() => onDeleteSubcategory(cat.id, sub.id)}
                                      title="Eliminar subcategoría"
                                      className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                                    >
                                      <span className="material-symbols-outlined text-[20px]">close</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}

                          <button
                            onClick={() => onOpenAddSubcategoryModal(cat.name)}
                            className="mt-3 text-primary font-semibold text-base flex items-center gap-2 hover:underline cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                            <span>Añadir subcategoría</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
};
