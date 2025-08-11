import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

function AdminDepartmentApproval() {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      const q = query(
        collection(db, 'users'),
        where('departmentApprovalStatus', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach(docSnap => {
        users.push({ id: docSnap.id, ...docSnap.data() });
      });
      setPendingUsers(users);
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      departmentApprovalStatus: 'approved',
    });
    setPendingUsers(pendingUsers.filter(user => user.id !== userId));
  };

  const handleReject = async (userId) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      departmentApprovalStatus: 'rejected',
    });
    setPendingUsers(pendingUsers.filter(user => user.id !== userId));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Pending Department Approvals</h1>
      {pendingUsers.length === 0 && <p>No users pending approval.</p>}
      <ul>
        {pendingUsers.map(user => (
          <li key={user.id} className="mb-4 border p-4 rounded shadow">
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Department:</strong> {user.department}</p>
            <button
              onClick={() => handleApprove(user.id)}
              className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(user.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDepartmentApproval;
