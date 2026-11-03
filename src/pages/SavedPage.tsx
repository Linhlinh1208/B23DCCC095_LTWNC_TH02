import React from 'react';
import { useSavedStore } from '../features/saved/useSavedStore';
import { useSessionStore } from '../features/session/useSessionStore';
import { EXERCISES } from '../data/exercises';
import { formatDuration } from '../utils/format';

export const SavedPage: React.FC = () => {
  const savedIds = useSavedStore((s) => s.ids);
  const toggleSave = useSavedStore((s) => s.toggle);
  const startSession = useSessionStore((s) => s.startSession);

  const savedExercises = EXERCISES.filter((ex) => savedIds.includes(ex.id));

  const handleStartAll = () => {
    if (savedExercises.length > 0) {
      startSession(savedExercises, 0);
    }
  };

  return (
    <div className="saved-page" style={{ padding: '1rem', paddingBottom: '80px' }}>
      <h2>Bài tập đã lưu</h2>

      {savedExercises.length === 0 ? (
        <p style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
          Bạn chưa lưu bài tập nào
        </p>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>
              Tổng số: {savedExercises.length} bài đã lưu
            </span>
            <button
              type="button"
              onClick={handleStartAll}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Tập tất cả
            </button>
          </div>

          {/* Hàng Tiêu Đề Cột */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              background: '#f3f4f6',
              borderTop: '1px solid #d1d5db',
              borderBottom: '2px solid #9ca3af',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              color: '#374151',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ width: '60px', flexShrink: 0 }}>STT</div>
            <div style={{ flex: '2', paddingRight: '1rem' }}>Tên bài tập</div>
            <div style={{ flex: '1.5', paddingRight: '1rem' }}>Huấn luyện viên</div>
            <div style={{ width: '100px', flexShrink: 0 }}>Nhóm cơ</div>
            <div style={{ width: '100px', flexShrink: 0 }}>Thời lượng</div>
            <div style={{ width: '160px', flexShrink: 0, textAlign: 'right' }}>Thao tác</div>
          </div>

          {/* Danh sách bài tập đã lưu */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {savedExercises.map((ex, index) => (
              <li
                key={ex.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #e5e7eb',
                  boxSizing: 'border-box',
                  fontSize: '0.95rem',
                }}
              >
                <div style={{ width: '60px', color: '#6b7280', flexShrink: 0 }}>
                  {index + 1}
                </div>

                <div style={{ flex: '2', paddingRight: '1rem', fontWeight: 600, color: '#111827' }}>
                  {ex.name}
                </div>

                <div style={{ flex: '1.5', paddingRight: '1rem', color: '#374151' }}>
                  {ex.trainer}
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
                    {ex.group}
                  </span>
                </div>

                <div style={{ width: '100px', flexShrink: 0, fontWeight: 600, color: '#2563eb' }}>
                  {formatDuration(ex.duration)}
                </div>

                <div
                  style={{
                    width: '160px',
                    flexShrink: 0,
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => startSession([ex], 0)}
                    style={{ padding: '4px 8px', cursor: 'pointer' }}
                  >
                    Bắt đầu
                  </button>
                  <button
                    type="button"
                    aria-label="Bỏ lưu"
                    onClick={() => toggleSave(ex.id)}
                    style={{
                      padding: '4px 8px',
                      cursor: 'pointer',
                      color: '#eab308',
                      fontSize: '1rem',
                    }}
                  >
                    ★
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};