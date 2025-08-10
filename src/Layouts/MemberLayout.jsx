import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { signOut, deleteUser } from 'firebase/auth';
import { auth, db } from '../firebaseconfig';
import { doc, deleteDoc } from 'firebase/firestore';

const navItems = [
  { label: 'Dashboard', path: '/member' },
  { label: 'Profile', path: '/member/profile' },
  { label: 'Attendance', path: '/member/attendance' },
  { label: 'Giving', path: '/member/giving' },
  { label: 'Messages', path: '/member/messages' },
  { label: 'Testimonies/Suggestions', path: '/member/suggestions' }
];

const MemberLayout = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmation) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("No user is logged in.");
        return;
      }

      // 1️⃣ Remove user data from Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // 2️⃣ Delete Firebase Authentication account
      await deleteUser(user);

      alert("Your account has been deleted successfully.");
      window.location.href = '/login';
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/requires-recent-login") {
        alert("Please log in again before deleting your account for security reasons.");
        await signOut(auth);
        window.location.href = '/login';
      } else {
        alert("Failed to delete account. Please try again.");
      }
    }
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
          <div>
          <button
            onClick={handleDeleteAccount}
            className="mt-2 text-red-800 hover:underline"
          >
            Delete Account
          </button>
          </div>
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
        <button onClick={handleLogout} className="mt-6 text-red-400 hover:underline">Logout</button>
        <div>
        <button onClick={handleDeleteAccount} className="mt-2 text-red-200 hover:underline">Delete Account</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberLayout;
