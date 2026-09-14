import { useCallback, useState } from "react";

export function useHistory<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);

  const commit = useCallback((next: T) => {
    setPast((items) => [...items, present]);
    setPresent(next);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    setPast((items) => {
      if (!items.length) return items;
      const previous = items[items.length - 1];
      setFuture((itemsFuture) => [present, ...itemsFuture]);
      setPresent(previous);
      return items.slice(0, -1);
    });
  }, [present]);

  const redo = useCallback(() => {
    setFuture((items) => {
      if (!items.length) return items;
      const next = items[0];
      setPast((itemsPast) => [...itemsPast, present]);
      setPresent(next);
      return items.slice(1);
    });
  }, [present]);

  const reset = useCallback((next: T) => {
    setPast([]);
    setPresent(next);
    setFuture([]);
  }, []);

  return { past, present, future, commit, undo, redo, reset, canUndo: past.length > 0, canRedo: future.length > 0 };
}
