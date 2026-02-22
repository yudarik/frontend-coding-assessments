import React, { createContext, useContext, useState } from "react";
import { Pipe } from "../types";

// All application state lives in a single object. Any change to pipes, loading,
// or selectedTag causes a full re-render of every consumer of this context.
interface AppState {
  pipes: Pipe[];
  selectedTag: string | null;
  loading: boolean;
  measurementMode: boolean;
  selectedPipeIds: number[];
}

interface PipeContextValue {
  state: AppState;
  setPipes: (pipes: Pipe[]) => void;
  setSelectedTag: (tag: string | null) => void;
  setLoading: (loading: boolean) => void;
  setMeasurementMode: (enabled: boolean) => void;
  togglePipeSelection: (pipeId: number) => void;
  clearPipeSelection: () => void;
}

const PipeContext = createContext<PipeContextValue | null>(null);

export const PipeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>({
    pipes: [],
    selectedTag: null,
    loading: false,
    measurementMode: false,
    selectedPipeIds: [],
  });

  const setPipes = (pipes: Pipe[]) =>
    setState((prev) => ({ ...prev, pipes }));

  const setSelectedTag = (selectedTag: string | null) =>
    setState((prev) => ({ ...prev, selectedTag }));

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading }));

  const setMeasurementMode = (enabled: boolean) =>
    setState((prev) => ({ ...prev, measurementMode: enabled, selectedPipeIds: enabled ? prev.selectedPipeIds : [] }));

  const togglePipeSelection = (pipeId: number) =>
    setState((prev) => ({
      ...prev,
      selectedPipeIds: prev.selectedPipeIds.includes(pipeId)
        ? prev.selectedPipeIds.filter((id) => id !== pipeId)
        : [...prev.selectedPipeIds, pipeId],
    }));

  const clearPipeSelection = () =>
    setState((prev) => ({ ...prev, selectedPipeIds: [] }));

  // A new object literal is created on every render — no useMemo here.
  // Every call to setPipes, setLoading, or setSelectedTag causes ALL
  // context consumers to re-render, even if their relevant slice of state
  // hasn't changed.
  const value: PipeContextValue = {
    state,
    setPipes,
    setSelectedTag,
    setLoading,
    setMeasurementMode,
    togglePipeSelection,
    clearPipeSelection,
  };

  return <PipeContext.Provider value={value}>{children}</PipeContext.Provider>;
};

export const usePipeContext = (): PipeContextValue => {
  const ctx = useContext(PipeContext);
  if (!ctx) throw new Error("usePipeContext must be used inside PipeProvider");
  return ctx;
};

export default PipeContext;
