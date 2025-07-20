// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4">THE MASTER'S MINISTRIES INTERNATIONAL</h1>
      <h2 className="text-2xl bg-green-600 rounded p-2 font-semibold mb-2">A.K.A FRESH WORD BIBLE CHURCH</h2>
      <p className="mb-6 text-lg text-gray-900">"...Raising a people of understanding"</p>
      <div className="space-x-4 w-full px-4">
        <Link to="/register" className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</Link>
      </div>
      <div className="mt-8 w-full px-4">
        <Link to="/login" className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Sign in</Link>
      </div>
    </div>
    </div>
  );
}

