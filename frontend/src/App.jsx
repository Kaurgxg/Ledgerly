import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Dashboard from './pages/user/Dashboard';
import Expenses from './pages/user/Expenses';
import Habits from './pages/user/Habits';
import Goals from './pages/user/Goals';
import Analytics from './pages/user/Analytics';
import Feedback from './pages/user/Feedback';
import Profile from './pages/user/Profile';

import AdminUsers from './pages/admin/AdminUsers';
import AdminUsage from './pages/admin/AdminUsage';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminReport from './pages/admin/AdminReport';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin/users' : '/dashboard'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin/users' : '/dashboard'} /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/usage" element={<AdminUsage />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/report" element={<AdminReport />} />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={user ? (user.role === 'admin' ? '/admin/users' : '/dashboard') : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
}
