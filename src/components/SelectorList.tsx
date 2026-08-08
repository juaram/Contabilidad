import { useDropdownTheme, dropdownPanelStyle } from "../dropdownTheme";
import { useDropdownPanel } from "./useDropdownPanel";

export interface SelectorListOption {
  value: string;
  label: string;
}

interface SelectorListProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectorListOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  listClassName?: string;
}

const BASE_TRIGGER =
  "w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-secondary focus:outline-none font-medium text-base cursor-pointer flex items-center justify-between gap-2 text-left disabled:opacity-40 disabled:cursor-not-allowed";

export const SelectorList: React.FC<SelectorListProps> = ({
  value,
  onChange,
  options,
  placeholder = "Selecciona…",
  disabled = false,
  className = "",
  listClassName = "",
}) => {
  const theme = useDropdownTheme();
  const { anchorRef, open, close, openPanel, renderPortal } = useDropdownPanel();

  const selected = options.find((o) => o.value === value);
  const panelHeight = Math.min(options.length * 44 + 16, 320);

  const triggerClass = className
    ? `flex items-center justify-between gap-2 text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`
    : BASE_TRIGGER;

  return (
    <>
      <div ref={anchorRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => (open ? close() : openPanel(panelHeight))}
          className={triggerClass}
        >
          <span className={`truncate ${selected ? "" : "text-on-surface-variant"}`}>
            {selected ? selected.label : placeholder}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant shrink-0">
            {open ? "expand_less" : "expand_more"}
          </span>
        </button>
      </div>

      {renderPortal(
        dropdownPanelStyle(theme),
        `overflow-y-auto overscroll-contain py-1 max-h-80 ${listClassName}`,
        options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                close();
              }}
              className={`w-full text-left px-4 py-2.5 cursor-pointer transition-colors ${
                isSelected ? "font-bold" : ""
              } hover:bg-black/10`}
            >
              {opt.label}
            </button>
          );
        })
      )}
    </>
  );
};