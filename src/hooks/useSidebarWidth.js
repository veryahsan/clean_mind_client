import { useState, useCallback } from "react";

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_SIDEBAR_WIDTH = 256;

export const useSidebarWidth = () => {
  const [width, setWidth] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_SIDEBAR_WIDTH;
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_SIDEBAR_WIDTH;
  });

  const updateWidth = useCallback((newWidth) => {
    setWidth(newWidth);
    localStorage.setItem(SIDEBAR_WIDTH_KEY, newWidth.toString());
  }, []);

  return [width, updateWidth];
};
