import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseconfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Profile() {
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    dob: '',
    maritalStatus: '',
    occupation: '',
    department: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile({ ...profile, ...docSnap.data() });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(docRef, { ...profile }, { merge: true });
    alert('Profile updated!');
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      {Object.entries(profile).map(([key, val]) => (
        <input
          key={key}
          name={key}
          value={val}
          onChange={handleChange}
          placeholder={key}
          className="w-full input p-2 border border-gray-300 rounded"
        />
      ))}
      <button onClick={handleSave} className="bg-green-700 py-2 px-4 rounded text-white mt-2 hover:bg-green-600">Save</button>
    </div>
  );
}

export default Profile;
