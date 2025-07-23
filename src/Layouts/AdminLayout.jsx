import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseconfig';

const navItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Attendance', path: '/admin/attendance' },
  { label: 'Giving', path: '/admin/giving' },
  { label: 'Messaging', path: '/admin/messaging' },
  { label: 'Announcements', path: '/admin/announcements' },
  { label: 'Events', path: '/admin/events' },
  { label: 'Suggestions', path: '/admin/suggestion' },
  { label: 'Settings', path: '/admin/settings' }
];

const AdminLayout = () => {
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <aside className="w-50 bg-green-700 hidden shadow-md p-4 md:block">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded ${
                location.pathname === item.path ? 'bg-green-500 text-white' : 'hover:bg-blue-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-6 text-red-600 hover:underline">Logout</button>
      </aside>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
