import React, { createContext, useContext } from "react";

export interface DropdownTheme {
  background: string;
  borderColor: string;
  borderWidth: number;
  radius: number;
}

export const DEFAULT_DROPDOWN_THEME: DropdownTheme = {
  background: "#bfdbfe",
  borderColor: "#93c5fd",
  borderWidth: 2,
  radius: 12,
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
  };
}
