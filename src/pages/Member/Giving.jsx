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
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl text-center text-white bg-green-700 rounded font-bold mb-2">Giving</h2>

      {accountInfo.accountNumber && (
        <div className="mb-4 p-4 bg-green-200 border-1-4 border-green-500">
          <p><strong>Bank Name:</strong> {accountInfo.bankName}</p>
          <p><strong>Account Number:</strong> {accountInfo.accountNumber}</p>
          <p><strong>Account Name:</strong> {accountInfo.accountName || 'Fresh Word Bible Church'}</p>
          <p className="text-md text-black bg-white rounded text-center mt-4">Please use these details for your giving.</p>
        </div>
      )}

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="Enter amount"
        className="input bg-gray-100 border border-gray-300 rounded p-2 w-full"
      />
      <button onClick={submitGiving} className="bg-green-700 py-2 px-4 rounded mt-2 hover:bg-green-600">Submit</button>
      <ul className="mt-4">
        {history.map((g, i) => (
          <li key={i}>₦{g.amount} - {g.date.toDate().toDateString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default Giving;
