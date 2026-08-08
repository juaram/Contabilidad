import React, { useState } from "react";
import { useDropdownTheme, dropdownPanelStyle } from "../dropdownTheme";
import { useDropdownPanel } from "./useDropdownPanel";

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

interface SelectorFechaProps {
  value: string;
  onChange: (value: string) => void;
  mode: "month" | "date";
  placeholder?: string;
  className?: string;
}

export const SelectorFecha: React.FC<SelectorFechaProps> = ({
  value,
  onChange,
  mode,
  placeholder,
  className = "",
}) => {
  const theme = useDropdownTheme();
  const { anchorRef, open, close, openPanel, renderPortal } = useDropdownPanel();

  const [showMonths, setShowMonths] = useState(false);
  const [view, setView] = useState(() => {
    const base = value || new Date().toISOString().slice(0, 10);
    const [y = 0, m = 1] = base.split("-").map((p) => parseInt(p, 10));
    return { year: y || new Date().getFullYear(), month: (m || 1) - 1 };
  });

  const label =
    mode === "month"
      ? value
        ? `${MONTHS[parseInt(value.slice(5, 7), 10) - 1]} de ${value.slice(0, 4)}`
        : ""
      : value
        ? `${value.slice(8, 10)}/${value.slice(5, 7)}/${value.slice(0, 4)}`
        : "";

const toggle = () => {
    if (open) {
      close();
      return;
    }
    const base = value || new Date().toISOString().slice(0, 10);
    const [y, m] = base.split("-").map((p) => parseInt(p, 10));
    setView({ year: y || new Date().getFullYear(), month: (m || 1) - 1 });
    setShowMonths(mode === "month");
    openPanel(320, 2);
  };

  const prevMonth = () =>
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }));
  const nextMonth = () =>
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }));

  const pickMonth = (m: number) => {
    const year = view.year;
    if (mode === "month") {
      onChange(`${year}-${pad(m + 1)}`);
      close();
    } else {
      setView({ year, month: m });
      setShowMonths(false);
    }
  };

  const pickDay = (day: number) => {
    onChange(`${view.year}-${pad(view.month + 1)}-${pad(day)}`);
    close();
  };

  const firstWeekday = new Date(view.year, view.month, 1).getDay();
  const leadingBlanks = (firstWeekday + 6) % 7;
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const selectedDay = value.startsWith(`${view.year}-${pad(view.month + 1)}-`)
    ? parseInt(value.slice(8, 10), 10)
    : null;
  const today = new Date();

  return (
    <>
      <div ref={anchorRef} className={`relative ${className}`}>
        <button
          type="button"
          onClick={toggle}
          className="w-full h-14 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-secondary focus:outline-none font-medium text-base cursor-pointer flex items-center justify-between gap-2 text-left"
        >
          <span className={label ? "text-on-surface" : "text-on-surface-variant"}>
            {label || placeholder}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant">calendar_month</span>
        </button>
      </div>

      {renderPortal(
        dropdownPanelStyle(theme),
        "p-3 select-none",
        showMonths ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setView((v) => ({ ...v, year: v.year - 1 }))}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/10 cursor-pointer"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="flex-1 text-center font-bold text-on-background">{view.year}</span>
              <button
                type="button"
                onClick={() => setView((v) => ({ ...v, year: v.year + 1 }))}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/10 cursor-pointer"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((m, i) => {
                const isSelected =
                  mode === "month" ? value === `${view.year}-${pad(i + 1)}` : view.month === i;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => pickMonth(i)}
                    className={`px-2 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      isSelected ? "bg-primary text-on-primary" : "text-on-background hover:bg-black/10"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/10 cursor-pointer"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMonths(true)}
                className="flex-1 text-center font-bold text-base text-on-background hover:underline cursor-pointer"
              >
                {MONTHS[view.month].charAt(0).toUpperCase() + MONTHS[view.month].slice(1)} {view.year}
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/10 cursor-pointer"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-0.5">
              {WEEKDAYS.map((w) => (
                <span key={w} className="h-6 flex items-center justify-center text-xs font-semibold text-on-background/60">
                  {w}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: leadingBlanks }).map((_, i) => (
                <span key={`b${i}`} className="h-9" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDay === day;
                const isToday =
                  today.getFullYear() === view.year &&
                  today.getMonth() === view.month &&
                  today.getDate() === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => pickDay(day)}
                    className={`h-9 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary text-on-primary font-bold"
                        : isToday
                          ? "text-primary font-bold"
                          : "text-on-background hover:bg-black/10"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </>
        )
      )}
    </>
  );
};