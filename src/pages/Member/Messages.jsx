import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebaseconfig';

function Messages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const q = query(collection(db, 'messages'), where('receiver', 'in', [auth.currentUser.uid, 'all']));
    const snap = await getDocs(q);
    setMessages(snap.docs.map(doc => doc.data()));
  };

  useEffect(() => { fetchMessages(); }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-lg text-center bg-green-700 rounded text-white font-bold">Messages</h2>
      {messages.map((m, i) => (
        <div key={i} className="border bg-green-200 p-2 my-2">
          <strong>{m.title}</strong>
          <p>{m.content}</p>
          <span className="text-sm text-gray-500">{new Date(m.sentAt?.seconds * 1000).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default Messages;
