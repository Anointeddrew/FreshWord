import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

function AttendanceAdmin() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // Load attendance records
      const q = query(collection(db, 'attendance'), orderBy('date', 'desc'), limit(100));
      const snap = await getDocs(q);
      const attendanceData = snap.docs.map(doc => doc.data());
      setRecords(attendanceData);

      // Load user map (id -> full name)
      const usersSnap = await getDocs(collection(db, 'users'));
      const userMap = {};
      usersSnap.docs.forEach(doc => {
        const data = doc.data();
        userMap[doc.id] = data.fullName || 'Unnamed';
      });
      setUsers(userMap);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recent Attendance</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Member Name</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{users[rec.uid] || rec.uid}</td>
                <td className="p-2">{rec.date?.toDate().toLocaleString()}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceAdmin;
