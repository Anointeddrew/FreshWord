// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseconfig';

function Navbar() {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-green-800 shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-white">FreshWordChurchApp</Link>

      <div className="space-x-4">
        {!currentUser && (
          <>
            <Link to="/login" className="text-gray-300 hover:text-black">Login</Link>
            <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Sign Up</Link>
          </>
        )}

        {currentUser && role === 'admin' && (
          <>
            <Link to="/admin" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          </>
        )}

        {currentUser && role === 'member' && (
          <>
            <Link to="/member" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            <Link to="/member/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
            <Link to="/member/messages" className="text-gray-700 hover:text-blue-600">Messages</Link>
          </>
        )}

        {currentUser && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
