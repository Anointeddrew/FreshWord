import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '../../components/Navbar';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, 'users', res.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;

        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'member') {
          navigate('/member');
        } else {
          setError('Unauthorized: No valid role assigned.');
          navigate('/unauthorized');
        }
      } else {
        setError('User role not found in database.');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-green-300 p-4">
        <form onSubmit={handleLogin} className="bg-green-200 p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          {success && <div className="text-green-700 text-sm mb-3">{success}</div>}

          <input
            type="email"
            placeholder="Email"
            className="input w-full mb-3 border px-3 py-2"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="input w-full mb-3 border px-3 py-2"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-sm text-gray-600 hover:text-gray-800"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-green-800 text-white py-2 rounded hover:bg-green-600"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-green-900 text-sm mt-2 hover:underline"
          >
            Forgot Password?
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
