import { describe, it, expect, beforeEach } from 'vitest';
import { useSavedStore } from './useSavedStore';

describe('Kiểm thử useSavedStore', () => {
  beforeEach(() => {
    useSavedStore.setState({ ids: [] });
  });

  it('toggle: lưu bài tập vào danh sách khi chưa có', () => {
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toContain('e1');
  });

  it('toggle: bỏ lưu bài tập nếu đã có sẵn trong danh sách', () => {
    useSavedStore.getState().toggle('e1');
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).not.toContain('e1');
  });
});