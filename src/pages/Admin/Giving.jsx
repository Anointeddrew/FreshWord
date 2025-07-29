import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc
} from 'firebase/firestore';

function AdminGiving() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState({});

  const fetchData = async () => {
    // Get giving records
    const q = query(collection(db, 'giving'), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    const givingData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRecords(givingData);

    // Get user names
    const userSnap = await getDocs(collection(db, 'users'));
    const userMap = {};
    userSnap.docs.forEach(doc => {
      const data = doc.data();
      userMap[doc.id] = data.fullName || 'Unnamed';
    });
    setUsers(userMap);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this record?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'giving', id));
      setRecords(records.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record');
    }
  };

  const total = records.reduce((sum, rec) => sum + (rec.amount || 0), 0);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl text-center bg-green-700 rounded text-white py-2 font-bold mb-4">Giving Records</h1>

      <div className="mb-4 text-center">
        <p className="text-lg">
          💰 <strong>Total Giving:</strong> ₦{total.toLocaleString()}
        </p>
      </div>

      <div className="overflow-x-auto mb-4 rounded shadow">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-green-200">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Member Name</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, index) => (
              <tr key={rec.id} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{users[rec.uid] || rec.uid}</td>
                <td className="p-2">₦{rec.amount?.toLocaleString()}</td>
                <td className="p-2">{rec.date?.toDate().toLocaleString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No giving records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminGiving;
