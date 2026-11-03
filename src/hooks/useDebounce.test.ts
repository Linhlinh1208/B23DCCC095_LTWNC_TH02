import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('Kiểm thử hook useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('đổi giá trị, trước 300ms vẫn giữ giá trị cũ, sau khi advance 300ms nhận giá trị mới', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'đẩy', delay: 300 },
      }
    );

    expect(result.current).toBe('đẩy');

    // Cập nhật giá trị mới
    rerender({ value: 'kéo', delay: 300 });

    // Trôi qua 200ms (chưa đủ 300ms) -> vẫn là giá trị cũ
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('đẩy');

    // Trôi thêm 100ms nữa (đủ 300ms) -> cập nhật sang giá trị mới
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('kéo');
  });
});