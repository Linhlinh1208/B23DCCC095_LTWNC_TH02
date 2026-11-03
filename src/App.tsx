const BUILD_TAG = "wk-5182";

import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { CatalogPage } from './pages/CatalogPage';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            borderBottom: '1px solid #ccc',
          }}
        >
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
                textDecoration: 'none',
                color: isActive ? '#0066cc' : '#333',
              })}
            >
              Kho bài tập
            </NavLink>
            <NavLink
              to="/saved"
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
                textDecoration: 'none',
                color: isActive ? '#0066cc' : '#333',
              })}
            >
              Đã lưu
            </NavLink>
            <NavLink
              to="/routines"
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
                textDecoration: 'none',
                color: isActive ? '#0066cc' : '#333',
              })}
            >
              Giáo án
            </NavLink>
          </nav>
          <span style={{ fontSize: '0.8rem', color: '#999' }}>{BUILD_TAG}</span>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/saved" element={<div style={{ padding: '1rem' }}>Trang Đã lưu (Phần 2)</div>} />
            <Route path="/routines" element={<div style={{ padding: '1rem' }}>Danh sách giáo án (Phần 3)</div>} />
            <Route path="/routines/:id" element={<div style={{ padding: '1rem' }}>Chi tiết giáo án (Phần 3)</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}