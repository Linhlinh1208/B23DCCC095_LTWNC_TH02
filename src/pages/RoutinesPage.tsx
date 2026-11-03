import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRoutines, useRoutineDispatch } from '../features/routines/RoutineContext';

export const RoutinesPage: React.FC = () => {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMessage('Tên giáo án không được để trống');
      return;
    }

    const isDuplicate = routines.some(
      (r) => r.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMessage('Tên giáo án đã tồn tại');
      return;
    }

    setErrorMessage('');
    dispatch({ type: 'create', payload: { name: trimmed } });
    setNameInput('');
    alert(`Đã tạo thành công giáo án: "${trimmed}"!`);
  };

  const handleRemove = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa giáo án "${name}" không?`)) {
      dispatch({ type: 'remove', payload: { id } });
      alert(`Đã xóa giáo án "${name}"!`);
    }
  };

  return (
    <div className="routines-page" style={{ padding: '1rem', paddingBottom: '80px' }}>
      <h2>Danh sách giáo án</h2>

      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', maxWidth: '420px' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Nhập tên giáo án..."
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            style={{ padding: '8px 12px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Tạo giáo án
          </button>
        </div>

        {errorMessage && (
          <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.9rem' }}>
            {errorMessage}
          </span>
        )}
      </form>

      {routines.length === 0 ? (
        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
          Chưa có giáo án nào. Hãy tạo giáo án đầu tiên!
        </p>
      ) : (
        <>
          {/* Header Bảng Giáo Án */}
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
            <div style={{ flex: '3', paddingRight: '1rem' }}>Tên giáo án</div>
            <div style={{ flex: '1.5', paddingRight: '1rem' }}>Số lượng bài tập</div>
            <div style={{ width: '160px', flexShrink: 0, textAlign: 'right' }}>Thao tác</div>
          </div>

          {/* Danh sách Giáo án */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {routines.map((r, index) => (
              <li
                key={r.id}
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

                <div style={{ flex: '3', paddingRight: '1rem' }}>
                  <Link
                    to={`/routines/${r.id}`}
                    style={{
                      color: '#2563eb',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: '1.05rem',
                    }}
                  >
                    {r.name}
                  </Link>
                </div>

                <div style={{ flex: '1.5', paddingRight: '1rem', color: '#4b5563', fontWeight: 500 }}>
                  {r.exerciseIds.length} bài tập
                </div>

                {/* Cột Thao tác: Gồm nút View và Xóa */}
                <div style={{ width: '160px', flexShrink: 0, display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/routines/${r.id}`)}
                    style={{
                      padding: '5px 12px',
                      backgroundColor: '#0284c7',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(r.id, r.name)}
                    style={{
                      padding: '5px 12px',
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Xóa
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