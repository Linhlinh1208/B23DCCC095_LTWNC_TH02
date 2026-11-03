import React from 'react';
import { useSessionStore } from './useSessionStore';
import { formatDuration } from '../../utils/format';

export const CountdownBar: React.FC = () => {
  // Chỉ hook này đọc biến elapsed
  const elapsed = useSessionStore((s) => s.elapsed);
  const currentExercise = useSessionStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );

  if (!currentExercise) return null;

  const remaining = Math.max(0, currentExercise.duration - elapsed);
  const percentage = Math.min(
    100,
    Math.round((elapsed / currentExercise.duration) * 100)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
        Còn lại: {formatDuration(remaining)}
      </span>
      <div
        style={{
          width: '180px',
          height: '8px',
          background: '#4b5563',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: '#22c55e',
            transition: 'width 0.2s linear',
          }}
        />
      </div>
    </div>
  );
};