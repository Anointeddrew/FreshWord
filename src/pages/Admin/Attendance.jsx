import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  deleteDoc
} from 'firebase/firestore';

function AttendanceAdmin() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState({});

  const fetchData = async () => {
    const q = query(collection(db, 'attendance'), orderBy('date', 'desc'), limit(100));
    const snap = await getDocs(q);
    const attendanceData = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRecords(attendanceData);

    const usersSnap = await getDocs(collection(db, 'users'));
    const userMap = {};
    usersSnap.docs.forEach((doc) => {
      const data = doc.data();
      userMap[doc.id] = data.fullName || 'Unnamed';
    });
    setUsers(userMap);
  };

  const deleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteDoc(doc(db, 'attendance', id));
      fetchData(); // Refresh list
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow-md">
      <h1 className="text-2xl text-center rounded font-bold mb-4">
        Recent Attendance
      </h1>

      <div className="overflow-x-auto mb-3 rounded shadow">
        <table className="min-w-full bg-gray-200 rounded shadow">
          <thead>
            <tr className="bg-green-200 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Member Name</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, index) => (
              <tr key={rec.id} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{users[rec.uid] || rec.uid}</td>
                <td className="p-2">{rec.date?.toDate().toLocaleString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteRecord(rec.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceAdmin;
