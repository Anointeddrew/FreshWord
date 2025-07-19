// src/pages/admin/AdminEvents.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    departments: ['all'],
  });

  const fetchEvents = async () => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEvents(list);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, date, location, description } = formData;
    if (!title || !date || !location || !description) {
      alert('Please fill in all fields');
      return;
    }

    const payload = {
      ...formData,
      date: new Date(date),
      createdAt: Timestamp.now(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'events', editingId), payload);
        alert('Event updated!');
      } else {
        await addDoc(collection(db, 'events'), payload);
        alert('Event created!');
      }

      setFormData({
        title: '',
        date: '',
        location: '',
        description: '',
        departments: ['all'],
      });
      setEditingId(null);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this event?')) {
      await deleteDoc(doc(db, 'events', id));
      fetchEvents();
    }
  };

  const handleEdit = (event) => {
    let safeDate = '';
    try {
      if (event.date?.seconds) {
        safeDate = new Date(event.date.seconds * 1000).toISOString().slice(0, 10);
      } else if (event.date) {
        safeDate = new Date(event.date).toISOString().slice(0, 10);
      }
    } catch {
      console.warn('Invalid date format in event:', event);
    }

    setEditingId(event.id);
    setFormData({
      title: event.title || '',
      date: safeDate,
      location: event.location || '',
      description: event.description || '',
      departments: event.departments || ['all'],
    });
  };

  // Safe date formatter for rendering
  const formatEventDate = (date) => {
    try {
      if (date?.seconds) {
        return new Date(date.seconds * 1000).toLocaleDateString();
      } else if (date) {
        return new Date(date).toLocaleDateString();
      }
    } catch {
      return 'Invalid date';
    }
    return 'N/A';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{editingId ? 'Edit Event' : 'Create Event'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Event Title"
          className="input w-full"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="date"
          className="input w-full"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className="input w-full"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        <textarea
          rows="3"
          placeholder="Description"
          className="input w-full"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <select
          multiple
          value={formData.departments}
          onChange={(e) =>
            setFormData({
              ...formData,
              departments: Array.from(e.target.selectedOptions, (opt) => opt.value),
            })
          }
          className="input w-full"
        >
          <option value="all">All</option>
          <option value="choir">Choir</option>
          <option value="media">Media</option>
          <option value="ushering">Ushering</option>
          <option value="follow-up">Follow-up</option>
        </select>

        <button type="submit" className="btn w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {editingId ? 'Update' : 'Create'} Event
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-700">{event.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                📍 {event.location} • 📅 {formatEventDate(event.date)}
              </p>
              <p className="text-sm text-gray-500">For: {event.departments?.join(', ')}</p>
              <div className="mt-2 space-x-2">
                <button onClick={() => handleEdit(event)} className="text-blue-600 hover:underline text-sm">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminEvents;
