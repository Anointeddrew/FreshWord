import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseconfig';
import {
  collection, addDoc, getDocs, getDoc, query, where, Timestamp, doc, deleteDoc, updateDoc
} from 'firebase/firestore';

function Giving() {
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);
  const [accountInfo, setAccountInfo] = useState({});
  const [purpose, setPurpose] = useState('tithe');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ amount: '', purpose: '' });

  const submitGiving = async () => {
    if (!amount) return alert("Enter an amount");

    await addDoc(collection(db, 'giving'), {
      uid: auth.currentUser.uid,
      amount: parseFloat(amount),
      date: Timestamp.now(),
      purpose,
      approvalStatus: 'pending' // 🔹 New field for admin approval
    });

    setAmount('');
    fetchGiving();
    alert("Your giving has been submitted and is pending admin approval.");
  };

  const fetchGiving = async () => {
    const q = query(collection(db, 'giving'), where('uid', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setHistory(list);
  };

  const fetchAccountInfo = async () => {
    const ref = doc(db, 'settings', 'churchInfo');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setAccountInfo(snap.data());
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this record?");
    if (!confirmDelete) return;
    await deleteDoc(doc(db, 'giving', id));
    setHistory(history.filter(item => item.id !== id));
  };

  const handleEdit = (item) => {
    if (item.approvalStatus === 'approved') {
      alert("Approved givings cannot be edited.");
      return;
    }
    setEditId(item.id);
    setEditData({ amount: item.amount, purpose: item.purpose });
  };

  const handleUpdate = async (id) => {
    if (!editData.amount || !editData.purpose) return alert("Fill all fields");
    const ref = doc(db, 'giving', id);
    await updateDoc(ref, {
      amount: parseFloat(editData.amount),
      purpose: editData.purpose,
      approvalStatus: 'pending' // reset to pending if edited
    });
    setEditId(null);
    fetchGiving();
  };

  useEffect(() => {
    fetchGiving();
    fetchAccountInfo();
  }, []);

  const selectedAccount = accountInfo[purpose] || {};

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl text-center text-white bg-green-700 rounded font-bold mb-4">Giving</h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Select Purpose:</label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full p-2 border rounded bg-gray-100"
        >
          <option value="tithe">Tithe</option>
          <option value="welfare">Welfare</option>
        </select>
      </div>

      {selectedAccount.accountNumber && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded">
          <p><strong>Bank Name:</strong> {selectedAccount.bankName}</p>
          <p><strong>Account Number:</strong> {selectedAccount.accountNumber}</p>
          <p><strong>Account Name:</strong> {selectedAccount.accountName || 'Fresh Word Bible Church'}</p>
          <p className="mt-2 text-center text-sm text-black">
            Please use these details for your giving.
          </p>
        </div>
      )}

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="Enter amount"
        className="input bg-gray-100 border border-gray-300 rounded p-2 w-full"
      />
      <button
        onClick={submitGiving}
        className="bg-green-700 py-2 px-4 rounded mt-2 hover:bg-green-600 text-white w-full"
      >
        Submit
      </button>

      <ul className="mt-6 divide-y">
        {history.map((g) => (
          <li key={g.id} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            {editId === g.id ? (
              <div className="w-full sm:w-2/3">
                <input
                  type="number"
                  className="border p-1 mr-2 w-full sm:w-1/3"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                />
                <select
                  className="border p-1 w-full sm:w-1/3 mt-2 sm:mt-0"
                  value={editData.purpose}
                  onChange={(e) => setEditData({ ...editData, purpose: e.target.value })}
                >
                  <option value="tithe">Tithe</option>
                  <option value="welfare">Welfare</option>
                </select>
                <div className="mt-2 sm:mt-0 sm:inline-block">
                  <button
                    onClick={() => handleUpdate(g.id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-800">
                  ₦{g.amount} - {g.purpose || 'General'} - {g.date?.toDate().toDateString()}
                </p>
                <p className={`text-sm font-semibold ${g.approvalStatus === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {g.approvalStatus === 'approved' ? 'Approved' : 'Pending Approval'}
                </p>
                <div className="mt-2 sm:mt-0 flex gap-2 text-sm">
                  <button onClick={() => handleEdit(g)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(g.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {history.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No giving history available.</p>
        )}
      </ul>
    </div>
  );
}

export default Giving;
