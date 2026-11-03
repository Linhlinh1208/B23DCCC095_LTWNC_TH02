import React from 'react';
import type { CSSProperties } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

interface ExerciseRowProps {
  index: number;
  style: CSSProperties;
  data: {
    items: Exercise[];
    onStart?: (exercise: Exercise, index: number) => void;
    onToggleSave?: (id: string) => void;
    onAddToSession?: (exercise: Exercise) => void;
  };
}

const ExerciseRowComponent: React.FC<ExerciseRowProps> = ({ index, style, data }) => {
  const exercise = data.items[index];
  if (!exercise) return null;

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
      <div style={{ width: '60px', color: '#6b7280', flexShrink: 0 }}>
        {index + 1}
      </div>

      <div style={{ flex: '2', paddingRight: '1rem', fontWeight: 600, color: '#111827' }}>
        {exercise.name}
      </div>

      <div style={{ flex: '1.5', paddingRight: '1rem', color: '#374151' }}>
        {exercise.trainer}
      </div>

      <div style={{ width: '100px', flexShrink: 0 }}>
        <span
          style={{
            background: '#e0e7ff',
            color: '#3730a3',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          {exercise.group}
        </span>
      </div>

      <div style={{ width: '100px', flexShrink: 0, fontWeight: 600, color: '#2563eb' }}>
        {formatDuration(exercise.duration)}
      </div>

      <div style={{ width: '220px', flexShrink: 0, display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => data.onStart?.(exercise, index)}
          style={{ padding: '4px 8px', cursor: 'pointer' }}
        >
          Bắt đầu
        </button>
        <button
          type="button"
          aria-label="Lưu bài tập"
          onClick={() => data.onToggleSave?.(exercise.id)}
          style={{ padding: '4px 8px', cursor: 'pointer' }}
        >
          ☆
        </button>
        <button
          type="button"
          onClick={() => data.onAddToSession?.(exercise)}
          style={{ padding: '4px 8px', cursor: 'pointer' }}
        >
          + Buổi tập
        </button>
      </div>
    </div>
  );
};

export const ExerciseRow = React.memo(ExerciseRowComponent);