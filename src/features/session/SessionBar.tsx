import React, { useEffect } from 'react';
import { useSessionStore } from './useSessionStore';
import { CountdownBar } from './CountdownBar';

export const SessionBar: React.FC = () => {
  // Từng selector riêng biệt chống render thừa
  const isRunning = useSessionStore((s) => s.isRunning);
  const queueLength = useSessionStore((s) => s.queue.length);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const currentExercise = useSessionStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );

  const toggleRun = useSessionStore((s) => s.toggleRun);
  const next = useSessionStore((s) => s.next);
  const prev = useSessionStore((s) => s.prev);
  const tick = useSessionStore((s) => s.tick);

  // Đồng hồ chạy từng giây khi isRunning = true
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, tick]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#1f2937',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.15)',
        zIndex: 1000,
        boxSizing: 'border-box',
      }}
    >
      {/* Thông tin bài tập đang chạy */}
      <div style={{ flex: 1, minWidth: '220px' }}>
        {currentExercise ? (
          <div>
            <span style={{ fontWeight: 600, color: '#f3f4f6' }}>
              Đang tập: {currentExercise.name} – HLV {currentExercise.trainer}
            </span>
          </div>
        ) : (
          <span style={{ color: '#9ca3af' }}>Chưa bắt đầu buổi tập</span>
        )}
      </div>

      {/* Component đếm giây tách rời */}
      {currentExercise && <CountdownBar />}

      {/* Cụm nút điều khiển */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <button
          type="button"
          onClick={prev}
          disabled={currentIndex < 0}
          style={{ padding: '6px 12px', cursor: 'pointer' }}
        >
          Trước
        </button>

        <button
          type="button"
          onClick={toggleRun}
          disabled={currentIndex < 0}
          style={{
            padding: '6px 14px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: isRunning ? '#eab308' : '#22c55e',
            color: '#111827',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
        </button>

        <button
          type="button"
          onClick={next}
          disabled={currentIndex < 0 || currentIndex >= queueLength - 1}
          style={{ padding: '6px 12px', cursor: 'pointer' }}
        >
          Sau
        </button>

        <span style={{ fontSize: '0.9rem', color: '#d1d5db', marginLeft: '0.5rem' }}>
          Buổi tập: {queueLength} bài
        </span>
      </div>
    </div>
  );
};