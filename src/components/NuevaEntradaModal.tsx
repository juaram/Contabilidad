import React, { useState, useEffect } from 'react';
import { Category, Movement, MovementType } from '../types';

interface NuevaEntradaModalProps {
  isOpen: boolean;
  initialType?: MovementType;
  categories: Category[];
  onClose: () => void;
  onSave: (entry: Omit<Movement, 'id'>) => void;
}

export const NuevaEntradaModal: React.FC<NuevaEntradaModalProps> = ({
  isOpen,
  initialType = 'gasto',
  categories,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<MovementType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      if (categories.length > 0) {
        setSelectedCategoryCode(categories[0].id);
        if (categories[0].subcategories.length > 0) {
          setSubcategory(categories[0].subcategories[0].name);
        }
      }
    }
  }, [isOpen, initialType, categories]);

  if (!isOpen) return null;

  const currentCategoryObj = categories.find((c) => c.id === selectedCategoryCode) || categories[0];

  const handleCategoryChange = (id: string) => {
    setSelectedCategoryCode(id);
    const cat = categories.find((c) => c.id === id);
    if (cat && cat.subcategories.length > 0) {
      setSubcategory(cat.subcategories[0].name);
    } else {
      setSubcategory('General');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Por favor ingrese un importe válido.');
      return;
    }

    if (!description.trim()) {
      alert('Por favor ingrese una descripción para el movimiento.');
      return;
    }

    const selectedCat = categories.find((c) => c.id === selectedCategoryCode);
    const selectedSub = selectedCat?.subcategories.find((s) => s.name === subcategory);

    onSave({
      date,
      category_id: selectedCat?.id ?? '',
      category: selectedCat?.name ?? 'Varios',
      subcategory_id: selectedSub?.id ?? null,
      subcategory: subcategory || 'General',
      description: description.trim(),
      type,
      amount: parsedAmount,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all">
        {/* Header */}
        <div className={`p-4 md:p-stack-md flex items-center justify-between text-white ${
          type === 'ingreso' ? 'bg-secondary' : 'bg-primary'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px]">
              {type === 'ingreso' ? 'add_circle' : 'remove_circle'}
            </span>
            <h4 className="font-bold text-xl md:text-2xl">
              {type === 'ingreso' ? 'Nuevo Ingreso' : 'Nuevo Gasto'}
            </h4>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 md:p-stack-md space-y-4">
          {/* Type Selector */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-surface-container-low rounded-xl border border-outline-variant">
            <button
              type="button"
              onClick={() => setType('ingreso')}
              className={`py-2.5 rounded-lg font-bold text-base transition-all cursor-pointer ${
                type === 'ingreso'
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              + Ingreso (Haber)
            </button>
            <button
              type="button"
              onClick={() => setType('gasto')}
              className={`py-2.5 rounded-lg font-bold text-base transition-all cursor-pointer ${
                type === 'gasto'
                  ? 'bg-error text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              - Gasto (Debe)
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="block font-semibold text-base text-on-surface">Importe (€)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-bold text-2xl tabular-nums"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block font-semibold text-base text-on-surface">Descripción</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Compra semanal Mercadona"
              className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-lg"
            />
          </div>

          {/* Date & Category in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-base text-on-surface">Fecha</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-base text-on-surface">Categoría</label>
              <select
                value={selectedCategoryCode}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subcategory */}
          <div className="space-y-1">
            <label className="block font-semibold text-base text-on-surface">Subcategoría</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base cursor-pointer"
            >
              {currentCategoryObj && currentCategoryObj.subcategories.length > 0 ? (
                currentCategoryObj.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))
              ) : (
                <option value="General">General</option>
              )}
            </select>
          </div>

          {/* Actions */}
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
              className={`flex-1 h-14 font-bold text-base text-white rounded-xl border-2 transition-all cursor-pointer ${
                type === 'ingreso'
                  ? 'bg-secondary border-secondary hover:bg-secondary/90'
                  : 'bg-primary border-primary hover:bg-primary-container'
              }`}
            >
              Guardar Entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
