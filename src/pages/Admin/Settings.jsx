import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function AdminSettings() {
  const [tithe, setTithe] = useState({
    accountName: '',
    accountNumber: '',
    bankName: ''
  });

  const [welfare, setWelfare] = useState({
    accountName: '',
    accountNumber: '',
    bankName: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const ref = doc(db, 'settings', 'churchInfo');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setTithe(data.tithe || {});
        setWelfare(data.welfare || {});
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (type, field, value) => {
    if (type === 'tithe') {
      setTithe(prev => ({ ...prev, [field]: value }));
    } else {
      setWelfare(prev => ({ ...prev, [field]: value }));
    }
  };

  const saveSettings = async () => {
    const ref = doc(db, 'settings', 'churchInfo');
    await setDoc(ref, { tithe, welfare }, { merge: true });
    alert('Account info updated successfully!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow-md">
      <h2 className="text-xl font-bold text-center bg-green-700 rounded text-white py-2 mb-6">
        Church Account Settings
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Tithe Account</h3>
        <input
          value={tithe.accountName}
          onChange={(e) => handleChange('tithe', 'accountName', e.target.value)}
          type="text"
          placeholder="Account Name"
          className="input w-full mb-2"
        />
        <input
          value={tithe.accountNumber}
          onChange={(e) => handleChange('tithe', 'accountNumber', e.target.value)}
          type="text"
          placeholder="Account Number"
          className="input w-full mb-2"
        />
        <input
          value={tithe.bankName}
          onChange={(e) => handleChange('tithe', 'bankName', e.target.value)}
          type="text"
          placeholder="Bank Name"
          className="input w-full mb-2"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Welfare Account</h3>
        <input
          value={welfare.accountName}
          onChange={(e) => handleChange('welfare', 'accountName', e.target.value)}
          type="text"
          placeholder="Account Name"
          className="input w-full mb-2"
        />
        <input
          value={welfare.accountNumber}
          onChange={(e) => handleChange('welfare', 'accountNumber', e.target.value)}
          type="text"
          placeholder="Account Number"
          className="input w-full mb-2"
        />
        <input
          value={welfare.bankName}
          onChange={(e) => handleChange('welfare', 'bankName', e.target.value)}
          type="text"
          placeholder="Bank Name"
          className="input w-full mb-2"
        />
      </div>

      <button
        onClick={saveSettings}
        className="btn bg-green-700 text-white w-full hover:bg-green-600"
      >
        Save All Account Info
      </button>
    </div>
  );
}

export default AdminSettings;
