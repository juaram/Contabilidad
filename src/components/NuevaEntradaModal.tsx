import React, { useState, useEffect, useMemo, useRef } from "react";
import { Category, Movement, MovementType } from "../types";
import { SelectorFecha } from "./SelectorFecha";
import { SelectorList } from "./SelectorList";
import { useDropdownTheme, dropdownPanelStyle } from "../dropdownTheme";

const MONTH_NAMES_FULL = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function replaceDateInDescription(text: string, refDate: string): string {
  const d = new Date(`${refDate}T00:00:00`);
  if (isNaN(d.getTime())) return text;
  const curMonth = MONTH_NAMES_FULL[d.getMonth()];
  const curAbbr = curMonth.slice(0, 3);
  let result = text.replace(/\b(18|19|20)\d{2}\b/g, String(d.getFullYear()));
  MONTH_NAMES_FULL.forEach((m) => {
    result = result.replace(new RegExp(`\\b${m}\\b`, "gi"), curMonth);
  });
  MONTH_NAMES_FULL.forEach((m) => {
    result = result.replace(
      new RegExp(`\\b${m.slice(0, 3)}\\b`, "gi"),
      curAbbr,
    );
  });
  return result;
}

function sameSubcategory(a: string, b: string): boolean {
  return (a || "General").toLowerCase() === (b || "General").toLowerCase();
}

function parseAmount(value: string): number {
  const s = value.trim();
  if (s === "") return NaN;
  const hasComma = s.includes(",");
  const hasDot = s.includes(".");
  let normalized = s;
  if (hasComma && hasDot) {
    // Separador decimal = coma, separador de miles = punto
    normalized = s.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = s.replace(",", ".");
  } else if (hasDot && s.split(".").length === 2 && /\.\d{1,2}$/.test(s)) {
    // Un único punto final: se interpreta como decimal
  } else if (hasDot) {
    // Múltiples puntos: separadores de miles
    normalized = s.replace(/\./g, "");
  }
  return parseFloat(normalized);
}

interface NuevaEntradaModalProps {
  isOpen: boolean;
  initialType?: MovementType;
  categories: Category[];
  movements: Movement[];
  editingMovement?: Movement | null;
  onClose: () => void;
  onSave: (entry: Omit<Movement, "id">) => void;
}

