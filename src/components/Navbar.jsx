
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import {
  Package,
  User,
  LogOut,
  Shield,
  CarTaxiFront,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

function Navbar() {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-emerald-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <CarTaxiFront className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-emerald-600">Deliveroo</span>
          </Link>

          {/* Hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-emerald-600 focus:outline-none"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Links */}
          <div className={`flex-col lg:flex lg:flex-row lg:items-center lg:space-x-4 absolute lg:static bg-white w-full lg:w-auto left-0 top-16 z-50 shadow-lg lg:shadow-none transition-all duration-300 ease-in-out ${menuOpen ? 'flex' : 'hidden'}`}>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="px-4 py-2">
                  <NotificationCenter />
                </div>

                <div className="flex items-center px-4 py-2 text-gray-700">
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-sm">{user?.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mx-4 lg:mx-0"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
