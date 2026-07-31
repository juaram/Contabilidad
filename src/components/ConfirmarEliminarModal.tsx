import React from 'react';
import { Movement } from '../types';

interface ConfirmarEliminarModalProps {
  isOpen: boolean;
  movement: Movement | null;
  currencySymbol: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmarEliminarModal: React.FC<ConfirmarEliminarModalProps> = ({
  isOpen,
  movement,
  currencySymbol,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !movement) return null;

  const isExpense = movement.type === 'gasto';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border-2 border-error rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-error p-4 flex items-center justify-between text-on-error">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px]">warning</span>
            <h4 className="font-bold text-xl">Eliminar Movimiento</h4>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <p className="text-base text-on-surface">
            ¿Estás seguro de que quieres eliminar este movimiento? Esta acción no se puede deshacer.
          </p>

          {/* Movement summary */}
          <div className="bg-surface-container-low border-2 border-outline-variant rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-base text-on-surface">{movement.description}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-on-surface-variant">
              <span>
                {movement.date.includes('-') ? movement.date.split('-').reverse().join('/') : movement.date}
              </span>
              <span className={`font-bold text-base ${isExpense ? 'text-error' : 'text-secondary'}`}>
                {isExpense ? '-' : '+'}{' '}
                {movement.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} {currencySymbol}
              </span>
            </div>
            <span className="self-start px-2 py-1 rounded bg-surface-container-high text-on-surface-variant font-medium text-sm">
              {movement.category} {movement.subcategory ? `· ${movement.subcategory}` : ''}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 bg-surface-container-highest font-semibold text-base rounded-xl border-2 border-transparent hover:border-outline-variant transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 h-12 bg-error text-on-error font-bold text-base rounded-xl border-2 border-error hover:bg-error/90 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
