import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

function AdminMessaging() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [receiver, setReceiver] = useState('all');
  const [members, setMembers] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'member'));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(list);
    };

    const fetchMessages = async () => {
      const q = query(collection(db, 'messages'), orderBy('sentAt', 'desc'));
      const snap = await getDocs(q);
      const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSentMessages(msgs);
    };

    fetchMembers();
    fetchMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('Please fill in all fields.');

    await addDoc(collection(db, 'messages'), {
      title,
      content,
      receiver,
      sentAt: Timestamp.now(),
    });

    alert('Message sent!');
    setTitle('');
    setContent('');
    setReceiver('all');

    // Refresh messages
    const snap = await getDocs(query(collection(db, 'messages'), orderBy('sentAt', 'desc')));
    const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSentMessages(msgs);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this message?');
    if (!confirm) return;

    await deleteDoc(doc(db, 'messages', id));
    setSentMessages(prev => prev.filter(msg => msg.id !== id));
    alert('Message deleted.');
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-center bg-green-700 rounded text-white py-2 mb-4">Send Message</h1>

      <form onSubmit={handleSend} className="bg-white p-4 rounded shadow space-y-4 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Message Title"
          className="input w-full rounded p-2 bg-green-200"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows="4"
          placeholder="Message Content"
          className="input w-full rounded p-2 bg-green-200"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div>
          <label className="block font-semibold mb-1">Send To</label>
          <select value={receiver} onChange={(e) => setReceiver(e.target.value)} className="input w-full rounded p-2 bg-green-200">
            <option value="all">All Members</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.fullName}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-600">Send Message</button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl text-green-700 font-bold mb-4">Recent Messages</h2>
        <div className="space-y-4">
          {sentMessages.map((msg) => (
            <div key={msg.id} className="bg-green-200 p-4 rounded shadow">
              <h3 className="font-bold">{msg.title}</h3>
              <p>{msg.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Sent to: {msg.receiver === 'all' ? 'All Members' : msg.receiver} •{' '}
                {msg.sentAt?.toDate().toLocaleString()}
              </p>
              <button
                onClick={() => handleDelete(msg.id)}
                className="text-red-600 text-sm mt-2 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminMessaging;
