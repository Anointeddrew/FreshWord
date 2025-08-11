import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

function AdminAnnouncement() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [department, setDepartment] = useState('all');
  const [announcements, setAnnouncements] = useState([]);
  const [editId, setEditId] = useState(null);

  const departments = ['all', 'choir', 'ushering', 'media', 'children', 'prayer', 'Sanitation'];

  const fetchAnnouncements = async () => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAnnouncements(list);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('Please fill in title and content.');

    if (editId) {
      const docRef = doc(db, 'announcements', editId);
      await updateDoc(docRef, {
        title,
        content,
        link,
        department,
      });
      alert('Announcement updated!');
      setEditId(null);
    } else {
      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        link,
        department,
        createdAt: Timestamp.now()
      });
      alert('Announcement posted!');
    }

    setTitle('');
    setContent('');
    setLink('');
    setDepartment('all');
    fetchAnnouncements();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await deleteDoc(doc(db, 'announcements', id));
      fetchAnnouncements();
    }
  };

  const handleEdit = (announcement) => {
    setEditId(announcement.id);
    setTitle(announcement.title);
    setContent(announcement.content);
    setLink(announcement.link);
    setDepartment(announcement.department);
  };

  return (
    <div className="p-2 max-w-2xl mx-auto bg-white rounded shadow-md">
      <h1 className="text-2xl text-center rounded font-bold mb-4">{editId ? 'Edit Announcement' : 'Create Announcement'}</h1>

      <form onSubmit={handleSubmit} className="bg-green-200 p-4 rounded shadow max-w-xl space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="input bg-white border border-gray-300 rounded p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows="4"
          placeholder="Content"
          className="input bg-white border border-gray-300 rounded p-2 w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Attachment Link (optional)"
          className="input bg-white border border-gray-300 rounded p-2 w-full"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <select
          className="input bg-white border border-gray-300 rounded p-2 w-full"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>
          ))}
        </select>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          {editId ? 'Update Announcement' : 'Post Announcement'}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl text-center font-bold mb-4">Recent Announcements</h2>
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-green-200 p-4 rounded shadow relative">
              <h3 className="font-bold">{a.title}</h3>
              <p>{a.content}</p>
              {a.link && (
                <p className="mt-1 text-blue-600 underline">
                  <a href={a.link} target="_blank" rel="noopener noreferrer">View Attachment</a>
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Target: {a.department === 'all' ? 'All Departments' : a.department} •{' '}
                {a.createdAt?.toDate().toLocaleString()}
              </p>

              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(a)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
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

export default AdminAnnouncement;
