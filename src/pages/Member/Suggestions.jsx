import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseconfig';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  deleteDoc,
  orderBy,
  updateDoc,
  doc
} from 'firebase/firestore';

function MemberSuggestions() {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [editData, setEditData] = useState({ id: null, message: '' });

  const fetchSuggestions = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'suggestions'),
        where('memberId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setSuggestions(list);
      // After suggestions are shown, mark unseen replies as notified
      setTimeout(async () => {
        try {
          await Promise.all(
        list
          .filter(s => s.reply && s.replyNotified !== true)
          .map(s => updateDoc(doc(db, 'suggestions', s.id), { replyNotified: true }))
      );
    } catch (err) {
      console.error('Error marking replies as notified:', err);
    }
    }, 500); // short delay to allow UI rendering

      setSuggestions(list);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert('Message cannot be empty');

    setSubmitting(true);
      const user = auth.currentUser;

      try {
        if (editData.id) {
          await updateDoc(doc(db, 'suggestions', editData.id), { message, timestamp: Timestamp.now(), });
          alert('Updated successfully!');
        } else {
      await addDoc(collection(db, 'suggestions'), {
        memberId: user.uid,
        name: user.displayName || 'Anonymous',
        message,
        timestamp: Timestamp.now(),
        replyNotified: false,
      });
      alert('Sent successfully!');
    }

      setMessage('');
      setEditData({id: null, message: ''});
      fetchSuggestions(); // Refresh list
    } catch (error) {
      console.error('Error sending suggestion:', error);
      alert('Failed to send suggestion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (id) => {
    const suggestion = suggestions.find(s => s.id === id);
    if (suggestion) {
      setEditData({ id, message: suggestion.message });
      setMessage(suggestion.message);
    }

  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this suggestion?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'suggestions', id));
      setSuggestions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting suggestion:', err);
      alert('Failed to delete suggestion');
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow-md">
      <h1 className="text-xl bg-green-700 rounded text-center text-white font-bold mb-4">Share a Testimony or Send a Suggestion</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-gray-50 p-2 rounded shadow">
        <textarea
          rows="4"
          className="w-full p-2 border rounded"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          {submitting ? 'Sending...' : 'Share Testimony/ Send Suggestion'}
        </button>
        {editData.id && (
  <button
    type="button"
    onClick={() => {
      setEditData({ id: null, message: '' });
      setMessage('');
    }}
    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-2"
  >
    Cancel Edit
  </button>
)}

      </form>

      <h2 className="text-lg font-semibold mb-2">HISTORY</h2>
      {suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {suggestions.map(s => (
            <li key={s.id} className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">
                {new Date(s.timestamp?.seconds * 1000).toLocaleString()}
              </p>
              <p className="mt-1">{s.message}</p>
              {s.reply && (
                <div className="mt-2 bg-green-100 text-green-800 p-2 rounded">
                  <strong>Admin Reply:</strong> {s.reply}
                  {!s.replyNotified && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-1 rounded-bl"> 🆕 New Reply </span>
                  )}
                </div>
              )}
              <button
                onClick={() => handleEdit(s.id)}
                className="bg-blue-500 text-white mt-2 px-2 mr-1 py-1 text-sm rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-500 text-white mt-2 px-2 py-1 text-sm rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MemberSuggestions;
