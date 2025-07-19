import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseconfig';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

function Giving() {
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);

  const submitGiving = async () => {
    await addDoc(collection(db, 'giving'), {
      uid: auth.currentUser.uid,
      amount: parseFloat(amount),
      date: Timestamp.now()
    });
    setAmount('');
    fetchGiving();
  };

  const fetchGiving = async () => {
    const q = query(collection(db, 'giving'), where('uid', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    setHistory(snapshot.docs.map(doc => doc.data()));
  };

  useEffect(() => { fetchGiving(); }, []);

  return (
    <div className="p-4">
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="Enter amount"
        className="input"
      />
      <button onClick={submitGiving} className="btn mt-2">Submit</button>
      <ul className="mt-4">
        {history.map((g, i) => (
          <li key={i}>₦{g.amount} - {g.date.toDate().toDateString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default Giving;
