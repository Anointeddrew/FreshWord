import React from 'react';
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

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-50 hidden bg-green-700 shadow-md p-4 md:block">
          <h2 className="text-xl font-bold mb-6">Esteemed Member</h2>
          <nav className="space-y-4">
            {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded ${
                location.pathname === item.path ? 'bg-green-500 text-white' : 'hover:bg-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-6 text-red-600 hover:underline">Logout</button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
    </div>
  );
};

export default MemberLayout;
