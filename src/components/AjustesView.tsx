import React, { useState, useEffect } from 'react';
import { Category, UserPreferences } from '../types';

interface AjustesViewProps {
  categories: Category[];
  preferences: UserPreferences;
  username: string;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onOpenAddCategoryModal: () => void;
  onOpenAddSubcategoryModal: (categoryName: string) => void;
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  onExportData: (type: 'pdf' | 'excel') => void;
  onImportData: () => void;
  onBackupData: () => void;
  onOpenHelpModal: () => void;
  onChangePassword: () => void;
}

export const AjustesView: React.FC<AjustesViewProps> = ({
  categories,
  preferences,
  username,
  onUpdatePreferences,
  onOpenAddCategoryModal,
  onOpenAddSubcategoryModal,
  onDeleteSubcategory,
  onExportData,
  onImportData,
  onBackupData,
  onOpenHelpModal,
  onChangePassword,
}) => {
  const [expandedCatIds, setExpandedCatIds] = useState<string[]>(['cat-hogar', 'cat-alimentacion']);
  const [localTitle, setLocalTitle] = useState(preferences.appTitle);
  const [localSubtitle, setLocalSubtitle] = useState(preferences.appSubtitle);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setLocalTitle(preferences.appTitle);
    setLocalSubtitle(preferences.appSubtitle);
    setDirty(false);
  }, [preferences.appTitle, preferences.appSubtitle]);

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


      {/* Main Settings Grid */}
      <section className="px-4 md:px-margin-desktop py-stack-lg">
        <div className="max-w-[1100px] mx-auto w-full grid grid-cols-12 gap-6">
          {/* LEFT COLUMN: Categories Management */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
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
              <div className="flex flex-col divide-y-2 divide-outline-variant">
                {categories.map((cat) => {
                  const isExpanded = expandedCatIds.includes(cat.id);

                  return (
                    <div key={cat.id} className="group">
                      <button
                        onClick={() => toggleCategoryExpand(cat.id)}
                        className="w-full flex items-center justify-between p-4 md:p-stack-md hover:bg-surface-container-low transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-4 md:gap-6">
                          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${cat.colorBgClass} ${cat.colorTextClass} flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined text-[28px] md:text-[32px]">{cat.icon}</span>
                          </div>
                          <div>
                            <span className="font-bold text-xl md:text-2xl text-on-surface">
                              {cat.name}
                            </span>
                            <p className="font-medium text-sm text-on-surface-variant">
                              {cat.subcategories.length} subcategorías activas
                            </p>
                          </div>
                        </div>
                        <span
                          className={`material-symbols-outlined text-primary text-[32px] transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>

                      {/* Expanded Subcategory List */}
                      {isExpanded && (
                        <div className="bg-surface-container-lowest px-6 md:px-16 pb-stack-md flex flex-col gap-2 border-t border-outline-variant/40 pt-3">
                          {cat.subcategories.length === 0 ? (
                            <p className="text-sm text-on-surface-variant py-2 italic">Sin subcategorías.</p>
                          ) : (
                            cat.subcategories.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center justify-between py-3 border-b border-outline-variant/60"
                              >
                                <span className="font-medium text-lg text-on-surface">{sub.name}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => onDeleteSubcategory(cat.id, sub.id)}
                                    title="Eliminar subcategoría"
                                    className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                  </button>
                                </div>
                              </div>
                            ))
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

          {/* RIGHT COLUMN: Preferences, Security & Help */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            {/* General Preferences */}
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-high p-4 md:p-stack-md border-b-2 border-outline-variant">
                <h3 className="font-bold text-xl md:text-2xl text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">settings</span>
                  <span>Preferencias Generales</span>
                </h3>
              </div>

              <div className="p-4 md:p-stack-md flex flex-col gap-6">
                {/* Currency */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-base text-on-surface-variant">Moneda principal</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => onUpdatePreferences({ currency: e.target.value })}
                    className="w-full h-14 px-4 font-normal text-lg border-2 border-outline rounded-lg bg-surface focus:border-primary outline-none cursor-pointer"
                  >
                    <option>Euro (€) - EUR</option>
                    <option>Dólar ($) - USD</option>
                    <option>Libra (£) - GBP</option>
                  </select>
                </div>

                {/* Date Format */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-base text-on-surface-variant">Formato de Fecha</label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) => onUpdatePreferences({ dateFormat: e.target.value })}
                    className="w-full h-14 px-4 font-normal text-lg border-2 border-outline rounded-lg bg-surface focus:border-primary outline-none cursor-pointer"
                  >
                    <option>DD / MM / AAAA (31/12/2024)</option>
                    <option>DD de Mes de AAAA</option>
                  </select>
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

            {/* Security & Data */}
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-high p-4 md:p-stack-md border-b-2 border-outline-variant">
                <h3 className="font-bold text-xl md:text-2xl text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">database</span>
                  <span>Seguridad y Datos</span>
                </h3>
              </div>

              <div className="p-4 md:p-stack-md grid grid-cols-1 gap-4">
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
              </div>
            </div>

            {/* App Info & Help */}
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
        </div>
      </section>
    </div>
  );
};
