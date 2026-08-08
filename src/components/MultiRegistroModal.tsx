import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Category, Movement, MovementType } from "../types";
import { SelectorFecha } from "./SelectorFecha";
import { SelectorList } from "./SelectorList";

interface MultiRegistroModalProps {
  isOpen: boolean;
  categories: Category[];
  movements: Movement[];
  type: MovementType;
  onClose: () => void;
  onChoseSingle: () => void;
  onSave: (
    entries: {
      id?: string;
      date: string;
      category_id: string;
      category: string;
      subcategory_id: number;
      subcategory: string;
      description: string;
      type: MovementType;
      amount: number;
    }[],
  ) => void;
}

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function parseAmount(value: string): number {
  const s = value.trim();
  if (s === "") return NaN;
  const hasComma = s.includes(",");
  const hasDot = s.includes(".");
  let normalized = s;
  if (hasComma && hasDot) {
    normalized = s.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = s.replace(",", ".");
  } else if (hasDot && s.split(".").length === 2 && /\.\d{1,2}$/.test(s)) {
  } else if (hasDot) {
    normalized = s.replace(/\./g, "");
  }
  return parseFloat(normalized);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export const MultiRegistroModal: React.FC<MultiRegistroModalProps> = ({
  isOpen,
  categories,
  movements,
  type,
  onClose,
  onChoseSingle,
  onSave,
}) => {
  const [step, setStep] = useState<"mode" | "config" | "form" | "daily">("mode");
  const [monthValue, setMonthValue] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [categoryId, setCategoryId] = useState<string>("");
  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [description, setDescription] = useState<string>("-");
  const [amounts, setAmounts] = useState<Record<number, string>>({});
  const [dailyDate, setDailyDate] = useState<string>("");
  const [dailyAmounts, setDailyAmounts] = useState<Record<string, string>>({});
  const [dailyDescription, setDailyDescription] = useState<string>("-");
  const [monthlyAmounts, setMonthlyAmounts] = useState<Record<string, string>>({});

  const ventasCategory = useMemo(
    () => categories.find((c) => c.name.toLowerCase() === "ventas"),
    [categories],
  );

  const targetCategory = useMemo(() => {
    if (type === "ingreso") return ventasCategory ?? null;
    return categories.find((c) => c.id === categoryId) ?? null;
  }, [type, ventasCategory, categories, categoryId]);

  const daysInMonth = useMemo(() => {
    const [y, m] = monthValue.split("-").map(Number);
    return new Date(y, m, 0).getDate();
  }, [monthValue]);

  const existingAmounts = useMemo(() => {
    const map: Record<number, number> = {};
    if (!targetCategory || !subcategoryId) return map;
    for (const mov of movements) {
      if (mov.category_id !== targetCategory.id) continue;
      if (mov.subcategory_id !== null && String(mov.subcategory_id) !== subcategoryId) continue;
      if (mov.type !== type) continue;
      if (!mov.date.startsWith(monthValue)) continue;
      const day = Number(mov.date.slice(8, 10));
      if (!isNaN(day)) map[day] = mov.amount;
    }
    return map;
  }, [movements, targetCategory, subcategoryId, monthValue, type]);

  useEffect(() => {
    if (step === "form") {
      setAmounts(() =>
        Object.keys(existingAmounts).reduce<Record<number, string>>((acc, d) => {
          acc[Number(d)] = existingAmounts[Number(d)].toLocaleString("es-ES", {
            minimumFractionDigits: 2,
          });
          return acc;
        }, {}),
      );
    }
  }, [step, existingAmounts]);

  const buildDailyAmounts = useCallback(
    (date: string, catId: string): Record<string, string> => {
      const map: Record<string, string> = {};
      if (!date || !catId) return map;
      for (const mov of movements) {
        if (mov.category_id !== catId) continue;
        if (mov.type !== type) continue;
        if (mov.date !== date) continue;
        if (mov.subcategory_id !== null) {
          map[String(mov.subcategory_id)] = mov.amount.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
          });
        }
      }
      return map;
    },
    [movements, type],
  );

  const existingDailyMap = useMemo(() => {
    const map: Record<string, { id: string; amount: number }> = {};
    if (!targetCategory || !dailyDate) return map;
    for (const mov of movements) {
      if (mov.category_id !== targetCategory.id) continue;
      if (mov.type !== type) continue;
      if (mov.date !== dailyDate) continue;
      if (mov.subcategory_id !== null) map[String(mov.subcategory_id)] = { id: mov.id, amount: mov.amount };
    }
    return map;
  }, [movements, targetCategory, dailyDate, type]);

  const existingMonthlyMap = useMemo(() => {
    const map: Record<string, { id: string; amount: number }> = {};
    if (!targetCategory) return map;
    const [y, m] = monthValue.split("-").map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    const lastDate = `${monthValue}-${pad(lastDay)}`;
    for (const mov of movements) {
      if (mov.category_id !== targetCategory.id) continue;
      if (mov.type !== type) continue;
      if (mov.date !== lastDate) continue;
      if (mov.subcategory_id !== null) map[String(mov.subcategory_id)] = { id: mov.id, amount: mov.amount };
    }
    return map;
  }, [movements, targetCategory, monthValue, type]);

  const handleDailyDateChange = (v: string) => {
    setDailyDate(v);
    setDailyAmounts(buildDailyAmounts(v, targetCategory?.id ?? ""));
  };

  const handleCategoryChange = (v: string) => {
    setCategoryId(v);
    setSubcategoryId("");
    setDailyAmounts(buildDailyAmounts(dailyDate, v));
  };

  const reset = () => {
    setStep("mode");
    setMonthValue(new Date().toISOString().slice(0, 7));
    setCategoryId("");
    setSubcategoryId("");
    setDescription("-");
    setAmounts({});
    setDailyDate("");
    setDailyAmounts({});
    setDailyDescription("-");
    setMonthlyAmounts({});
  };

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedSub = targetCategory?.subcategories.find(
    (s) => String(s.id) === subcategoryId,
  );

  const handleSave = () => {
    if (!targetCategory) return;
    const [y, m] = monthValue.split("-").map(Number);
    const entries = Object.entries(amounts)
      .filter(([dayStr, v]) => {
        if (existingAmounts[Number(dayStr)] !== undefined) return false;
        const amt = parseAmount(v);
        return !isNaN(amt) && amt > 0;
      })
      .map(([dayStr, v]) => {
        const day = Number(dayStr);
        const amount = parseAmount(v);
        return {
          date: `${y}-${pad(m)}-${pad(day)}`,
          category_id: targetCategory.id,
          category: targetCategory.name,
          subcategory_id: Number(subcategoryId),
          subcategory: selectedSub?.name ?? "",
          description: description.trim() || "-",
          type,
          amount,
        };
      });
    if (entries.length === 0) {
      alert("Introduce al menos un importe mayor que cero en algún día.");
      return;
    }
    onSave(entries);
  };

  const handleSaveDaily = () => {
    if (!targetCategory) return;
    if (!dailyDate) {
      alert("Selecciona un día para el apunte.");
      return;
    }
    const entries = Object.entries(dailyAmounts)
      .filter(([, v]) => {
        const amt = parseAmount(v);
        return !isNaN(amt) && amt > 0;
      })
      .map(([subId, v]) => {
        const amount = parseAmount(v);
        const sub = targetCategory.subcategories.find(
          (s) => String(s.id) === subId,
        );
        return {
          id: existingDailyMap[subId]?.id,
          date: dailyDate,
          category_id: targetCategory.id,
          category: targetCategory.name,
          subcategory_id: Number(subId),
          subcategory: sub?.name ?? "",
          description: dailyDescription.trim() || "-",
          type,
          amount,
        };
      });
    if (entries.length === 0) {
      alert("Introduce al menos un importe mayor que cero en alguna subcategoría.");
      return;
    }
    onSave(entries);
  };

  const handleSaveMonthly = () => {
    if (!targetCategory) return;
    const [y, m] = monthValue.split("-").map(Number);
    const lastDate = `${y}-${pad(m)}-${pad(new Date(y, m, 0).getDate())}`;
    const entries = Object.entries(monthlyAmounts)
      .filter(([, v]) => {
        const amt = parseAmount(v);
        return !isNaN(amt) && amt > 0;
      })
      .map(([subId, v]) => {
        const amount = parseAmount(v);
        const sub = targetCategory.subcategories.find(
          (s) => String(s.id) === subId,
        );
        return {
          id: existingMonthlyMap[subId]?.id,
          date: lastDate,
          category_id: targetCategory.id,
          category: targetCategory.name,
          subcategory_id: Number(subId),
          subcategory: sub?.name ?? "",
          description: description.trim() || "-",
          type: "gasto" as MovementType,
          amount,
        };
      });
    if (entries.length === 0) {
      alert("Introduce al menos un importe mayor que cero en alguna subcategoría.");
      return;
    }
    onSave(entries);
  };

  const headerColors =
    type === "ingreso"
      ? "bg-secondary text-white"
      : "bg-error text-on-error";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`p-4 md:p-typography flex items-center justify-between ${headerColors}`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px]">
              {type === "ingreso" ? "add_circle" : "remove_circle"}
            </span>
            <h4 className="font-bold text-xl md:text-2xl">
              Añadir {type === "ingreso" ? "Ingreso" : "Gasto"}
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
        <div className="p-4 md:p-6 space-y-4 overflow-y-auto">
          {step === "mode" && (
            <div className="space-y-3">
              <p className="font-medium text-base text-on-surface">
                ¿Qué tipo de movimiento quieres introducir?
              </p>
              <button
                type="button"
                onClick={onChoseSingle}
                className="w-full py-4 rounded-xl bg-surface-container-low border-2 border-outline-variant hover:border-secondary transition-all font-bold text-left px-4 text-base cursor-pointer"
              >
                <span className="material-symbols-outlined align-middle mr-2 text-secondary">edit</span>
                Movimiento único
              </button>
              <button
                type="button"
                onClick={() => setStep("config")}
                className="w-full py-4 rounded-xl bg-surface-container-low border-2 border-outline-variant hover:border-secondary transition-all font-bold text-left px-4 text-base cursor-pointer"
              >
                <span className="material-symbols-outlined align-middle mr-2 text-secondary">calendar_month</span>
                {type === "ingreso" ? "Registro múltiple (un apunte por día del mes)" : "Registro múltiple (un apunte mensual)"}
              </button>
              {type === "ingreso" && (
                <button
                  type="button"
                  onClick={() => setStep("daily")}
                  className="w-full py-4 rounded-xl bg-surface-container-low border-2 border-outline-variant hover:border-secondary transition-all font-bold text-left px-4 text-base cursor-pointer"
                >
                  <span className="material-symbols-outlined align-middle mr-2 text-secondary">receipt_long</span>
                  Registro Múltiple (Apunte diario x SubCategoría)
                </button>
              )}
            </div>
          )}

          {step === "config" && type === "ingreso" && (
            <div className="space-y-4">
              {!targetCategory ? (
                <p className="text-on-surface-variant">
                  No existe la categoría "VENTAS".
                </p>
              ) : (
                <>
                  <p className="font-medium text-on-surface">
                    Registro múltiple para la categoría{" "}
                    <span className="font-bold">{targetCategory.name}</span>
                  </p>

                  <div className="space-y-1">
                    <label className="block font-semibold text-base text-on-surface">
                      Mes
                    </label>
                    <SelectorFecha
                      mode="month"
                      value={monthValue}
                      onChange={setMonthValue}
                      placeholder="Elige un mes"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-base text-on-surface">
                      Subcategoría
                    </label>
                    <SelectorList
                      value={subcategoryId}
                      onChange={setSubcategoryId}
                      placeholder="Elegir uno"
                      options={(targetCategory?.subcategories ?? [])
                        .filter((s) => s.active !== false)
                        .map((s) => ({ value: s.id, label: s.name }))}
                      className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-secondary font-medium text-base"
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep("mode")}
                      className="flex-1 h-14 bg-surface-container-highest font-semibold text-base rounded-xl cursor-pointer"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      disabled={!subcategoryId}
                      onClick={() => setStep("form")}
                      className="flex-1 h-14 bg-secondary font-bold text-base text-white rounded-xl disabled:opacity-40 cursor-pointer"
                    >
                      Continuar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === "config" && type === "gasto" && (
            <div className="space-y-4">
              <p className="font-medium text-on-surface">
                Registro mensual para la categoría{" "}
                <span className="font-bold">{targetCategory?.name ?? "…"}</span>
              </p>

              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">
                  Mes
                </label>
                <SelectorFecha
                  mode="month"
                  value={monthValue}
                  onChange={setMonthValue}
                  placeholder="Elige un mes"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">
                  Categoría
                </label>
                <SelectorList
                  value={categoryId}
                  onChange={handleCategoryChange}
                  placeholder="Elegir uno"
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-secondary font-medium text-base"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("mode")}
                  className="flex-1 h-14 bg-surface-container-highest font-semibold text-base rounded-xl cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  disabled={!categoryId}
                  onClick={() => setStep("form")}
                  className="flex-1 h-14 bg-error font-bold text-base text-white rounded-xl disabled:opacity-40 cursor-pointer"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === "form" && type === "ingreso" && targetCategory && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-on-surface">
                  {selectedSub?.name} · {MONTH_NAMES[Number(monthValue.slice(5, 7)) - 1]} {monthValue.slice(0, 4)}
                </p>
                <span className="text-sm text-on-surface-variant">
                  {daysInMonth} días
                </span>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">
                  Descripción
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Venta día online"
                  className="w-full h-12 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-secondary focus:outline-none font-medium text-base"
                />
              </div>

              <div className="border-2 border-outline-variant rounded-xl divide-y divide-outline-variant overflow-hidden max-h-64 overflow-y-auto">
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const alreadyExists = existingAmounts[day] !== undefined;
                  return (
                    <div key={day} className="flex items-center gap-3 px-3 py-2">
                      <span className="w-10 shrink-0 font-semibold text-base text-on-surface-variant">
                        {pad(day)}
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0,00"
                        value={amounts[day] ?? ""}
                        disabled={alreadyExists}
                        onChange={(e) =>
                          setAmounts((prev) => ({ ...prev, [day]: e.target.value }))
                        }
                        className="flex-1 h-11 px-3 bg-surface border-2 border-outline-variant rounded-lg focus:border-secondary focus:outline-none font-bold text-base tabular-nums disabled:bg-surface-container-high disabled:text-on-surface-variant disabled:cursor-not-allowed"
                      />
                      {alreadyExists && (
                        <span
                          className="shrink-0 material-symbols-outlined text-secondary"
                          title="Ya registrado"
                        >
                          check_circle
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setStep("config")}
                  className="flex-1 h-14 bg-surface-container-highest font-semibold text-base rounded-xl cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 h-14 bg-secondary font-bold text-base text-white rounded-xl cursor-pointer"
                >
                  Guardar registros
                </button>
              </div>
            </div>
          )}

          {step === "form" && type === "gasto" && targetCategory && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-on-surface">
                  {targetCategory.name} · {MONTH_NAMES[Number(monthValue.slice(5, 7)) - 1]} {monthValue.slice(0, 4)}
                </p>
                <span className="text-sm text-on-surface-variant">
                  Fecha: {pad(new Date(Number(monthValue.slice(0, 4)), Number(monthValue.slice(5, 7)), 0).getDate())} de {MONTH_NAMES[Number(monthValue.slice(5, 7)) - 1]}
                </span>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">
                  Descripción
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Cierre de mes"
                  className="w-full h-12 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base"
                />
              </div>

              {targetCategory.subcategories.filter((s) => s.active !== false).length === 0 ? (
                <p className="text-on-surface-variant">
                  Esta categoría no tiene subcategorías activas.
                </p>
              ) : (
                <div className="border-2 border-outline-variant rounded-xl divide-y divide-outline-variant overflow-hidden max-h-64 overflow-y-auto">
                  {targetCategory.subcategories
                    .filter((s) => s.active !== false)
                    .map((sub) => {
                      const existing = existingMonthlyMap[sub.id];
                      const hasValue = Object.prototype.hasOwnProperty.call(monthlyAmounts, sub.id);
                      const displayValue = hasValue
                        ? monthlyAmounts[sub.id]
                        : existing
                          ? existing.amount.toLocaleString("es-ES", {
                              minimumFractionDigits: 2,
                            })
                          : "";
                      return (
                        <div key={sub.id} className="flex items-center gap-3 px-3 py-2">
                          <span className="flex-1 shrink-0 font-semibold text-base text-on-surface truncate">
                            {sub.name}
                          </span>
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="0,00"
                            value={displayValue}
                            onChange={(e) =>
                              setMonthlyAmounts((prev) => ({
                                ...prev,
                                [sub.id]: e.target.value,
                              }))
                            }
                            className="w-32 h-11 px-3 bg-surface border-2 border-outline-variant rounded-lg focus:border-primary focus:outline-none font-bold text-base tabular-nums text-right"
                          />
                          {existing && (
                            <span
                              className="shrink-0 material-symbols-outlined text-error"
                              title="Ya registrado este mes"
                            >
                              check_circle
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}

              <div className="flex gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setStep("config")}
                  className="flex-1 h-14 bg-surface-container-highest font-semibold text-base rounded-xl cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleSaveMonthly}
                  className="flex-1 h-14 bg-error font-bold text-base text-white rounded-xl cursor-pointer"
                >
                  Guardar registros
                </button>
              </div>
            </div>
          )}

          {step === "daily" && targetCategory && (
            <div className="space-y-4">
              <p className="font-medium text-on-surface">
                Apunte diario para la categoría{" "}
                <span className="font-bold">{targetCategory.name}</span>
              </p>

              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">
                  Día
                </label>
                <SelectorFecha
                  mode="date"
                  value={dailyDate}
                  onChange={handleDailyDateChange}
                  placeholder="Elige un día"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-base text-on-surface">
                  Descripción
                </label>
                <input
                  type="text"
                  value={dailyDescription}
                  onChange={(e) => setDailyDescription(e.target.value)}
                  placeholder="Ej: Venta día online"
                  className="w-full h-12 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-secondary focus:outline-none font-medium text-base"
                />
              </div>

              <div className="border-2 border-outline-variant rounded-xl divide-y divide-outline-variant overflow-hidden max-h-64 overflow-y-auto">
                {(targetCategory.subcategories.filter((s) => s.active !== false)).map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3 px-3 py-2">
                    <span className="flex-1 shrink-0 font-semibold text-base text-on-surface truncate">
                      {sub.name}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={dailyAmounts[sub.id] ?? ""}
                      onChange={(e) =>
                        setDailyAmounts((prev) => ({
                          ...prev,
                          [sub.id]: e.target.value,
                        }))
                      }
                      className="w-32 h-11 px-3 bg-surface border-2 border-outline-variant rounded-lg focus:border-secondary focus:outline-none font-bold text-base tabular-nums text-right"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setStep("mode")}
                  className="flex-1 h-14 bg-surface-container-highest font-semibold text-base rounded-xl cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleSaveDaily}
                  className="flex-1 h-14 bg-secondary font-bold text-base text-white rounded-xl cursor-pointer"
                >
                  Guardar Apuntes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};