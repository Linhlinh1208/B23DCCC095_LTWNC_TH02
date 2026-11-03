import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { MuscleGroup, Exercise } from '../types';
import { EXERCISES, GROUPS } from '../data/exercises';
import { useDebounce } from '../hooks/useDebounce';
import { ExerciseRow } from '../features/catalog/ExerciseRow';
import { removeVietnameseTones } from '../utils/format';
import { useSessionStore } from '../features/session/useSessionStore';
import { useSavedStore } from '../features/saved/useSavedStore';
import { useRoutines, useRoutineDispatch } from '../features/routines/RoutineContext';

export const CatalogPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'duration'>('default');

  const routines = useRoutines();
  const routineDispatch = useRoutineDispatch();
  const [activeRoutineId, setActiveRoutineId] = useState<string>('');

  const debouncedKeyword = useDebounce(keyword, 300);

  // Ràng buộc kỹ thuật bắt buộc: Tên hàm phải là handleKeywordShift
  const handleKeywordShift = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const filteredExercises = useMemo(() => {
    const rawKw = debouncedKeyword.trim().replace(/\s+/g, ' ').toLowerCase();
    const nonToneKw = removeVietnameseTones(rawKw);

    let result = EXERCISES;

    if (rawKw) {
      result = result.filter((ex) => {
        const nameLower = ex.name.normalize('NFC').toLowerCase();
        const trainerLower = ex.trainer.normalize('NFC').toLowerCase();
        const nameNonTone = removeVietnameseTones(nameLower);
        const trainerNonTone = removeVietnameseTones(trainerLower);

        return (
          nameLower.includes(rawKw) ||
          nameNonTone.includes(nonToneKw) ||
          trainerLower.includes(rawKw) ||
          trainerNonTone.includes(nonToneKw)
        );
      });
    }

    if (selectedGroup !== 'Tất cả') {
      result = result.filter((ex) => ex.group === selectedGroup);
    }

    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else if (sortBy === 'duration') {
      result = [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [debouncedKeyword, selectedGroup, sortBy]);

  const startSession = useSessionStore((s) => s.startSession);
  const addToSession = useSessionStore((s) => s.addToSession);
  const sessionQueue = useSessionStore((s) => s.queue);
  const savedIds = useSavedStore((s) => s.ids);
  const toggleSave = useSavedStore((s) => s.toggle);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  // Alert khi Bắt đầu
  const handleStart = useCallback(
    (exercise: Exercise, index: number) => {
      startSession(filteredExercises, index);
      alert(`Bắt đầu buổi tập với bài: "${exercise.name}"!`);
    },
    [filteredExercises, startSession]
  );

  // Alert khi thêm vào buổi tập
  const handleAddToSession = useCallback(
    (exercise: Exercise) => {
      const alreadyInSession = sessionQueue.some((item) => item.id === exercise.id);
      if (alreadyInSession) {
        alert(`Bài tập "${exercise.name}" đã có trong buổi tập rồi!`);
        return;
      }
      addToSession(exercise);
      alert(`Đã thêm "${exercise.name}" vào danh sách buổi tập!`);
    },
    [sessionQueue, addToSession]
  );

  // Alert khi lưu / bỏ lưu bài tập
  const handleToggleSaveWithAlert = useCallback(
    (id: string) => {
      const currentlySaved = savedIds.includes(id);
      toggleSave(id);
      if (currentlySaved) {
        alert('Đã bỏ lưu bài tập!');
      } else {
        alert('Đã lưu bài tập vào danh sách yêu thích!');
      }
    },
    [savedIds, toggleSave]
  );

  // Alert khi thêm vào giáo án
  const handleAddToRoutine = useCallback(
    (exerciseId: string) => {
      const currentTargetId = activeRoutineId || routines[0]?.id;
      if (!currentTargetId) {
        alert('Vui lòng sang trang "Giáo án" tạo ít nhất 1 giáo án trước!');
        return;
      }

      const targetRoutine = routines.find((r) => r.id === currentTargetId);
      const exObj = EXERCISES.find((e) => e.id === exerciseId);
      const exName = exObj ? exObj.name : exerciseId;

      if (targetRoutine?.exerciseIds.includes(exerciseId)) {
        alert(`Bài tập "${exName}" đã có sẵn trong giáo án "${targetRoutine.name}" rồi!`);
        return;
      }

      routineDispatch({
        type: 'addExercise',
        payload: { routineId: currentTargetId, exerciseId },
      });
      alert(`Đã thêm "${exName}" vào giáo án "${targetRoutine?.name}"!`);
    },
    [activeRoutineId, routines, routineDispatch]
  );

  const itemData = useMemo(
    () => ({
      items: filteredExercises,
      onStart: handleStart,
      onToggleSave: handleToggleSaveWithAlert,
      onAddToSession: handleAddToSession,
      onAddToRoutine: handleAddToRoutine,
      isSaved,
    }),
    [filteredExercises, handleStart, handleToggleSaveWithAlert, handleAddToSession, handleAddToRoutine, isSaved]
  );

  return (
    <div className="catalog-page" style={{ padding: '1rem', paddingBottom: '80px' }}>
      <h2>Kho bài tập</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label htmlFor="search-input" style={{ fontWeight: 600 }}>Tìm kiếm: </label>
          <input
            id="search-input"
            type="text"
            placeholder="Tìm theo tên bài hoặc HLV..."
            value={keyword}
            onChange={handleKeywordShift}
            style={{ padding: '6px 10px', minWidth: '200px' }}
          />
        </div>

        <div>
          <label htmlFor="group-select" style={{ fontWeight: 600 }}>Nhóm cơ: </label>
          <select
            id="group-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            style={{ padding: '6px 8px' }}
          >
            <option value="Tất cả">Tất cả</option>
            {GROUPS.map((g: MuscleGroup) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort-select" style={{ fontWeight: 600 }}>Sắp xếp: </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'default' | 'name' | 'duration')}
            style={{ padding: '6px 8px' }}
          >
            <option value="default">Mặc định</option>
            <option value="name">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </div>

        {routines.length > 0 && (
          <div>
            <label htmlFor="target-routine" style={{ fontWeight: 600, color: '#2563eb' }}>
              Giáo án đang chọn: 
            </label>{' '}
            <select
              id="target-routine"
              value={activeRoutineId || routines[0]?.id}
              onChange={(e) => setActiveRoutineId(e.target.value)}
              style={{ padding: '6px 8px', fontWeight: 600 }}
            >
              {routines.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <p style={{ fontWeight: 'bold', margin: '0.75rem 0' }}>
        {filteredExercises.length > 0
          ? `Tìm thấy ${filteredExercises.length} bài tập`
          : 'Không tìm thấy bài tập nào'}
      </p>

      {/* Hàng Tiêu Đề Cột Kho Bài Tập */}
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
        <div style={{ width: '50px', flexShrink: 0 }}>STT</div>
        <div style={{ flex: '2', paddingRight: '0.75rem' }}>Tên bài tập</div>
        <div style={{ flex: '1.5', paddingRight: '0.75rem' }}>Huấn luyện viên</div>
        <div style={{ width: '80px', flexShrink: 0 }}>Nhóm cơ</div>
        <div style={{ width: '70px', flexShrink: 0 }}>Thời lượng</div>
        <div style={{ width: '300px', flexShrink: 0, textAlign: 'right' }}>Thao tác</div>
      </div>

      {filteredExercises.length > 0 && (
        <List
          height={560}
          itemCount={filteredExercises.length}
          itemSize={56}
          width="100%"
          itemKey={(index) => filteredExercises[index].id}
          itemData={itemData}
        >
          {ExerciseRow}
        </List>
      )}
    </div>
  );
};