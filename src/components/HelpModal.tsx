import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="p-stack-md bg-primary text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px]">help</span>
            <h4 className="font-bold text-xl md:text-2xl">Centro de Ayuda - Mis Cuentas</h4>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <h5 className="font-bold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              ¿Cómo añadir un nuevo ingreso o gasto?
            </h5>
            <p className="text-on-surface-variant text-base leading-relaxed">
              En la pantalla de <strong>Inicio</strong>, pulse en el botón verde <strong>"Añadir Ingreso"</strong> o en el botón rojo <strong>"Añadir Gasto"</strong>. También puede usar la opción <strong>"Nueva Entrada"</strong> en el menú superior.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              ¿Cómo filtrar sus movimientos históricos?
            </h5>
            <p className="text-on-surface-variant text-base leading-relaxed">
              Vaya a la pestaña <strong>Registro</strong>. Puede elegir el año (2024, 2023, etc.), filtrar por mes, seleccionar una categoría o subcategoría concreta, o bien escribir en la barra de búsqueda por descripción.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">category</span>
              ¿Cómo personalizar sus categorías?
            </h5>
            <p className="text-on-surface-variant text-base leading-relaxed">
              En la pestaña <strong>Ajustes</strong>, en el panel de <strong>Gestión de Categorías</strong>, puede pulsar <strong>"+ Nueva"</strong> para añadir una clave principal, o desplegar una categoría existente para añadir o eliminar sus subcategorías. También puede editar cada categoría para cambiar su nombre, su icono (usando iconos rápidos o un enlace CDN de freeicon.com) y su color.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">shield</span>
              Seguridad y Privacidad
            </h5>
            <p className="text-on-surface-variant text-base leading-relaxed">
              Sus datos se guardan de forma local en su navegador para garantizar la máxima protección y privacidad. Puede realizar copias de seguridad o exportar sus movimientos en formato PDF o CSV cuando lo desee.
            </p>
          </div>

          <p className="text-sm text-on-surface-variant">
            Iconos por <a href="https://freeicon.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Freeicon.com</a>
          </p>
        </div>

        <div className="p-stack-md bg-surface-container-low border-t border-outline-variant flex justify-end">
          <button
            onClick={onClose}
            className="px-6 h-12 bg-primary text-on-primary font-bold text-base rounded-xl hover:bg-primary-container transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
