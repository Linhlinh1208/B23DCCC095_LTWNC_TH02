import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RoutinesPage } from './RoutinesPage';
import { RoutineProvider } from '../features/routines/RoutineContext';

// Hàm bọc các Provider và MemoryRouter theo yêu cầu bắt buộc
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <RoutineProvider>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </RoutineProvider>
  );
};

describe('Kiểm thử giao diện RoutinesPage theo hành vi người dùng', () => {
  // Giả lập hàm alert của window để tránh chặn luồng chạy test
  vi.spyOn(window, 'alert').mockImplementation(() => {});

  it('bấm Tạo khi ô trống thì thấy thông báo "Tên giáo án không được để trống"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const createButton = screen.getByRole('button', { name: /tạo giáo án/i });
    await user.click(createButton);

    expect(screen.getByText('Tên giáo án không được để trống')).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên giáo án mới xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);

    const input = screen.getByPlaceholderText(/nhập tên giáo án/i);
    const createButton = screen.getByRole('button', { name: /tạo giáo án/i });

    await user.type(input, 'Giáo án Chân Mông');
    await user.click(createButton);

    expect(screen.getByText('Giáo án Chân Mông')).toBeInTheDocument();
  });
});