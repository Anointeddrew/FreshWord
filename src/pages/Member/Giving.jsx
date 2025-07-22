import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseconfig';
import { collection, addDoc, getDocs, getDoc, query, where, Timestamp, doc } from 'firebase/firestore';

function Giving() {
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);
   const [accountInfo, setAccountInfo] = useState({});

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

   const fetchAccountInfo = async () => {
    const ref = doc(db, 'settings', 'churchInfo');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setAccountInfo(snap.data());
    }
  };

  useEffect(() => { fetchGiving(); fetchAccountInfo(); }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Giving</h2>

      {accountInfo.accountNumber && (
        <div className="mb-4 p-3 bg-green-50 border-1-4 border-green-500">
          <p><strong>Bank Name:</strong> {accountInfo.bankName}</p>
          <p><strong>Account Number:</strong> {accountInfo.accountNumber}</p>
          <p><strong>Account Name:</strong> {accountInfo.accountName || 'Fresh Word Bible Church'}</p>
          <p className="text-sm text-gray-600">Please use these details for your giving.</p>
        </div>
      )}

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
