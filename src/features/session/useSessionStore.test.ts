import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

const mockExercises: Exercise[] = [
  { id: 'e1', name: 'Đẩy tạ đơn 1', trainer: 'Minh Khang', group: 'Ngực', duration: 30 },
  { id: 'e2', name: 'Kéo tạ đơn 1', trainer: 'Phương Anh', group: 'Chân', duration: 67 },
];

describe('Kiểm thử useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });

  it('startSession: đặt đúng danh sách hàng đợi, bắt đầu từ bài chỉ định và reset elapsed về 0', () => {
    const store = useSessionStore.getState();
    store.startSession(mockExercises, 0);

    const state = useSessionStore.getState();
    expect(state.queue.length).toBe(2);
    expect(state.currentIndex).toBe(0);
    expect(state.isRunning).toBe(true);
    expect(state.elapsed).toBe(0);
  });

  it('toggleRun: bật/tắt trạng thái chạy', () => {
    useSessionStore.getState().startSession(mockExercises, 0);
    useSessionStore.getState().toggleRun();
    expect(useSessionStore.getState().isRunning).toBe(false);
    useSessionStore.getState().toggleRun();
    expect(useSessionStore.getState().isRunning).toBe(true);
  });

  it('tick: tăng elapsed mỗi giây và ở giây cuối cùng thì tự động chuyển sang bài tiếp theo', () => {
    useSessionStore.getState().startSession(mockExercises, 0);

    useSessionStore.setState({ elapsed: 29 });
    useSessionStore.getState().tick();

    const state = useSessionStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.elapsed).toBe(0);
  });

  it('tick: tăng elapsed khi chưa tới giây cuối', () => {
    useSessionStore.getState().startSession(mockExercises, 0);
    useSessionStore.getState().tick();
    expect(useSessionStore.getState().elapsed).toBe(1);
  });

  it('next: khi đang ở bài cuối cùng thì dừng buổi tập và đặt isRunning về false', () => {
    useSessionStore.getState().startSession(mockExercises, 1);
    useSessionStore.getState().next();
    expect(useSessionStore.getState().isRunning).toBe(false);
  });

  it('prev: khi elapsed > 3 thì chỉ reset elapsed về 0', () => {
    useSessionStore.getState().startSession(mockExercises, 1);
    useSessionStore.setState({ elapsed: 5 });
    useSessionStore.getState().prev();
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().elapsed).toBe(0);
  });

  it('prev: khi elapsed <= 3 và currentIndex > 0 thì lùi về bài trước', () => {
    useSessionStore.getState().startSession(mockExercises, 1);
    useSessionStore.setState({ elapsed: 2 });
    useSessionStore.getState().prev();
    expect(useSessionStore.getState().currentIndex).toBe(0);
    expect(useSessionStore.getState().elapsed).toBe(0);
  });

  it('addToSession: thêm bài mới vào queue và không thêm trùng', () => {
    useSessionStore.getState().addToSession(mockExercises[0]);
    expect(useSessionStore.getState().queue.length).toBe(1);
    useSessionStore.getState().addToSession(mockExercises[0]);
    expect(useSessionStore.getState().queue.length).toBe(1);
  });
});