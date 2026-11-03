const BUILD_TAG = "wk-5182";

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { CatalogPage } from './pages/CatalogPage';
import { SessionBar } from './features/session/SessionBar';
import { RoutineProvider } from './features/routines/RoutineContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Buổi 5: Code-splitting lazy loading cho các route
const SavedPage = lazy(() =>
  import('./pages/SavedPage').then((module) => ({ default: module.SavedPage }))
);
const RoutinesPage = lazy(() =>
  import('./pages/RoutinesPage').then((module) => ({ default: module.RoutinesPage }))
);
const RoutineDetailPage = lazy(() =>
  import('./pages/RoutineDetailPage').then((module) => ({ default: module.RoutineDetailPage }))
);

const NavigationBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
        marginBottom: '1rem',
      }}
    >
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration: 'none',
            color: isActive ? '#3b82f6' : theme === 'dark' ? '#d1d5db' : '#374151',
          })}
        >
          Kho bài tập
        </NavLink>
        <NavLink
          to="/saved"
          style={({ isActive }) => ({
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration: 'none',
            color: isActive ? '#3b82f6' : theme === 'dark' ? '#d1d5db' : '#374151',
          })}
        >
          Đã lưu
        </NavLink>
        <NavLink
          to="/routines"
          style={({ isActive }) => ({
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration: 'none',
            color: isActive ? '#3b82f6' : theme === 'dark' ? '#d1d5db' : '#374151',
          })}
        >
          Giáo án
        </NavLink>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{BUILD_TAG}</span>
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            borderRadius: '4px',
            border: '1px solid #9ca3af',
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
          }}
        >
          {theme === 'light' ? '🌙 Chuyển sang Tối' : '☀️ Chuyển sang Sáng'}
        </button>
      </div>
    </header>
  );
};

export const AppContent: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <NavigationBar />
      <main>
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải trang...</div>}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutineDetailPage />} />
          </Routes>
        </Suspense>
      </main>
      <SessionBar />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RoutineProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </RoutineProvider>
    </ThemeProvider>
  );
}