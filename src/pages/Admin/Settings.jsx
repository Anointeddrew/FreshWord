import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function AdminSettings() {
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState(''); // New state

  useEffect(() => {
    const fetchSettings = async () => {
      const ref = doc(db, 'settings', 'churchInfo');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setAccountNumber(data.accountNumber || '');
        setBankName(data.bankName || '');
        setAccountName(data.accountName || ''); // Fetch account name
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    const ref = doc(db, 'settings', 'churchInfo');
    await setDoc(
      ref,
      { accountNumber, bankName, accountName }, // Save account name
      { merge: true }
    );
    alert('Church account details updated!');
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Church Account Settings</h2>

      <input
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        type="text"
        placeholder="Account Name"
        className="input mb-3 w-full"
      />

      <input
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        type="text"
        placeholder="Account Number"
        className="input mb-3 w-full"
      />

      <input
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        type="text"
        placeholder="Bank Name"
        className="input mb-3 w-full"
      />

      <button
        onClick={saveSettings}
        className="btn bg-blue-600 text-white w-full"
      >
        Save Account Info
      </button>
    </div>
  );
}

export default AdminSettings;