export const NuevaEntradaModal: React.FC<NuevaEntradaModalProps> = ({
  isOpen,
  initialType = "gasto",
  categories,
  movements,
  editingMovement = null,
  onClose,
  onSave,
}) => {
  const theme = useDropdownTheme();
  const [type, setType] = useState<MovementType>(initialType);
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descSuggestionOpen, setDescSuggestionOpen] = useState(false);
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const descFieldRef = useRef<HTMLDivElement>(null);
  const [descListMaxHeight, setDescListMaxHeight] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      if (editingMovement) {
        setType(editingMovement.type);
        setAmount(
          editingMovement.amount.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
          }),
        );
        setDate(editingMovement.date);
        setDescription(editingMovement.description);
        setSelectedCategoryCode(
          editingMovement.category_id || categories[0]?.id || "",
        );
        setSubcategory(editingMovement.subcategory || "General");
      } else {
        setType(initialType);
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]);
        setDescription("");
        setSelectedCategoryCode("");
        setSubcategory("");
      }
    }
  }, [isOpen, initialType, categories, editingMovement]);

  const currentCategoryObj = selectedCategoryCode
    ? categories.find((c) => c.id === selectedCategoryCode)
    : null;

  const activeSubs = currentCategoryObj
    ? currentCategoryObj.subcategories.filter((s) => s.active !== false)
    : [];

  const descSuggestions = useMemo(() => {
    if (!selectedCategoryCode || !subcategory) return [];
    const entryYear = new Date(`${date}T00:00:00`).getFullYear();
    const candidate = (year: number) =>
      movements
        .filter(
          (m) =>
            m.category_id === selectedCategoryCode &&
            sameSubcategory(m.subcategory, subcategory) &&
            new Date(`${m.date}T00:00:00`).getFullYear() === year,
        )
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    let yearResults = candidate(entryYear);
    if (yearResults.length === 0) yearResults = candidate(entryYear - 1);
    const seen = new Set<string>();
    const result: string[] = [];
    for (const m of yearResults) {
      const d = m.description.trim();
      if (!d) continue;
      const key = d.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(d);
    }
    return result;
  }, [movements, selectedCategoryCode, subcategory, date]);

  if (!isOpen) return null;

  const handleDescriptionFocus = () => {
    if (selectedCategoryCode && subcategory && descSuggestions.length > 0) {
      setDescSuggestionOpen(true);
      const modal = modalBoxRef.current;
      const field = descFieldRef.current;
      if (modal && field) {
        const available =
          modal.getBoundingClientRect().bottom - field.getBoundingClientRect().bottom;
        setDescListMaxHeight(Math.max(40, available - 4));
      }
    }
  };

  const handlePickDescription = (d: string) => {
    setDescription(replaceDateInDescription(d, date));
    setDescSuggestionOpen(false);
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategoryCode(id);
    setSubcategory("");
  };

  const shiftDate = (days: number) => {
    setDate((prev) => {
      const d = new Date(`${prev}T00:00:00`);
      d.setDate(d.getDate() + days);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert("Por favor seleccione una fecha.");
      return;
    }
    const parsedAmount = parseAmount(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Por favor ingrese un importe válido.");
      return;
    }

    if (!description.trim()) {
      alert("Por favor ingrese una descripción para el movimiento.");
      return;
    }

    if (!selectedCategoryCode) {
      alert("Por favor seleccione una categoría.");
      return;
    }

    if (!subcategory) {
      alert("Por favor seleccione una subcategoría.");
      return;
    }

    const selectedCat = categories.find((c) => c.id === selectedCategoryCode);
    const selectedSub = selectedCat?.subcategories.find(
      (s) => s.name === subcategory,
    );

    onSave({
      date,
      category_id: selectedCat?.id ?? "",
      category: selectedCat?.name ?? "Varios",
      subcategory_id: selectedSub?.id ?? null,
      subcategory: subcategory || "General",
      description: description.trim(),
      type,
      amount: parsedAmount,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-fade-in">
      <div ref={modalBoxRef} className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all">
        {/* Header */}
        <div
          className={`p-4 md:p-stack-md flex items-center justify-between text-white ${
            type === "ingreso" ? "bg-secondary" : "bg-primary"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px]">
              {type === "ingreso" ? "add_circle" : "remove_circle"}
            </span>
            <h4 className="font-bold text-xl md:text-2xl">
              {editingMovement
                ? `Editar ${type === "ingreso" ? "Ingreso" : "Gasto"}`
                : type === "ingreso"
                  ? "Nuevo Ingreso"
                  : "Nuevo Gasto"}
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
              onClick={() => setType("ingreso")}
              className={`py-2.5 rounded-lg font-bold text-base transition-all cursor-pointer ${
                type === "ingreso"
                  ? "bg-secondary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              + Ingreso (Haber)
            </button>
            <button
              type="button"
              onClick={() => setType("gasto")}
              className={`py-2.5 rounded-lg font-bold text-base transition-all cursor-pointer ${
                type === "gasto"
                  ? "bg-error text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              - Gasto (Debe)
            </button>
          </div>

          {/* Date in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-base text-on-surface">
                Fecha
              </label>
              <div className="flex items-center gap-2">
                <SelectorFecha
                  mode="date"
                  value={date}
                  onChange={setDate}
                  placeholder="Elige una fecha"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => shiftDate(1)}
                  title="Aumentar un día"
                  className="w-12 h-14 shrink-0 bg-surface border-2 border-outline-variant rounded-xl flex items-center justify-center hover:border-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button
                  type="button"
                  onClick={() => shiftDate(-1)}
                  title="Disminuir un día"
                  className="w-12 h-14 shrink-0 bg-surface border-2 border-outline-variant rounded-xl flex items-center justify-center hover:border-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
              </div>
            </div>
          </div>

          {/*Category & Subcategory in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="block font-semibold text-base text-on-surface">
                Categoría
              </label>
              <SelectorList
                value={selectedCategoryCode}
                onChange={handleCategoryChange}
                placeholder="Elegir uno"
                options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary font-medium text-base"
              />
            </div>

            {/* Subcategory */}
            <div className="space-y-1">
              <label className="block font-semibold text-base text-on-surface">
                Subcategoría
              </label>
              <SelectorList
                value={subcategory}
                onChange={setSubcategory}
                placeholder="Elegir uno"
                options={[
                  ...(editingMovement &&
                  editingMovement.subcategory &&
                  !activeSubs.some(
                    (s) => s.name === editingMovement.subcategory,
                  )
                    ? [{ value: editingMovement.subcategory, label: editingMovement.subcategory }]
                    : []),
                  ...(activeSubs.length > 0
                    ? activeSubs.map((sub) => ({ value: sub.name, label: sub.name }))
                    : [{ value: 'General', label: 'General' }]),
                ]}
                className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary font-medium text-base"
              />
            </div>
          </div>

          {/* Description */}
          <div ref={descFieldRef} className="space-y-1 relative">
            <label className="block font-semibold text-base text-on-surface">
              Descripción
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={handleDescriptionFocus}
              onBlur={() => setDescSuggestionOpen(false)}
              placeholder="Ej: Compra semanal Mercadona"
              className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-lg"
            />
            {descSuggestionOpen && descSuggestions.length > 0 && (
              <div
                style={{ ...dropdownPanelStyle(theme), maxHeight: descListMaxHeight - 5 || undefined }}
                className="absolute z-50 left-0 right-0 mt-0 shadow-2xl overflow-y-auto overscroll-contain"
              >
                {descSuggestions.map((d, idx) => (
                  <button
                    key={`${d}-${idx}`}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handlePickDescription(d);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-surface-container-high transition-colors cursor-pointer text-sm md:text-base"
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-base text-on-surface">
                Importe (€)
              </label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-bold text-2xl tabular-nums"
              />
            </div>
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
                type === "ingreso"
                  ? "bg-secondary border-secondary hover:bg-secondary/90"
                  : "bg-primary border-primary hover:bg-primary-container"
              }`}
            >
              {editingMovement ? "Guardar Cambios" : "Guardar Entrada"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
