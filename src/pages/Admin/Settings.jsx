import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function AdminSettings() {
  const [titheAccount, setTitheAccount] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
  });

  const [welfareAccount, setWelfareAccount] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const ref = doc(db, 'settings', 'churchInfo');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.titheAccount) setTitheAccount(data.titheAccount);
        if (data.welfareAccount) setWelfareAccount(data.welfareAccount);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    const ref = doc(db, 'settings', 'churchInfo');
    await setDoc(
      ref,
      {
        titheAccount,
        welfareAccount,
      },
      { merge: true }
    );
    alert('Church accounts updated!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow-md">
      <h2 className="text-xl font-bold text-center bg-green-700 rounded text-white py-2 mb-4">Church Account Settings</h2>

      {/* Tithe Account Section */}
      <div className="mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold mb-2 text-green-700">Tithe Account</h3>
        <input
          value={titheAccount.accountName}
          onChange={(e) => setTitheAccount({ ...titheAccount, accountName: e.target.value })}
          type="text"
          placeholder="Account Name"
          className="input mb-3 w-full"
        />
        <input
          value={titheAccount.accountNumber}
          onChange={(e) => setTitheAccount({ ...titheAccount, accountNumber: e.target.value })}
          type="text"
          placeholder="Account Number"
          className="input mb-3 w-full"
        />
        <input
          value={titheAccount.bankName}
          onChange={(e) => setTitheAccount({ ...titheAccount, bankName: e.target.value })}
          type="text"
          placeholder="Bank Name"
          className="input mb-3 w-full"
        />
      </div>

      {/* Welfare Account Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-green-700">Welfare Account</h3>
        <input
          value={welfareAccount.accountName}
          onChange={(e) => setWelfareAccount({ ...welfareAccount, accountName: e.target.value })}
          type="text"
          placeholder="Account Name"
          className="input mb-3 w-full"
        />
        <input
          value={welfareAccount.accountNumber}
          onChange={(e) => setWelfareAccount({ ...welfareAccount, accountNumber: e.target.value })}
          type="text"
          placeholder="Account Number"
          className="input mb-3 w-full"
        />
        <input
          value={welfareAccount.bankName}
          onChange={(e) => setWelfareAccount({ ...welfareAccount, bankName: e.target.value })}
          type="text"
          placeholder="Bank Name"
          className="input mb-3 w-full"
        />
      </div>

      <button
        onClick={saveSettings}
        className="btn bg-green-700 text-white w-full hover:bg-green-600"
      >
        Save Account Info
      </button>
    </div>
  );
}

export default AdminSettings;
