import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';

function Settings() {
  const [users, setUsers] = useState([]);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'), orderBy('email'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const changeRole = async (id, newRole) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, 'users', id), { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Role update failed:', err);
      alert('Failed to update role.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>

      <h3 className="text-lg font-semibold mb-2">Manage User Roles</h3>
      <div className="bg-white shadow p-4 rounded mb-6 overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Email</th>
              <th className="p-2">Current Role</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2 space-x-2">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => changeRole(user.id, 'admin')}
                      disabled={updating === user.id}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                    >
                      Make Admin
                    </button>
                  )}
                  {user.role !== 'member' && (
                    <button
                      onClick={() => changeRole(user.id, 'member')}
                      disabled={updating === user.id}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
                    >
                      Make Member
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: App toggle settings (future use) */}
      {/* 
      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">App Preferences</h3>
        <p className="text-sm text-gray-500">Coming soon: feature toggles (attendance, giving, etc.)</p>
      </div> 
      */}
    </div>
  );
}

export default Settings;
