import { describe, it, expect } from 'vitest';
import { formatDuration, formatRoutineTotalTime, removeVietnameseTones } from './format';

describe('Kiểm thử tiện ích định dạng thời gian và chuỗi', () => {
  it('formatDuration: định dạng chính xác số giây sang m:ss (0 -> 0:00, 67 -> 1:07, 120 -> 2:00)', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(67)).toBe('1:07');
    expect(formatDuration(120)).toBe('2:00');
  });

  it('formatRoutineTotalTime: định dạng tổng thời gian sang tiếng Việt đầy đủ', () => {
    expect(formatRoutineTotalTime(97)).toBe('1 phút 37 giây');
    expect(formatRoutineTotalTime(60)).toBe('1 phút 00 giây');
    expect(formatRoutineTotalTime(15)).toBe('0 phút 15 giây');
  });

  it('removeVietnameseTones: loại bỏ chuẩn dấu tiếng Việt', () => {
    expect(removeVietnameseTones('Đẩy ngực')).toBe('Day nguc');
    expect(removeVietnameseTones('kéo tạ')).toBe('keo ta');
  });
});