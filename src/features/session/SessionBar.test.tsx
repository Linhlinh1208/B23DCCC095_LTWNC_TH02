import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionBar } from './SessionBar';
import { useSessionStore } from './useSessionStore';

describe('Kiểm thử component SessionBar', () => {
  it('hiển thị thông báo khi chưa bắt đầu buổi tập', () => {
    useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false });
    render(<SessionBar />);
    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
  });

  it('hiển thị tên bài tập hiện tại và phản hồi khi nhấn nút điều khiển', () => {
    useSessionStore.setState({
      queue: [
        { id: 'e1', name: 'Đẩy tạ đơn 1', trainer: 'Minh Khang', group: 'Ngực', duration: 30 },
        { id: 'e2', name: 'Kéo tạ đơn 1', trainer: 'Phương Anh', group: 'Chân', duration: 67 },
      ],
      currentIndex: 0,
      isRunning: false,
      elapsed: 0,
    });

    render(<SessionBar />);
    expect(screen.getByText(/đang tập: đẩy tạ đơn 1/i)).toBeInTheDocument();

    const startButton = screen.getByRole('button', { name: /bắt đầu/i });
    fireEvent.click(startButton);
    expect(useSessionStore.getState().isRunning).toBe(true);

    const nextButton = screen.getByRole('button', { name: /sau/i });
    fireEvent.click(nextButton);
    expect(useSessionStore.getState().currentIndex).toBe(1);
  });
});