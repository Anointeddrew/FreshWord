// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { currentUser } = useAuth();
  

  return (
    <nav className="bg-green-800 shadow-md  px-4 py-4 flex text-lg justify-between items-center text-white">
      <Link to="/" className="text-xl font-bold text-white hover:text-black">FreshWordApp</Link>

      <div className="space-x-4">
        {!currentUser && (
          <>
            <Link to="/login" className="text-gray-300 hover:text-black">Login</Link>
            <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
