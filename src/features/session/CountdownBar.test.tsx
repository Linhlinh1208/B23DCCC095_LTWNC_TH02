import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountdownBar } from './CountdownBar';
import { useSessionStore } from './useSessionStore';

describe('Kiểm thử component CountdownBar', () => {
  it('không hiển thị gì khi chưa có bài tập trong session', () => {
    useSessionStore.setState({ queue: [], currentIndex: -1 });
    const { container } = render(<CountdownBar />);
    expect(container.firstChild).toBeNull();
  });

  it('hiển thị đúng thời gian còn lại khi đang tập', () => {
    useSessionStore.setState({
      queue: [
        { id: 'e1', name: 'Đẩy tạ đơn 1', trainer: 'Minh Khang', group: 'Ngực', duration: 30 },
      ],
      currentIndex: 0,
      elapsed: 10,
    });

    render(<CountdownBar />);
    expect(screen.getByText(/còn lại: 0:20/i)).toBeInTheDocument();
  });
});