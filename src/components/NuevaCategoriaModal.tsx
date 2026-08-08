import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { SelectorList } from './SelectorList';
import {
  categoryBackgroundColor,
  categoryColorStyle,
  categoryTextColor,
  contrastTextColor,
  DEFAULT_CATEGORY_BG,
  DEFAULT_CATEGORY_TEXT,
  isHexColor,
} from '../categoryColors';

interface NuevaCategoriaModalProps {
  isOpen: boolean;
  mode: 'category' | 'subcategory';
  parentCategoryName?: string;
  editingCategory?: Category | null;
  onClose: () => void;
  onSaveCategory: (name: string, icon: string, colorBgClass: string, colorTextClass: string) => void;
  onSaveSubcategory: (parentName: string, subcategoryName: string) => void;
}

const PRESET_ICONS = [
  { name: 'Categoría General', value: 'category' },
  { name: 'Vivienda / Hogar', value: 'home' },
  { name: 'Alimentación', value: 'shopping_basket' },
  { name: 'Salud', value: 'medical_services' },
  { name: 'Transporte / Coche', value: 'directions_car' },
  { name: 'Ocio / Entretenimiento', value: 'sports_esports' },
  { name: 'Educación', value: 'school' },
  { name: 'Regalos', value: 'card_giftcard' },
  { name: 'Mascotas', value: 'pets' },
  { name: 'Compras', value: 'shopping_bag' },
  { name: 'Viajes', value: 'flight' },
  { name: 'Ahorro / Ingresos', value: 'savings' },
  { name: 'Trabajo', value: 'work' },
  { name: 'Pagos', value: 'payments' },
  { name: 'Energía / Servicios', value: 'electric_bolt' },
];

const isUrl = (value: string): boolean => /^https?:\/\//i.test(value);

export const NuevaCategoriaModal: React.FC<NuevaCategoriaModalProps> = ({
  isOpen,
  mode,
  parentCategoryName = '',
  editingCategory = null,
  onClose,
  onSaveCategory,
  onSaveSubcategory,
}) => {
  const isEditing = editingCategory !== null;

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('category');
  const [iconUrl, setIconUrl] = useState('');
  const [color, setColor] = useState(DEFAULT_CATEGORY_BG);
  const [colorText, setColorText] = useState(DEFAULT_CATEGORY_TEXT);

  useEffect(() => {
    if (!isOpen) return;

    if (isEditing) {
      setName(editingCategory.name);
      const url = isUrl(editingCategory.icon);
      setIcon(url ? 'category' : editingCategory.icon);
      setIconUrl(url ? editingCategory.icon : '');
      setColor(categoryBackgroundColor(editingCategory.colorBgClass));
      setColorText(categoryTextColor(editingCategory.colorBgClass, editingCategory.colorTextClass));
    } else {
      setName('');
      setIcon('category');
      setIconUrl('');
      setColor(DEFAULT_CATEGORY_BG);
      setColorText(DEFAULT_CATEGORY_TEXT);
    }
  }, [isOpen, isEditing, editingCategory]);

  if (!isOpen) return null;

  const effectiveIcon = iconUrl.trim() !== '' ? iconUrl.trim() : icon;

  const handleColorChange = (hex: string) => {
    setColor(hex);
    setColorText(contrastTextColor(hex));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing || mode === 'category') {
      onSaveCategory(name.trim(), effectiveIcon, color, colorText);
    } else {
      onSaveSubcategory(parentCategoryName, name.trim());
    }

    setName('');
    onClose();
  };

  const title = isEditing
    ? 'Editar Categoría Principal'
    : mode === 'category'
      ? 'Nueva Categoría Principal'
      : `Añadir Subcategoría a ${parentCategoryName}`;

  const isSubcategoryMode = !isEditing && mode === 'subcategory';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-stack-md bg-primary text-on-primary flex items-center justify-between">
          <h4 className="font-bold text-xl md:text-2xl">{title}</h4>
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
              {isSubcategoryMode ? 'Nombre de la Subcategoría' : 'Nombre de la Categoría'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isSubcategoryMode ? 'Ej: Combustible, Mantenimiento' : 'Ej: Vehículos, Ocio'}
              className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-lg"
            />
          </div>

          {!isSubcategoryMode && (
            <>
              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">Iconos rápidos</label>
                <div className="flex items-center gap-3 bg-surface border-2 border-outline-variant rounded-xl px-4 focus-within:border-primary transition-colors">
                  <CategoryIcon icon={icon} className="text-[22px] shrink-0" imgClassName="w-5 h-5" />
                  <SelectorList
                    value={icon}
                    onChange={(v) => {
                      setIcon(v);
                      setIconUrl('');
                    }}
                    options={[
                      ...(!PRESET_ICONS.some((p) => p.value === icon)
                        ? [{ value: icon, label: 'Icono actual' }]
                        : []),
                      ...PRESET_ICONS.map((preset) => ({ value: preset.value, label: preset.name })),
                    ]}
                    className="w-full h-14 bg-transparent font-medium text-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">
                  Enlace CDN del icono (freeicon.com)
                </label>
                <input
                  type="text"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  placeholder="Pega aquí el enlace CDN (botón 'Copy CDN Link')..."
                  className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-lg"
                />
                <p className="font-medium text-sm text-on-surface-variant">
                  Si lo rellenas, este icono tendrá prioridad sobre los iconos rápidos.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">Color</label>
                <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border-2 border-outline-variant">
                  <input
                    type="color"
                    value={isHexColor(color) ? color : DEFAULT_CATEGORY_BG}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-14 h-14 shrink-0 rounded-lg border-2 border-outline-variant cursor-pointer bg-transparent"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-base text-on-surface">Color de fondo</span>
                    <span className="font-mono font-medium text-sm text-on-surface-variant uppercase">
                      {isHexColor(color) ? color : DEFAULT_CATEGORY_BG}
                    </span>
                  </div>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: isHexColor(color) ? color : DEFAULT_CATEGORY_BG, color: colorText }}
                  >
                    <CategoryIcon icon={effectiveIcon} className="text-[22px]" imgClassName="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border-2 border-outline-variant">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={categoryColorStyle(color, colorText)}
                >
                  <CategoryIcon icon={effectiveIcon} className="text-[28px]" imgClassName="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-on-surface">{name.trim() || 'Nombre de la categoría'}</span>
                  <span className="font-medium text-sm text-on-surface-variant">Así se verá en toda la aplicación</span>
                </div>
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
              {isEditing ? 'Guardar cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
