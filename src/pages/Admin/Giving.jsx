import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function AdminGiving() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // Get giving records
      const q = query(collection(db, 'giving'), orderBy('date', 'desc'));
      const snap = await getDocs(q);
      const givingData = snap.docs.map(doc => doc.data());
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

    fetchData();
  }, []);

  // Compute total giving
  const total = records.reduce((sum, rec) => sum + (rec.amount || 0), 0);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Giving Records</h1>

      <div className="mb-4">
        <p className="text-lg">
          💰 <strong>Total Giving:</strong> ₦{total.toLocaleString()}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Member Name</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{users[rec.uid] || rec.uid}</td>
                <td className="p-2">₦{rec.amount.toLocaleString()}</td>
                <td className="p-2">{rec.date?.toDate().toLocaleString()}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">No giving records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminGiving;
