import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseconfig';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
  doc,
} from 'firebase/firestore';

function Giving() {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('tithe'); // default to tithe
  const [history, setHistory] = useState([]);
  const [accountInfo, setAccountInfo] = useState({});

  const submitGiving = async () => {
    await addDoc(collection(db, 'giving'), {
      uid: auth.currentUser.uid,
      amount: parseFloat(amount),
      purpose,
      date: Timestamp.now(),
    });
    setAmount('');
    fetchGiving();
  };

  const fetchGiving = async () => {
    const q = query(
      collection(db, 'giving'),
      where('uid', '==', auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    setHistory(snapshot.docs.map((doc) => doc.data()));
  };

  const fetchAccountInfo = async () => {
    const ref = doc(db, 'settings', 'churchInfo');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setAccountInfo(snap.data());
    }
  };

  useEffect(() => {
    fetchGiving();
    fetchAccountInfo();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl text-center text-white bg-green-700 rounded font-bold mb-2">
        Giving
      </h2>

      {/* Account Info based on purpose */}
      {accountInfo[purpose] && (
        <div className="mb-4 p-4 bg-green-200 border border-green-500 rounded">
          <p><strong>Bank Name:</strong> {accountInfo[purpose].bankName}</p>
          <p><strong>Account Number:</strong> {accountInfo[purpose].accountNumber}</p>
          <p><strong>Account Name:</strong> {accountInfo[purpose].accountName}</p>
          <p className="text-sm mt-2 text-black bg-white rounded px-2 py-1 text-center">
            Please use these details for your {purpose}.
          </p>
        </div>
      )}

      <select
        className="mb-3 w-full border p-2 rounded"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      >
        <option value="tithe">Tithe</option>
        <option value="welfare">Welfare</option>
      </select>

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="Enter amount"
        className="input bg-gray-100 border border-gray-300 rounded p-2 w-full"
      />

      <button
        onClick={submitGiving}
        className="bg-green-700 py-2 px-4 rounded mt-2 text-white hover:bg-green-600 w-full"
      >
        Submit
      </button>

      <ul className="mt-4">
        {history.map((g, i) => (
          <li key={i}>
            ₦{g.amount} - {g.purpose} - {g.date.toDate().toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Giving;
