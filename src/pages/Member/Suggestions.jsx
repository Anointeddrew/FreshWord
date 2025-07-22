import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseconfig';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  updateDoc,
  doc
} from 'firebase/firestore';

function MemberSuggestions() {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

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

      // Mark unseen replies as notified, await all updates before proceeding
      await Promise.all(
        list
          .filter(s => s.reply && s.replyNotified !== true)
          .map(s => updateDoc(doc(db, 'suggestions', s.id), { replyNotified: true }))
      );

      setSuggestions(list);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert('Message cannot be empty');

    setSubmitting(true);
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'suggestions'), {
        memberId: user.uid,
        name: user.displayName || 'Anonymous',
        message,
        timestamp: Timestamp.now(),
        replyNotified: false,
      });

      setMessage('');
      alert('Suggestion sent successfully!');
      fetchSuggestions(); // Refresh list
    } catch (error) {
      console.error('Error sending suggestion:', error);
      alert('Failed to send suggestion');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow-md">
      <h1 className="text-xl bg-green-700 rounded text-center text-white font-bold mb-4">Send a Suggestion or Comment</h1>
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
          {submitting ? 'Sending...' : 'Send Suggestion'}
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Your Past Suggestions</h2>
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
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MemberSuggestions;
