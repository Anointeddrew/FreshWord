import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from '../../firebaseconfig';

function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const [replyBoxesOpen, setReplyBoxesOpen] = useState({}); // Track which reply boxes are open

  useEffect(() => {
    const fetchSuggestions = async () => {
      const q = query(collection(db, 'suggestions'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuggestions(list);
    };

    fetchSuggestions();
  }, []);

  const handleReplyChange = (id, value) => {
    setReplyInputs(prev => ({ ...prev, [id]: value }));
  };

  const toggleReplyBox = (id) => {
    setReplyBoxesOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveReply = async (id) => {
    const reply = replyInputs[id];
    if (!reply || reply.trim() === '') {
      alert('Reply cannot be empty.');
      return;
    }

    const suggestion = suggestions.find(s => s.id === id);
    const suggestionRef = doc(db, 'suggestions', id);

    try {
      // Update suggestion with reply
      await updateDoc(suggestionRef, {
        reply: reply.trim(),
        replyNotified: false,
      });

      // Send notification to the member
      if (suggestion && suggestion.memberId) {
        await addDoc(collection(db, 'notifications'), {
          userId: suggestion.memberId,
          type: 'suggestion-reply',
          title: 'Admin replied to your suggestion',
          message: reply.trim(),
          read: false,
          timestamp: new Date(),
        });
      }

      setSuggestions(prev =>
        prev.map(s => (s.id === id ? { ...s, reply: reply.trim() } : s))
      );
      alert('Reply saved and member notified!');
      // Close the reply box and clear input
      setReplyBoxesOpen(prev => ({ ...prev, [id]: false }));
      setReplyInputs(prev => ({ ...prev, [id]: '' }));
    } catch (error) {
      console.error('Error saving reply:', error);
      alert('Failed to save reply');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this suggestion?')) {
      await deleteDoc(doc(db, 'suggestions', id));
      setSuggestions(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl text-center bg-green-700 rounded text-white py-2 font-bold mb-4">Testimonies & Suggestions</h1>
      {suggestions.length === 0 ? (
        <p>No suggestions submitted yet.</p>
      ) : (
        <ul className="space-y-6">
          {suggestions.map(s => (
            <li key={s.id} className="bg-green-200 shadow p-4 rounded">
              <p className="text-sm text-gray-500">
                {new Date(s.timestamp.seconds * 1000).toLocaleString()}
              </p>
              <h2 className="font-bold">{s.name || 'Unnamed Member'}</h2>
              <p className="mb-2">{s.message}</p>

              {/* Existing reply display (if any) */}
              {s.reply && (
                <p className="text-green-700 bg-white p-2 rounded mb-2">
                  <strong>Reply:</strong> {s.reply}
                </p>
              )}

              {/* Reply button */}
              <div className="flex flex-col">
              <button
                className="px-3 py-1 text-white mt-2 bg-green-700 rounded hover:bg-green-600 mb-2"
                onClick={() => toggleReplyBox(s.id)}
              >
                {replyBoxesOpen[s.id] ? 'Cancel Reply' : 'Reply'}
              </button>
              

              {/* Conditionally render reply input and save button */}
              {replyBoxesOpen[s.id] && (
                <>
                  <textarea
                    rows={2}
                    className="w-full border p-2 rounded mb-2"
                    placeholder="Write a reply..."
                    value={replyInputs[s.id] || ''}
                    onChange={(e) => handleReplyChange(s.id, e.target.value)}
                  />
                  <button
                    className="px-3 py-1 mb-2 bg-green-700 text-white w-full rounded hover:bg-green-600 mr-3"
                    onClick={() => handleSaveReply(s.id)}
                  >
                    Save Reply
                  </button>
                </>
              )}
              </div>

              <div className="flex flex-col">
              <button
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDelete(s.id)}
              >
                Delete
              </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminSuggestions;
