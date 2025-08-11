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
    departmentApprovalStatus: '',  // new field
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

    // When department changes, mark approval as pending
    const docSnap = await getDoc(docRef);
    const currentData = docSnap.exists() ? docSnap.data() : {};

    let updatedData = { ...profile };

    if (currentData.department !== profile.department) {
      updatedData.departmentApprovalStatus = 'pending';
    } else {
      // keep existing approval status if department unchanged
      updatedData.departmentApprovalStatus = currentData.departmentApprovalStatus || '';
    }

    await setDoc(docRef, updatedData, { merge: true });
    alert('Profile updated! Your department is pending admin approval.');
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h1 className="bg-green-700 text-white p-2 text-center rounded font-bold mb-2">Kindly update your profile information</h1>

      {Object.entries(profile).map(([key, val]) => {
        if (key === 'departmentApprovalStatus') return null; // hide this field from user input
        return (
          <input
            key={key}
            name={key}
            value={val}
            onChange={handleChange}
            placeholder={key}
            className="w-full input p-2 border border-gray-300 rounded"
          />
        );
      })}

      {profile.departmentApprovalStatus === 'pending' && (
        <p className="text-yellow-600 font-semibold">
          Your department is pending admin approval.
        </p>
      )}
      {profile.departmentApprovalStatus === 'rejected' && (
        <p className="text-red-600 font-semibold">
          Your department was rejected. Please update it.
        </p>
      )}

      <button
        onClick={handleSave}
        className="bg-green-700 py-2 px-4 rounded text-white mt-2 hover:bg-green-600"
      >
        Save
      </button>
    </div>
  );
}

export default Profile;
