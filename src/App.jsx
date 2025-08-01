import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ParcelDetails from './pages/ParcelDetails';
import AdminPanel from './pages/AdminPanel';
import ToastNotification from './components/ToastNotification';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useSelector(state => state.user);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppContent() {
  const { isAuthenticated } = useSelector(state => state.user);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
{/*           <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} /> */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login />
              ) : (
                user?.role === 'admin' ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/dashboard" />
                )
              )
            }
          />

          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/parcel/:id" element={
            <ProtectedRoute>
              <ParcelDetails />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <ToastNotification />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
