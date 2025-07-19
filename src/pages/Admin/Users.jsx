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

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'), orderBy('fullName', 'asc'));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
      setFiltered(list);
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    const results = users.filter(u =>
      (u.fullName || '').toLowerCase().includes(term) ||
      (u.department || '').toLowerCase().includes(term)
    );
    setFiltered(results);
  };

  const handleRoleChange = async (userId, newRole) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setFiltered(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by name or department"
        className="input mb-4 w-full max-w-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(user => (
          <div key={user.id} className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-bold">{user.fullName || 'Unnamed'}</h2>
            <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
            <p><strong>DOB:</strong> {user.dob || 'N/A'}</p>
            <p><strong>Marital Status:</strong> {user.maritalStatus || 'N/A'}</p>
            <p><strong>Occupation:</strong> {user.occupation || 'N/A'}</p>
            <p><strong>Department:</strong> {user.department || 'N/A'}</p>
            <p><strong>Role:</strong> {user.role || 'member'}</p>

            <select
              value={user.role || 'member'}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
              className="mt-2 border px-2 py-1 rounded"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
