import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseconfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Navbar from '../../components/Navbar';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Date you enabled verification policy
  const VERIFICATION_POLICY_DATE = new Date('2025-08-09');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get account creation date
      const createdAt = new Date(user.metadata.creationTime);

      // Enforce verification for new accounts only
      if (!user.emailVerified && createdAt >= VERIFICATION_POLICY_DATE) {
        await sendEmailVerification(user);
        setError('A verification email has been sent. Please verify before logging in.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      // For old accounts without verification, send email but still allow login
      if (!user.emailVerified && createdAt < VERIFICATION_POLICY_DATE) {
        await sendEmailVerification(user);
        setSuccess('A verification email has been sent. Please verify your account soon.');
      }

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Save user only if not already in Firestore
        await setDoc(userRef, {
          email: user.email,
          role: 'member',
          createdAt: new Date()
        });
        navigate('/member');
        return;
      }

      // If user exists, get role
       const role = userSnap.data()?.role || 'member';

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'member') {
        navigate('/member');
      } else {
        setError('Unauthorized: No valid role assigned.');
        navigate('/unauthorized');
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
