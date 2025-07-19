import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseconfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

function MemberSuggestions() {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      });

      setMessage('');
      alert('Suggestion sent to admin!');
    } catch (error) {
      console.error('Error sending suggestion:', error);
      alert('Failed to send suggestion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Send a Suggestion or Comment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {submitting ? 'Sending...' : 'Send Suggestion'}
        </button>
      </form>
    </div>
  );
}

export default MemberSuggestions;
