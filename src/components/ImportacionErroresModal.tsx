import React from 'react';

export interface InvalidRecord {
  line: number;
  date: string;
  category: string;
  subcategory: string;
  description: string;
  type: string;
  amount: string;
  reason: string;
}

interface ImportacionErroresModalProps {
  isOpen: boolean;
  records: InvalidRecord[];
  onClose: () => void;
}

export const ImportacionErroresModal: React.FC<ImportacionErroresModalProps> = ({ isOpen, records, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border-2 border-error rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-error p-4 flex items-center justify-between text-on-error shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px]">warning</span>
            <div>
              <h4 className="font-bold text-xl">Importación no realizada</h4>
              <p className="text-sm text-on-error/90">
                {records.length} registro(s) no cumplen las validaciones
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-base text-on-surface mb-4">
            Antes de importar se verifican las categorías y subcategorías de todos los registros. Corrige los
            siguientes registros en el archivo CSV o crea las categorías/subcategorías que faltan e inténtalo de nuevo.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant border-b-2 border-outline-variant">
                  <th className="px-3 py-3 font-semibold text-sm w-14">Línea</th>
                  <th className="px-3 py-3 font-semibold text-sm">Fecha</th>
                  <th className="px-3 py-3 font-semibold text-sm">Categoría</th>
                  <th className="px-3 py-3 font-semibold text-sm">Subcategoría</th>
                  <th className="px-3 py-3 font-semibold text-sm">Descripción</th>
                  <th className="px-3 py-3 font-semibold text-sm">Tipo</th>
                  <th className="px-3 py-3 font-semibold text-sm">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {records.map((r) => (
                  <tr key={r.line} className="align-top">
                    <td className="px-3 py-2 font-bold text-sm whitespace-nowrap">{r.line}</td>
                    <td className="px-3 py-2 font-medium text-sm whitespace-nowrap">{r.date}</td>
                    <td className="px-3 py-2 font-medium text-sm">
                      {r.category || <span className="opacity-40">-</span>}
                    </td>
                    <td className="px-3 py-2 font-medium text-sm">
                      {r.subcategory || <span className="opacity-40">-</span>}
                    </td>
                    <td className="px-3 py-2 font-medium text-sm max-w-[200px] truncate" title={r.description}>
                      {r.description || <span className="opacity-40">-</span>}
                    </td>
                    <td className="px-3 py-2 font-medium text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        r.type === 'ingreso' ? 'bg-secondary/15 text-secondary' : 'bg-error/15 text-error'
                      }`}>
                        {r.type || '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-medium text-sm whitespace-nowrap">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reasons summary */}
          <div className="mt-4 flex flex-col gap-2">
            {Array.from(new Set(records.map((r) => r.reason))).map((reason) => (
              <div key={reason} className="flex items-start gap-2 bg-error-container text-error font-semibold text-sm px-4 py-2.5 rounded-lg">
                <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-outline-variant flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="h-12 px-6 bg-surface-container-highest font-semibold text-base rounded-xl border-2 border-transparent hover:border-outline-variant transition-all cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
