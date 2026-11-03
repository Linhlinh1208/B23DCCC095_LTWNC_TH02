import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRoutines, useRoutineDispatch } from '../features/routines/RoutineContext';
import { useSessionStore } from '../features/session/useSessionStore';
import { EXERCISES } from '../data/exercises';
import { formatDuration, formatRoutineTotalTime } from '../utils/format';

export const RoutineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const startSession = useSessionStore((s) => s.startSession);

  const routine = routines.find((r) => r.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [selectedExId, setSelectedExId] = useState(EXERCISES[0]?.id || '');

  if (!routine) {
    return (
      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#ef4444', fontWeight: 600 }}>Không tìm thấy giáo án!</p>
        <Link to="/routines" style={{ color: '#2563eb' }}>&larr; Quay lại danh sách giáo án</Link>
      </div>
    );
  }

  // Danh sách bài tập thuộc giáo án này
  const routineExercises = routine.exerciseIds
    .map((exId) => EXERCISES.find((e) => e.id === exId))
    .filter((e): e is typeof EXERCISES[0] => e !== undefined);

  // Tính tổng số giây
  const totalSeconds = routineExercises.reduce((sum, e) => sum + e.duration, 0);

  // Xử lý đổi tên giáo án
  const handleStartEdit = () => {
    setEditName(routine.name);
    setIsEditing(true);
  };

  const handleSaveRename = () => {
    const trimmed = editName.trim();
    if (!trimmed) {
      alert('Tên giáo án không được để trống!');
      return;
    }
    const isDuplicate = routines.some(
      (r) => r.id !== routine.id && r.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      alert('Tên giáo án đã tồn tại, vui lòng chọn tên khác!');
      return;
    }
    dispatch({ type: 'rename', payload: { id: routine.id, name: trimmed } });
    setIsEditing(false);
    alert(`Đã đổi tên giáo án thành: "${trimmed}"!`);
  };

  // Xử lý thêm bài tập vào giáo án
  const handleAddExercise = () => {
    if (!selectedExId) return;
    const exObj = EXERCISES.find((e) => e.id === selectedExId);
    const exName = exObj ? exObj.name : selectedExId;

    if (routine.exerciseIds.includes(selectedExId)) {
      alert(`Bài tập "${exName}" đã có trong giáo án này rồi!`);
      return;
    }

    dispatch({
      type: 'addExercise',
      payload: { routineId: routine.id, exerciseId: selectedExId },
    });
    alert(`Đã thêm bài tập "${exName}" vào giáo án "${routine.name}"!`);
  };

  // Xử lý xóa bài tập khỏi giáo án
  const handleRemoveExercise = (exId: string, exName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài "${exName}" khỏi giáo án "${routine.name}" không?`)) {
      dispatch({
        type: 'removeExercise',
        payload: { routineId: routine.id, exerciseId: exId },
      });
      alert(`Đã xóa bài "${exName}" khỏi giáo án!`);
    }
  };

  // Xử lý Tập tất cả
  const handleStartAll = () => {
    if (routineExercises.length === 0) {
      alert('Giáo án chưa có bài tập nào để bắt đầu!');
      return;
    }
    startSession(routineExercises, 0);
    alert(`Bắt đầu buổi tập theo giáo án "${routine.name}" (${routineExercises.length} bài)!`);
  };

  return (
    <div className="routine-detail-page" style={{ padding: '1rem', paddingBottom: '80px' }}>
      <Link to="/routines" style={{ textDecoration: 'none', color: '#2563eb', fontSize: '0.9rem' }}>
        &larr; Quay lại danh sách giáo án
      </Link>

      {/* Tiêu đề & Đổi tên */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button
              type="button"
              onClick={handleSaveRename}
              style={{ padding: '6px 12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{ padding: '6px 12px', background: '#9ca3af', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Hủy
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ margin: 0 }}>Giáo án: {routine.name}</h2>
            <button
              type="button"
              onClick={handleStartEdit}
              style={{ padding: '4px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              Đổi tên
            </button>
          </>
        )}
      </div>

      {/* Thông tin số bài, tổng thời gian và nút Tập tất cả */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          disabled={routineExercises.length === 0}
          onClick={handleStartAll}
          style={{
            padding: '8px 18px',
            backgroundColor: routineExercises.length > 0 ? '#2563eb' : '#9ca3af',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            cursor: routineExercises.length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Tập tất cả
        </button>

        <span style={{ fontWeight: 600, fontSize: '1rem', color: '#374151' }}>
          Tổng thời gian: {formatRoutineTotalTime(totalSeconds)}
        </span>
      </div>

      {/* Khối thêm bài tập vào giáo án */}
      <div
        style={{
          background: '#f9fafb',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          marginBottom: '1.5rem',
        }}
      >
        <label htmlFor="select-ex" style={{ fontWeight: 600, marginRight: '8px', color: '#111827' }}>
          Thêm bài tập từ kho:
        </label>
        <select
          id="select-ex"
          value={selectedExId}
          onChange={(e) => setSelectedExId(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', maxWidth: '350px' }}
        >
          {EXERCISES.slice(0, 100).map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name} – {ex.trainer} [{ex.group}] ({formatDuration(ex.duration)})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddExercise}
          style={{
            marginLeft: '0.75rem',
            padding: '6px 14px',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          + Thêm vào giáo án
        </button>
      </div>

      <h3 style={{ marginBottom: '0.75rem' }}>Danh sách bài tập ({routineExercises.length})</h3>

      {routineExercises.length === 0 ? (
        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
          Chưa có bài tập nào trong giáo án này. Hãy thêm bài tập ở trên!
        </p>
      ) : (
        <>
          {/* Hàng Tiêu Đề Cột Bảng Bài Tập */}
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

          {/* Danh sách bài tập */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {routineExercises.map((ex, idx) => (
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
                  {idx + 1}
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
                <div style={{ width: '100px', flexShrink: 0, color: '#2563eb', fontWeight: 600 }}>
                  {formatDuration(ex.duration)}
                </div>
                <div style={{ width: '160px', flexShrink: 0, textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(ex.id, ex.name)}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Xóa khỏi giáo án
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