import React from 'react';
import type { CSSProperties } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

interface ExerciseRowProps {
  index: number;
  style: CSSProperties;
  data: {
    items: Exercise[];
    onStart: (exercise: Exercise, index: number) => void;
    onToggleSave: (id: string) => void;
    onAddToSession: (exercise: Exercise) => void;
    onAddToRoutine: (exerciseId: string) => void;
    isSaved: (id: string) => boolean;
  };
}

const ExerciseRowComponent: React.FC<ExerciseRowProps> = ({ index, style, data }) => {
  const exercise = data.items[index];
  if (!exercise) return null;

  const saved = data.isSaved(exercise.id);

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        borderBottom: '1px solid #e5e7eb',
        boxSizing: 'border-box',
        fontSize: '0.95rem',
      }}
      className="exercise-row"
    >
      <div style={{ width: '50px', color: '#6b7280', flexShrink: 0 }}>
        {index + 1}
      </div>

      <div style={{ flex: '2', paddingRight: '0.75rem', fontWeight: 600, color: '#111827' }}>
        {exercise.name}
      </div>

      <div style={{ flex: '1.5', paddingRight: '0.75rem', color: '#374151' }}>
        {exercise.trainer}
      </div>

      <div style={{ width: '80px', flexShrink: 0 }}>
        <span
          style={{
            background: '#e0e7ff',
            color: '#3730a3',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          {exercise.group}
        </span>
      </div>

      <div style={{ width: '70px', flexShrink: 0, fontWeight: 600, color: '#2563eb' }}>
        {formatDuration(exercise.duration)}
      </div>

      <div style={{ width: '300px', flexShrink: 0, display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
        
        <button type="button" onClick={() => data.onStart(exercise, index)} style={{ padding: '4px 6px' }}>
          Bắt đầu
        </button>
        <button
          type="button"
          aria-label={saved ? 'Bỏ lưu' : 'Lưu bài tập'}
          onClick={() => data.onToggleSave(exercise.id)}
          style={{ padding: '4px 6px', color: saved ? '#eab308' : '#6b7280' }}
        >
          {saved ? '★' : '☆'}
        </button>
        <button type="button" onClick={() => data.onAddToSession(exercise)} style={{ padding: '4px 6px' }}>
          + Buổi tập
        </button>
        <button type="button" onClick={() => data.onAddToRoutine(exercise.id)} style={{ padding: '4px 6px' }}>
          + Giáo án
        </button>
      </div>
    </div>
  );
};

export const ExerciseRow = React.memo(ExerciseRowComponent);