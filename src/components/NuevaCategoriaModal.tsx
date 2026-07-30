import React, { useState } from 'react';

interface NuevaCategoriaModalProps {
  isOpen: boolean;
  mode: 'category' | 'subcategory';
  parentCategoryName?: string;
  onClose: () => void;
  onSaveCategory: (name: string, code: string, icon: string) => void;
  onSaveSubcategory: (parentName: string, subcategoryName: string) => void;
}

export const NuevaCategoriaModal: React.FC<NuevaCategoriaModalProps> = ({
  isOpen,
  mode,
  parentCategoryName = '',
  onClose,
  onSaveCategory,
  onSaveSubcategory,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [icon, setIcon] = useState('category');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (mode === 'category') {
      const generatedCode = code.trim().toUpperCase() || name.substring(0, 3).toUpperCase();
      onSaveCategory(name.trim(), generatedCode, icon);
    } else {
      onSaveSubcategory(parentCategoryName, name.trim());
    }

    setName('');
    setCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-stack-md bg-primary text-on-primary flex items-center justify-between">
          <h4 className="font-bold text-xl md:text-2xl">
            {mode === 'category'
              ? 'Nueva Categoría Principal'
              : `Añadir Subcategoría a ${parentCategoryName}`}
          </h4>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-stack-md space-y-4">
          <div className="space-y-1">
            <label className="block font-semibold text-base text-on-surface">
              {mode === 'category' ? 'Nombre de la Categoría' : 'Nombre de la Subcategoría'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mode === 'category' ? 'Ej: Vehículos, Ocio' : 'Ej: Combustible, Mantenimiento'}
              className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-lg"
            />
          </div>

          {mode === 'category' && (
            <>
              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">
                  Código Abreviado (3 letras)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ej: VEH"
                  className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-bold text-lg uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">Icono</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-lg cursor-pointer"
                >
                  <option value="category">Categoría General</option>
                  <option value="directions_car">Transporte / Coche</option>
                  <option value="sports_esports">Ocio / Entretenimiento</option>
                  <option value="school">Educación</option>
                  <option value="card_giftcard">Regalos</option>
                  <option value="pets">Mascotas</option>
                  <option value="shopping_bag">Compras</option>
                  <option value="flight">Viajes</option>
                </select>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 bg-surface-container-highest font-semibold text-base rounded-xl border-2 border-transparent hover:border-outline-variant transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-14 bg-primary text-on-primary font-bold text-base rounded-xl border-2 border-primary hover:bg-primary-container transition-all cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
