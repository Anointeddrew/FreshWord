// src/pages/Admin/SocialLinks.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseconfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function AdminSocialLinks() {
  const [links, setLinks] = useState({
    facebook: '',
    telegram: '',
    twitter: '',
    instagram: '',
    youtube: '',
  });
  const [loading, setLoading] = useState(true);

  const docRef = doc(db, 'settings', 'churchSocialLinks');

  useEffect(() => {
    const fetchLinks = async () => {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setLinks(snap.data());
      }
      setLoading(false);
    };
    fetchLinks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks((prev) => ({ ...prev, [name]: value }));
  };

  const saveLinks = async () => {
    try {
      await setDoc(docRef, links);
      alert('Social media links updated successfully!');
    } catch (err) {
      console.error('Error saving links:', err);
      alert('Failed to update links');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center bg-green-700 text-white rounded py-2">
        Update Church Social Media Links
      </h2>

      <div className="space-y-4">
        <input
          type="url"
          name="facebook"
          placeholder="Facebook URL"
          value={links.facebook}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          name="telegram"
          placeholder="Telegram URL"
          value={links.telegram}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          name="twitter"
          placeholder="Twitter URL"
          value={links.twitter}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          name="instagram"
          placeholder="Instagram URL"
          value={links.instagram}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          name="youtube"
          placeholder="YouTube Channel URL"
          value={links.youtube}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={saveLinks}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Links
        </button>
      </div>
    </div>
  );
}

export default AdminSocialLinks;
