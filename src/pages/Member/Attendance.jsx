import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseconfig';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';

function Attendance() {
  const [records, setRecords] = useState([]);

  const markAttendance = async () => {
    await addDoc(collection(db, 'attendance'), {
      uid: auth.currentUser.uid,
      date: Timestamp.now()
    });
    alert('Attendance marked!');
    fetchRecords();
  };

  const fetchRecords = async () => {
    const q = query(
      collection(db, 'attendance'),
      where('uid', '==', auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      await deleteDoc(doc(db, 'attendance', id));
      setRecords(prev => prev.filter(record => record.id !== id));
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <button
        onClick={markAttendance}
        className="text-white text-md font-bold py-2 px-6 bg-green-700 rounded hover:bg-green-600"
      >
        Mark Attendance
      </button>

      <ul className="mt-4 space-y-2 text-gray-700 text-md font-semibold">
        {records.map((rec) => (
          <li key={rec.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
            <span>{rec.date.toDate().toDateString()}</span>
            <button
              onClick={() => handleDelete(rec.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Attendance;
