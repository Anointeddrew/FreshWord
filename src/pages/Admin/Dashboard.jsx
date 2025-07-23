import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [memberCount, setMemberCount] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(0);
  const [totalGiving, setTotalGiving] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      // Total members
      const usersSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'member')));
      setMemberCount(usersSnap.size);

      // Today's attendance
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayTimestamp = Timestamp.fromDate(todayStart);

      const attendanceSnap = await getDocs(
        query(collection(db, 'attendance'), where('date', '>=', todayTimestamp))
      );
      setTodayAttendance(attendanceSnap.size);

      // Total giving
      const givingSnap = await getDocs(collection(db, 'giving'));
      const total = givingSnap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
      setTotalGiving(total);
    };

    fetchStats();
  }, []);

  return (
    <div className="p-2 max-w-2xl mx-auto bg-white rounded shadow-md">
      <h1 className="text-2xl text-center bg-green-700 rounded text-white font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-200 p-4 rounded shadow">
          <p className="text-black font-bold">Total Members</p>
          <p className="text-2xl font-semibold">{memberCount}</p>
          <Link to="/admin/users" className="text-blue-600 text-sm">Manage Members</Link>
        </div>

        <div className="bg-green-200 p-4 rounded shadow">
          <p className="text-black font-bold">Today's Attendance</p>
          <p className="text-2xl font-semibold">{todayAttendance}</p>
          <Link to="/admin/attendance" className="text-blue-600 text-sm">View Attendance</Link>
        </div>

        <div className="bg-green-200 p-4 rounded shadow">
          <p className="text-black font-bold">Total Giving</p>
          <p className="text-2xl font-semibold">₦{totalGiving.toLocaleString()}</p>
          <Link to="/admin/giving" className="text-blue-600 text-sm">Giving Records</Link>
        </div>
      </div>

      <div className="mt-10 mb-2 text-center space-x-4">
        <Link to="/admin/messaging" className="bg-green-700 hover:bg-green-600 py-2 px-2 rounded text-white">Send Message</Link>
        <Link to="/admin/users" className="bg-green-700 hover:bg-green-600 py-2 px-2 rounded text-white">View Members</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
