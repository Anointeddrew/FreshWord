// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';

function Navbar() {
  const { currentUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-green-800 shadow-md px-4 py-4 flex text-lg justify-between items-center text-white">
      <Link
        to="/"
        className="text-xl font-bold text-white hover:text-black"
      >
        FreshWordApp
      </Link>

      <div className="relative" ref={menuRef}>
        {!currentUser && (
          <div className="relative">
            {/* Dropdown Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700  text-sm focus:outline-none"
            >
              ▾
            </button>

            {/* Dropdown Menu with slide down + fade animation */}
            <div
              className={`absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-50 transition-all duration-200 ease-out transform origin-top ${
                menuOpen
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              <Link
                to="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                to="/first-timer"
                className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                onClick={() => setMenuOpen(false)}
              >
                First Timer
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
