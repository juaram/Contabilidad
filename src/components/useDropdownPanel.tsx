import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DropPanelPosition {
  top: number;
  left: number;
  width: number;
}

export interface UseDropdownPanel {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  close: () => void;
  openPanel: (height: number, widthFactor?: number) => void;
  renderPortal: (
    panelStyle: React.CSSProperties,
    className: string,
    children: React.ReactNode
  ) => React.ReactPortal | null;
}

export function useDropdownPanel(): UseDropdownPanel {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<DropPanelPosition | null>(null);
  const heightRef = useRef(320);
  const widthFactorRef = useRef(1);

  const computePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const pad = 8;
    const width = Math.min(rect.width * widthFactorRef.current, window.innerWidth - pad * 2);
    const height = heightRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = Math.max(pad, Math.min(rect.left, Math.max(vw - width - pad, pad)));
    let top = rect.bottom + 6;
    if (top + height > vh - pad && rect.top - height - 6 > pad) {
      top = rect.top - height - 6;
    }
    setPos({ top, left, width });
  }, []);

  useEffect(() => {
    if (open) computePosition();
  }, [open, computePosition]);
  

  const close = useCallback(() => setOpen(false), []);
  const openPanel = useCallback((height: number, widthFactor = 1) => {
    heightRef.current = height;
    widthFactorRef.current = widthFactor;
    setPos(null);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onRaf = () => computePosition();
    const raf = requestAnimationFrame(onRaf);

    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    const onMouseDown = (e: MouseEvent) => {
      const node = e.target as Node | null;
      if (!node) return;
      if (anchorRef.current && anchorRef.current.contains(node)) return;
      if (panelRef.current && panelRef.current.contains(node)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, computePosition]);

  const renderPortal = useCallback(
    (panelStyle: React.CSSProperties, className: string, children: React.ReactNode) => {
      if (!open || !pos) return null;
      return createPortal(
        <div
          ref={panelRef}
          style={{ ...panelStyle, position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 1000 }}
          className={`shadow-xl ${className}`}
        >
          {children}
        </div>,
        document.body
      );
    },
    [open, pos]
  );

  return { anchorRef, open, close, openPanel, renderPortal };
}