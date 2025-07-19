import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(items);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  };

  const deleteNotification = async (id) => {
    await deleteDoc(doc(db, 'notifications', id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map(n => (
            <li
              key={n.id}
              className={`p-4 rounded border relative ${n.read ? 'bg-gray-100' : 'bg-white shadow'}`}
            >
              <h4 className="font-semibold">{n.title || 'Notification'}</h4>
              <p className="text-sm text-gray-600">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{n.timestamp?.toDate().toLocaleString()}</p>
              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-sm text-blue-500 hover:underline mt-2"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => deleteNotification(n.id)}
                className="absolute top-2 right-2 text-sm text-red-600 hover:underline"
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

export default Notifications;
