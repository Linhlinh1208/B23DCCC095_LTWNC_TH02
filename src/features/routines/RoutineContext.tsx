import React, { createContext, useContext, useReducer, useEffect, useMemo, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Routine } from '../../types';
import { routineReducer, initialRoutines } from './routineReducer';
import type { RoutineAction } from './routineReducer';

const RoutineStateContext = createContext<Routine[] | undefined>(undefined);
const RoutineDispatchContext = createContext<React.Dispatch<RoutineAction> | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'workout-routines';

export const RoutineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, rawDispatch] = useReducer(routineReducer, initialRoutines, () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialRoutines;
    } catch {
      return initialRoutines;
    }
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Custom middleware logger ghi lại action và state trước/sau vào Console
  const dispatch = useCallback((action: RoutineAction) => {
    const prevState = stateRef.current;
    console.group(`[Routine Action]: ${action.type}`);
    console.log('Action payload:', 'payload' in action ? action.payload : action);
    console.log('State trước:', prevState);
    rawDispatch(action);
  }, []);

  useEffect(() => {
    console.log('State sau:', state);
    console.groupEnd();
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const memoizedState = useMemo(() => state, [state]);

  return (
    <RoutineStateContext.Provider value={memoizedState}>
      <RoutineDispatchContext.Provider value={dispatch}>
        {children}
      </RoutineDispatchContext.Provider>
    </RoutineStateContext.Provider>
  );
};

export function useRoutines(): Routine[] {
  const ctx = useContext(RoutineStateContext);
  if (!ctx) throw new Error('useRoutines must be used within RoutineProvider');
  return ctx;
}

export function useRoutineDispatch(): React.Dispatch<RoutineAction> {
  const ctx = useContext(RoutineDispatchContext);
  if (!ctx) throw new Error('useRoutineDispatch must be used within RoutineProvider');
  return ctx;
}