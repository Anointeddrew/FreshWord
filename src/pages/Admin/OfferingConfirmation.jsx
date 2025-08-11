import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseconfig';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

function AdminGivingApproval() {
  const [pendingGivings, setPendingGivings] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      const q = query(collection(db, 'giving'), where('approvalStatus', '==', 'pending'));
      const snapshot = await getDocs(q);
      setPendingGivings(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchPending();
  }, []);

  const approveGiving = async (id) => {
    await updateDoc(doc(db, 'giving', id), { approvalStatus: 'approved' });
    setPendingGivings(pendingGivings.filter(g => g.id !== id));
  };

  const rejectGiving = async (id) => {
    await updateDoc(doc(db, 'giving', id), { approvalStatus: 'rejected' });
    setPendingGivings(pendingGivings.filter(g => g.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Givings</h2>
      {pendingGivings.length === 0 ? (
        <p>No pending givings</p>
      ) : (
        pendingGivings.map(g => (
          <div key={g.id} className="p-4 border rounded mb-2">
            <p><strong>Amount:</strong> ₦{g.amount}</p>
            <p><strong>Purpose:</strong> {g.purpose}</p>
            <button onClick={() => approveGiving(g.id)} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Approve</button>
            <button onClick={() => rejectGiving(g.id)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminGivingApproval;
