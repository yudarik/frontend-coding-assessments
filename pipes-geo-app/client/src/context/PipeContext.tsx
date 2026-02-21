import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { Pipe } from "../types";

// All application state lives in a single object. Any change to pipes, loading,
// or selectedTag causes a full re-render of every consumer of this context.
interface AppState {
  pipes: Pipe[];
  selectedTag: string | null;
  loading: boolean;
}

interface PipeContextValue {
  state: AppState;
  setPipes: (pipes: Pipe[]) => void;
  setSelectedTag: (tag: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const PipeContext = createContext<PipeContextValue | null>(null);

export const PipeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>({
    pipes: [],
    selectedTag: null,
    loading: false,
  });

  const setPipes = useCallback((pipes: Pipe[]) =>
    setState((prev) => ({ ...prev, pipes })), []);

  const setSelectedTag = useCallback((selectedTag: string | null) =>
    setState((prev) => ({ ...prev, selectedTag })), []);

  const setLoading = useCallback((loading: boolean) =>
    setState((prev) => ({ ...prev, loading })), []);

  // Memoize the context value to prevent unnecessary re-renders
  const value: PipeContextValue = useMemo(() => ({
    state,
    setPipes,
    setSelectedTag,
    setLoading,
  }), [state, setPipes, setSelectedTag, setLoading]);

  return <PipeContext.Provider value={value}>{children}</PipeContext.Provider>;
};

export const usePipeContext = (): PipeContextValue => {
  const ctx = useContext(PipeContext);
  if (!ctx) throw new Error("usePipeContext must be used inside PipeProvider");
  return ctx;
};

export default PipeContext;
