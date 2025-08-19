
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import UserPage from './pages/UserPage.jsx';

export default function App() {
  const [role, setRole] = useState(() => sessionStorage.getItem('role') || '');
  const [userId, setUserId] = useState(() => sessionStorage.getItem('userId') || '');

  useEffect(() => { if (role) sessionStorage.setItem('role', role); }, [role]);
  useEffect(() => { if (userId) sessionStorage.setItem('userId', userId); }, [userId]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage setRole={setRole} setUserId={setUserId} />} />
      <Route path="/admin" element={role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
      <Route path="/user" element={role === 'user' ? <UserPage userId={userId} /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
