import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(list);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const messageRef = doc(db, 'messages', id);
      await updateDoc(messageRef, { read: true });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
      alert('Failed to mark as read.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Messages Inbox</h2>

      {loading && <p>Loading messages...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className={`p-4 rounded shadow ${
                msg.read ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{msg.subject || 'No Subject'}</h3>
                  <p className="text-sm text-gray-600">
                    From: {msg.name || 'Anonymous'} ({msg.email})
                  </p>
                  <p className="text-xs text-gray-500">
                    {msg.timestamp?.toDate().toLocaleString()}
                  </p>
                </div>
                {!msg.read && (
                  <button
                    onClick={() => handleMarkAsRead(msg.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
              <p className="text-gray-800">{msg.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Messages;
