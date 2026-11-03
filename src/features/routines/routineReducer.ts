import type { Routine } from '../../types';

export type RoutineAction =
  | { type: 'create'; payload: { name: string } }
  | { type: 'rename'; payload: { id: string; name: string } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'addExercise'; payload: { routineId: string; exerciseId: string } }
  | { type: 'removeExercise'; payload: { routineId: string; exerciseId: string } };

export const initialRoutines: Routine[] = [];

export function routineReducer(state: Routine[], action: RoutineAction): Routine[] {
  switch (action.type) {
    case 'create': {
      const trimmed = action.payload.name.trim();
      if (!trimmed) return state;
      // Chặn trùng tên không phân biệt hoa thường
      const isExist = state.some(
        (r) => r.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (isExist) return state;

      return [
        ...state,
        {
          id: `routine_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: trimmed,
          exerciseIds: [],
        },
      ];
    }

    case 'rename': {
      const trimmed = action.payload.name.trim();
      if (!trimmed) return state;
      const isExist = state.some(
        (r) => r.id !== action.payload.id && r.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (isExist) return state;

      return state.map((r) =>
        r.id === action.payload.id ? { ...r, name: trimmed } : r
      );
    }

    case 'remove':
      return state.filter((r) => r.id !== action.payload.id);

    case 'addExercise':
      return state.map((r) => {
        if (r.id !== action.payload.routineId) return r;
        if (r.exerciseIds.includes(action.payload.exerciseId)) return r; // Không thêm trùng
        return { ...r, exerciseIds: [...r.exerciseIds, action.payload.exerciseId] };
      });

    case 'removeExercise':
      return state.map((r) => {
        if (r.id !== action.payload.routineId) return r;
        return {
          ...r,
          exerciseIds: r.exerciseIds.filter((id) => id !== action.payload.exerciseId),
        };
      });

    default:
      return state;
  }
}