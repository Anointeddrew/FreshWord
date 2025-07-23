import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseconfig';

const navItems = [
  { label: 'Dashboard', path: '/member' },
  { label: 'Profile', path: '/member/profile' },
  { label: 'Attendance', path: '/member/attendance' },
  { label: 'Giving', path: '/member/giving' },
  { label: 'Messages', path: '/member/messages' },
  { label: 'Suggestions', path: '/member/suggestions' }
];

const MemberLayout = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-green-700 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold">Esteemed Member</h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white border px-3 py-1 rounded"
        >
          {menuOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow p-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 rounded ${
                location.pathname === item.path ? 'bg-green-500 text-white' : 'hover:bg-green-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-4 text-red-600 hover:underline"
          >
            Logout
          </button>
        </nav>
      )}

      {/* Sidebar for larger screens */}
      <aside className="hidden md:block w-64 bg-green-700 shadow-md p-4 text-white">
        <h2 className="text-xl font-bold mb-6">Esteemed Member</h2>
        <nav className="space-y-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded ${
                location.pathname === item.path ? 'bg-green-500 text-white' : 'hover:bg-green-600'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-6 text-red-300 hover:underline">Logout</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberLayout;
