import React, { createContext, useContext } from "react";

export interface DropdownTheme {
  background: string;
  borderColor: string;
  borderWidth: number;
  radius: number;
  textColor: string;
  rowHeight: number;
}

export const DEFAULT_DROPDOWN_THEME: DropdownTheme = {
  background: "#bfdbfe",
  borderColor: "#93c5fd",
  borderWidth: 2,
  radius: 12,
  textColor: "#1f2937",
  rowHeight: 44,
};

const DropdownThemeContext = createContext<DropdownTheme>(DEFAULT_DROPDOWN_THEME);

export const DropdownThemeProvider: React.FC<{
  value: DropdownTheme;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <DropdownThemeContext.Provider value={value}>{children}</DropdownThemeContext.Provider>
);

export function useDropdownTheme(): DropdownTheme {
  return useContext(DropdownThemeContext);
}

export function dropdownPanelStyle(theme: DropdownTheme): React.CSSProperties {
  return {
    backgroundColor: theme.background,
    borderColor: theme.borderColor,
    borderWidth: theme.borderWidth,
    borderRadius: theme.radius,
    borderStyle: "solid",
    color: theme.textColor,
  };
}

export function dropdownRowStyle(theme: DropdownTheme): React.CSSProperties {
  return {
    color: theme.textColor,
    height: theme.rowHeight,
  };
}
