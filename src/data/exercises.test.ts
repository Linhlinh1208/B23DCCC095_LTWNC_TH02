import { describe, it, expect } from 'vitest';
import { generateExercises } from './exercises';

describe('Kiểm thử hàm sinh dữ liệu bài tập', () => {
  it('generateExercises(10000) sinh ra đúng 10000 phần tử', () => {
    const list = generateExercises(10000);
    expect(list.length).toBe(10000);
  });

  it('mọi id của bài tập sinh ra là duy nhất và không bị trùng lặp', () => {
    const list = generateExercises(10000);
    const uniqueIds = new Set(list.map((ex) => ex.id));
    expect(uniqueIds.size).toBe(10000);
  });

  it('thời lượng duration của mọi bài tập nằm trong khoảng từ 30 đến 120 giây', () => {
    const list = generateExercises(10000);
    const allValid = list.every((ex) => ex.duration >= 30 && ex.duration <= 120);
    expect(allValid).toBe(true);
  });
});