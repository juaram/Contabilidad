import React, { useState } from 'react';
import { Category } from '../types';
import { runMaintenance, MaintenancePreviewItem } from '../api';

interface MantenimientoMovimientosProps {
  categories: Category[];
  onToast: (msg: string) => void;
  onApplied: () => void;
}

const inputClass =
  'w-full h-14 px-4 font-normal text-lg border-2 border-outline rounded-lg bg-surface focus:border-primary outline-none';

export const MantenimientoMovimientos: React.FC<MantenimientoMovimientosProps> = ({ categories, onToast, onApplied }) => {
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterSubcategoryId, setFilterSubcategoryId] = useState('');
  const [filterDescription, setFilterDescription] = useState('');
  const [finalCategoryId, setFinalCategoryId] = useState('');
  const [finalSubcategory, setFinalSubcategory] = useState('');
  const [finalDescription, setFinalDescription] = useState('');
  const [preview, setPreview] = useState<MaintenancePreviewItem[] | null>(null);
  const [previewCount, setPreviewCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const filterCategory = categories.find((c) => c.id === filterCategoryId) || null;
  const finalCategory = categories.find((c) => c.id === finalCategoryId) || null;

  const formComplete =
    filterCategoryId !== '' &&
    filterSubcategoryId !== '' &&
    finalCategoryId !== '' &&
    finalSubcategory.trim() !== '';

  const resetPreview = () => {
    setPreview(null);
    setPreviewCount(0);
    setApplied(false);
  };

  const handlePreview = async () => {
    if (!formComplete || !filterCategory || !finalCategory) return;
    setLoading(true);
    setApplied(false);
    try {
      const res = await runMaintenance({
        filter_category: filterCategory.name,
        filter_subcategory: filterCategory.subcategories.find((s) => s.id === filterSubcategoryId)?.name || '',
        filter_description: filterDescription,
        final_category: finalCategory.name,
        final_subcategory: finalSubcategory.trim(),
        final_description: finalDescription,
      }, true);
      setPreview(res.movements || []);
      setPreviewCount(res.total || 0);
    } catch (e: any) {
      onToast(e.message || 'Error al previsualizar');
      setPreview(null);
      setPreviewCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!formComplete || !filterCategory || !finalCategory) return;
    setLoading(true);
    try {
      const res = await runMaintenance({
        filter_category: filterCategory.name,
        filter_subcategory: filterCategory.subcategories.find((s) => s.id === filterSubcategoryId)?.name || '',
        filter_description: filterDescription,
        final_category: finalCategory.name,
        final_subcategory: finalSubcategory.trim(),
        final_description: finalDescription,
      }, false);
      const created = res.created_subcategories && res.created_subcategories.length > 0
        ? ` · Se creó la subcategoría "${res.created_subcategories[0]}"`
        : '';
      onToast(`✓ ${res.updated ?? 0} movimientos actualizados.${created}`);
      setPreview(null);
      setPreviewCount(0);
      setApplied(true);
      onApplied();
    } catch (e: any) {
      onToast(e.message || 'Error al aplicar los cambios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="bg-primary p-4 md:p-stack-md flex items-center gap-3 text-on-primary">
        <span className="material-symbols-outlined text-on-primary text-[28px]">swap_vert</span>
        <h3 className="font-bold text-xl md:text-2xl text-on-primary">Mantenimiento de Movimientos</h3>
      </div>

      <div className="p-4 md:p-stack-md flex flex-col gap-6">
        <p className="text-sm md:text-base text-on-surface-variant font-medium">
          Selecciona los movimientos a reasignar y los datos finales a aplicar. El filtro de descripción es
          opcional: si se indica, se buscan subcadenas entre <code className="font-mono bg-surface-container-high px-1 rounded">*texto*</code>,
          separando varias alternativas con <code className="font-mono bg-surface-container-high px-1 rounded">OR</code> (p. ej. <code className="font-mono bg-surface-container-high px-1 rounded">*luz* OR *repsol*</code>).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Initial filters */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <span className="font-bold text-lg text-on-surface">Movimientos actuales</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-base text-on-surface-variant">Categoría inicial</label>
              <select
                value={filterCategoryId}
                onChange={(e) => { setFilterCategoryId(e.target.value); setFilterSubcategoryId(''); resetPreview(); }}
                className={inputClass}
              >
                <option value="">Selecciona categoría</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-base text-on-surface-variant">Subcategoría inicial</label>
              <select
                value={filterSubcategoryId}
                onChange={(e) => { setFilterSubcategoryId(e.target.value); resetPreview(); }}
                disabled={!filterCategory}
                className={inputClass}
              >
                <option value="">Selecciona subcategoría</option>
                {filterCategory?.subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-base text-on-surface-variant">
                Descripción (filtro) <span className="font-normal">— opcional</span>
              </label>
              <input
                type="text"
                value={filterDescription}
                onChange={(e) => { setFilterDescription(e.target.value); resetPreview(); }}
                placeholder='*luz* OR *repsol*'
                className={inputClass}
              />
            </div>
          </div>

          {/* Final data */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              <span className="font-bold text-lg text-on-surface">Datos finales</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-base text-on-surface-variant">Categoría final</label>
              <select
                value={finalCategoryId}
                onChange={(e) => { setFinalCategoryId(e.target.value); setFinalSubcategory(''); resetPreview(); }}
                className={inputClass}
              >
                <option value="">Selecciona categoría</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-base text-on-surface-variant">Subcategoría final</label>
              <input
                type="text"
                list="final-subcategories"
                value={finalSubcategory}
                onChange={(e) => { setFinalSubcategory(e.target.value); resetPreview(); }}
                placeholder="Nombre o elige una existente"
                className={inputClass}
              />
              <datalist id="final-subcategories">
                {finalCategory?.subcategories.map((s) => <option key={s.id} value={s.name} />)}
              </datalist>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-base text-on-surface-variant">
                Descripción final <span className="font-normal">— opcional, admite <code className="font-mono">#mes</code></span>
              </label>
              <input
                type="text"
                value={finalDescription}
                onChange={(e) => { setFinalDescription(e.target.value); resetPreview(); }}
                placeholder="Nueva descripción"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handlePreview}
            disabled={!formComplete || loading}
            className="flex-1 h-14 bg-secondary-container text-on-secondary-container font-bold rounded-xl border-2 border-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">visibility</span>
            Previsualizar
          </button>
          <button
            onClick={handleApply}
            disabled={!formComplete || loading || preview === null || applied}
            className="flex-1 h-14 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">save</span>
            Aplicar cambios
          </button>
        </div>

        {/* Preview result */}
        {loading && (
          <div className="flex items-center gap-3 text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-primary animate-spin">sync</span>
            Procesando...
          </div>
        )}

        {!loading && preview !== null && (
          <div className="border-2 border-outline-variant rounded-xl overflow-hidden">
            <div className={`p-4 font-bold text-lg flex items-center gap-2 ${previewCount === 0 ? 'bg-surface-container-high text-on-surface' : 'bg-primary text-on-primary'}`}>
              <span className="material-symbols-outlined">{previewCount === 0 ? 'info' : 'list'}</span>
              {previewCount === 0
                ? 'No se encontraron movimientos con estos filtros'
                : `${previewCount} movimiento${previewCount === 1 ? '' : 's'} seleccionado${previewCount === 1 ? '' : 's'}`}
            </div>
            {preview.length > 0 && (
              <div className="max-h-64 overflow-y-auto divide-y divide-outline-variant">
                {preview.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-on-surface truncate">{m.description}</span>
                      <span className="text-sm text-on-surface-variant">
                        {m.date} · {m.category} / {m.subcategory}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`font-bold ${m.type === 'ingreso' ? 'text-secondary' : 'text-error'}`}>
                        {m.type === 'ingreso' ? '+' : '−'}{m.amount.toFixed(2)}
                      </span>
                      <span className="material-symbols-outlined text-on-surface-variant">arrow_forward</span>
                      <span className="font-bold text-primary">{finalCategory?.name} / {finalSubcategory || '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
