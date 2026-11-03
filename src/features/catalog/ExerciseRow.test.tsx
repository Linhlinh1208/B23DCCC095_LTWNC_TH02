import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseRow } from './ExerciseRow';
import type { Exercise } from '../../types';

describe('Kiểm thử component ExerciseRow', () => {
  const mockExercise: Exercise = {
    id: 'e1',
    name: 'Đẩy tạ đơn 1',
    trainer: 'Minh Khang',
    group: 'Ngực',
    duration: 30,
  };

  it('hiển thị đầy đủ tên bài tập và thời lượng định dạng 0:30', () => {
    const mockStart = vi.fn();
    render(
      <ExerciseRow
        index={0}
        style={{}}
        data={{
          items: [mockExercise],
          onStart: mockStart,
          onToggleSave: vi.fn(),
          onAddToSession: vi.fn(),
          onAddToRoutine: vi.fn(),
          isSaved: () => false,
        }}
      />
    );

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
  });

  it('bấm nút Bắt đầu tìm bằng getByRole thì hàm mock vi.fn() được gọi đúng bài tập', () => {
    const mockStart = vi.fn();
    render(
      <ExerciseRow
        index={0}
        style={{}}
        data={{
          items: [mockExercise],
          onStart: mockStart,
          onToggleSave: vi.fn(),
          onAddToSession: vi.fn(),
          onAddToRoutine: vi.fn(),
          isSaved: () => false,
        }}
      />
    );

    // Tìm nút bằng getByRole theo yêu cầu đề bài
    const startButton = screen.getByRole('button', { name: /bắt đầu/i });
    fireEvent.click(startButton);

    expect(mockStart).toHaveBeenCalledTimes(1);
    expect(mockStart).toHaveBeenCalledWith(mockExercise, 0);
  });
});