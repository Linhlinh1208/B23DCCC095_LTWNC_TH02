import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { MuscleGroup, Exercise } from '../types';
import { EXERCISES, GROUPS } from '../data/exercises';
import { useDebounce } from '../hooks/useDebounce';
import { ExerciseRow } from '../features/catalog/ExerciseRow';
import { removeVietnameseTones } from '../utils/format';

export const CatalogPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'duration'>('default');

  // Debounce 300ms
  const debouncedKeyword = useDebounce(keyword, 300);

  // Ràng buộc kỹ thuật bắt buộc: Tên hàm phải là handleKeywordShift
  const handleKeywordShift = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  // LOGIC LỌC TỐI ƯU TOÀN DIỆN
  const filteredExercises = useMemo(() => {
    // 1. Chuẩn hóa chuỗi tìm kiếm: xóa khoảng trắng thừa, đưa về chữ thường
    const rawKw = debouncedKeyword.trim().replace(/\s+/g, ' ').toLowerCase();

    // 2. Tạo thêm bản không dấu của từ khóa tìm kiếm
    const nonToneKw = removeVietnameseTones(rawKw);

    let result = EXERCISES;

    if (rawKw) {
      result = result.filter((ex) => {
        // Chuẩn hóa tên bài và HLV sang thường và NFC
        const nameLower = ex.name.normalize('NFC').toLowerCase();
        const trainerLower = ex.trainer.normalize('NFC').toLowerCase();

        // Bản không dấu của dữ liệu
        const nameNonTone = removeVietnameseTones(nameLower);
        const trainerNonTone = removeVietnameseTones(trainerLower);

        // Khớp có dấu HOẶC khớp không dấu
        const matchName = nameLower.includes(rawKw) || nameNonTone.includes(nonToneKw);
        const matchTrainer = trainerLower.includes(rawKw) || trainerNonTone.includes(nonToneKw);

        return matchName || matchTrainer;
      });
    }

    // Lọc theo nhóm cơ
    if (selectedGroup !== 'Tất cả') {
      result = result.filter((ex) => ex.group === selectedGroup);
    }

    // Sắp xếp
    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else if (sortBy === 'duration') {
      result = [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [debouncedKeyword, selectedGroup, sortBy]);

  const handleStart = useCallback((_exercise: Exercise, _index: number) => {}, []);
  const handleToggleSave = useCallback((_id: string) => {}, []);
  const handleAddToSession = useCallback((_exercise: Exercise) => {}, []);

  const itemData = useMemo(
    () => ({
      items: filteredExercises,
      onStart: handleStart,
      onToggleSave: handleToggleSave,
      onAddToSession: handleAddToSession,
    }),
    [filteredExercises, handleStart, handleToggleSave, handleAddToSession]
  );

  return (
    <div className="catalog-page" style={{ padding: '1rem' }}>
      <h2>Kho bài tập</h2>

      {/* Thanh bộ lọc */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label htmlFor="search-input" style={{ fontWeight: 600 }}>Tìm kiếm: </label>
          <input
            id="search-input"
            type="text"
            placeholder="Tìm theo tên bài hoặc HLV..."
            value={keyword}
            onChange={handleKeywordShift}
            style={{ padding: '6px 10px', minWidth: '240px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label htmlFor="group-select" style={{ fontWeight: 600 }}>Nhóm cơ: </label>
          <select
            id="group-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
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
            style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="default">Mặc định</option>
            <option value="name">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </div>
      </div>

      {/* Thống kê kết quả */}
      <p style={{ fontWeight: 'bold', margin: '0.75rem 0', color: filteredExercises.length > 0 ? '#1f2937' : '#dc2626' }}>
        {filteredExercises.length > 0
          ? `Tìm thấy ${filteredExercises.length} bài tập`
          : 'Không tìm thấy bài tập nào'}
      </p>

      {/* Tiêu đề cột */}
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
        <div style={{ width: '220px', flexShrink: 0, textAlign: 'right' }}>Thao tác</div>
      </div>

      {/* Virtualization List */}
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