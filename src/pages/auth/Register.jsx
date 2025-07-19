import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'text-red-600' };
    if (strength === 3 || strength === 4) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Strong', color: 'text-green-600' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email,
        role: 'member',
        createdAt: new Date()
      });

      navigate('/member');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl text-center font-bold mb-4">Register</h2>

          {/* Error message display */}
          {error && (
            <p className="text-red-600 text-sm text-center mb-3">{error}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mb-3 w-full"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mb-1 w-full"
            required
          />

          {/* Password strength feedback */}
          {password && (
            <p className={`text-sm mb-2 ${passwordStrength.color}`}>
              Password Strength: {passwordStrength.label}
            </p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input mb-4 w-full"
            required
          />

          <button
            type="submit"
            className="btn w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
