import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseconfig';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

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
    setRecords(snapshot.docs.map(doc => doc.data()));
  };

  useEffect(() => { fetchRecords(); }, []);

  return (
    <div className="p-4">
      <button onClick={markAttendance} className="btn">Mark Attendance</button>
      <ul className="mt-4">
        {records.map((rec, i) => (
          <li key={i}>{rec.date.toDate().toDateString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default Attendance;
