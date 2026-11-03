import { describe, it, expect } from 'vitest';
import { routineReducer } from './routineReducer';
import type { Routine } from '../../types';

describe('Kiểm thử routineReducer', () => {
  const initial: Routine[] = [
    { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
  ];

  it('tạo giáo án mới thành công và thêm vào danh sách', () => {
    const next = routineReducer(initial, {
      type: 'create',
      payload: { name: 'Ngày lưng' },
    });
    expect(next.length).toBe(2);
    expect(next[1].name).toBe('Ngày lưng');
    expect(next[1].exerciseIds).toEqual([]);
  });

  it('tạo giáo án trùng tên thì không thêm mới', () => {
    const next = routineReducer(initial, {
      type: 'create',
      payload: { name: 'ngày NGỰC' },
    });
    expect(next.length).toBe(1);
  });

  it('tạo giáo án với chuỗi rỗng thì giữ nguyên state', () => {
    const next = routineReducer(initial, {
      type: 'create',
      payload: { name: '   ' },
    });
    expect(next).toEqual(initial);
  });

  it('đổi tên giáo án thành công', () => {
    const next = routineReducer(initial, {
      type: 'rename',
      payload: { id: 'r1', name: 'Ngày ngực nâng cao' },
    });
    expect(next[0].name).toBe('Ngày ngực nâng cao');
  });

  it('đổi tên giáo án trùng với giáo án khác thì giữ nguyên', () => {
    const stateWithTwo: Routine[] = [
      { id: 'r1', name: 'Ngày ngực', exerciseIds: [] },
      { id: 'r2', name: 'Ngày chân', exerciseIds: [] },
    ];
    const next = routineReducer(stateWithTwo, {
      type: 'rename',
      payload: { id: 'r2', name: 'ngày ngực' },
    });
    expect(next[1].name).toBe('Ngày chân');
  });

  it('addExercise: thêm bài tập mới vào giáo án và không thêm nếu bài đã tồn tại', () => {
    let next = routineReducer(initial, {
      type: 'addExercise',
      payload: { routineId: 'r1', exerciseId: 'e3' },
    });
    expect(next[0].exerciseIds).toEqual(['e1', 'e2', 'e3']);

    // Thêm trùng e1 -> giữ nguyên danh sách
    next = routineReducer(next, {
      type: 'addExercise',
      payload: { routineId: 'r1', exerciseId: 'e1' },
    });
    expect(next[0].exerciseIds).toEqual(['e1', 'e2', 'e3']);
  });

  it('removeExercise: xóa bài tập ra khỏi giáo án thành công', () => {
    const next = routineReducer(initial, {
      type: 'removeExercise',
      payload: { routineId: 'r1', exerciseId: 'e1' },
    });
    expect(next[0].exerciseIds).toEqual(['e2']);
  });

  it('xóa giáo án không tồn tại thì state giữ nguyên', () => {
    const next = routineReducer(initial, {
      type: 'remove',
      payload: { id: 'r_khong_ton_tai' },
    });
    expect(next).toEqual(initial);
  });

  it('xóa giáo án có tồn tại', () => {
    const next = routineReducer(initial, {
      type: 'remove',
      payload: { id: 'r1' },
    });
    expect(next.length).toBe(0);
  });
});