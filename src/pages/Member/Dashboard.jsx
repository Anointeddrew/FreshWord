import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseconfig';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTelegram,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa';


function MemberDashboard() {
  const [fullName, setFullName] = useState('');
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [totalGiving, setTotalGiving] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [events, setEvents] = useState([]);
  const [department, setDepartment] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [dailyVerse, setDailyVerse] = useState(null);

  const [links, setLinks] = useState({
  facebook: '',
  telegram: '',
  twitter: '',
  instagram: '',
  youtube: '',
});


useEffect(() => {
  let unsubscribeAnnouncements;
  let unsubscribeGiving;

  const fetchDashboardData = async () => {
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setFullName(data.fullName || '');
      const dept = data.department || '';
      setDepartment(dept);

      const totalFields = 6;
      const filledFields = ['fullName', 'phone', 'dob', 'maritalStatus', 'occupation', 'department']
        .filter(field => data[field] && data[field] !== '').length;
      setProfileCompletion(Math.round((filledFields / totalFields) * 100));

      const annQuery = query(
        collection(db, 'announcements'),
        where('department', 'in', [dept, 'all']),
        orderBy('createdAt', 'desc')
      );

      let firstLoad = true;
      unsubscribeAnnouncements = onSnapshot(annQuery, (snapshot) => {
        const annList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (!firstLoad && annList.length > announcements.length) {
          const latest = annList[0];
          setNewAnnouncementTitle(latest.title || 'New Announcement');
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }
        setAnnouncements(annList);
        setLoadingAnnouncements(false);
        firstLoad = false;
      });

      // Real-time giving updates
      const givingQuery = query(
        collection(db, 'giving'),
        where('uid', '==', auth.currentUser.uid)
      );
      unsubscribeGiving = onSnapshot(givingQuery, (snapshot) => {
        const total = snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
        setTotalGiving(total);
      });
    }

    // Counts attendance records
    const attendanceSnap = await getDocs(query(
      collection(db, 'attendance'),
      where('uid', '==', auth.currentUser.uid)
    ));
    setAttendanceCount(attendanceSnap.size);
  };

  const fetchEvents = async () => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const snap = await getDocs(q);
    const list = snap.docs.map(doc => doc.data());
    setEvents(list);
  };

  const fetchSocialLinks = async () => {
  try {
    const docRef = doc(db, 'settings', 'churchSocialLinks');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setLinks(docSnap.data());
    }
  } catch (err) {
    console.error('Failed to fetch social links:', err);
  }
};

const fetchDailyScripture = async () => {
  const today = new Date();
  const key = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  try {
    const docRef = doc(db, 'dailyScriptures', key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDailyVerse(docSnap.data());
    }
  } catch (error) {
    console.error('Failed to fetch daily scripture:', error);
  }
};

  fetchDailyScripture();
  fetchDashboardData();
  fetchEvents();
  fetchSocialLinks();

  return () => {
    if (unsubscribeAnnouncements) unsubscribeAnnouncements();
    if (unsubscribeGiving) unsubscribeGiving();
  };
}, []);


  return (
    <div className="p-4 bg-white max-w-4xl mx-auto relative">
      {/* Popup Notification */}
      {showNotification && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce transition-opacity duration-500">
          📢 <strong>{newAnnouncementTitle}</strong> just arrived!
        </div>
      )}

      <h1 className="text-2xl bg-white  text-center rounded font-bold mb-4">Welcome, {fullName || 'Member'} 👋</h1>
      {dailyVerse && (
  <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 mb-4 rounded shadow">
    <p className="text-sm text-gray-700">📖 <strong>{dailyVerse.verse}</strong></p>
    <p className="text-gray-900 mt-1 italic">"{dailyVerse.text}"</p>
  </div>
)}


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow border border-gray-200 rounded-lg">
          <p className="text-gray-600 font-bold">Profile Completion</p>
          <p className="text-xl font-bold">{profileCompletion}%</p>
          <Link to="/member/profile" className="text-blue-600 text-sm">Update Profile</Link>
        </div>
        <div className="bg-white p-4 shadow border border-gray-200 rounded-lg">
          <p className="text-gray-600 font-bold">Attendance</p>
          <p className="text-xl font-bold">{attendanceCount}</p>
          <Link to="/member/attendance" className="text-blue-600 text-sm">View Attendance</Link>
        </div>
        <div className="bg-white p-4 shadow border border-gray-200 rounded-lg">
          <p className="text-gray-600 font-bold">Total Giving</p>
          <p className="text-xl font-bold">₦{totalGiving.toLocaleString()}</p>
          <Link to="/member/giving" className="text-blue-600 text-sm">View Giving</Link>
        </div>
      </div>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl text-green-700 font-bold mb-4 text-center">Upcoming Events</h2>
          <ul className="space-y-2">
            {events.map((event, index) => (
              <li key={index} className="bg-white p-4 rounded shadow-sm">
                <p className="font-bold">{event.title}</p>
                <p className="text-sm text-gray-700">{event.date?.toDate?.().toLocaleDateString()}</p>
                {event.description && <p className="text-sm mt-1">{event.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Announcements */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-center">Announcement for {department || 'your department'}</h2>
        {loadingAnnouncements ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="bg-gray-100 rounded p-4 shadow">
                <h3 className="font-bold text-lg">{a.title}</h3>
                <p className="mt-1">{a.content}</p>
                {a.link && (
                  <p className="mt-1 text-blue-600 underline">
                    <a href={a.link} target="_blank" rel="noopener noreferrer">View Attachment</a>
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {a.createdAt?.toDate?.().toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-x-4">
        <Link to="/member/messages" className="text-white text-md py-2 px-2 bg-green-700 rounded hover:bg-green-600">Messages</Link>
        <Link to="/member/profile" className="text-white text-md py-2 px-2 bg-green-700 rounded hover:bg-green-600">My Profile</Link>
        <Link to="/member/giving" className="text-white text-md py-2 px-2 bg-green-700 rounded hover:bg-green-600">Give Now</Link>
      </div>
      {/* Social Media Links */}
      <div className="bg-white p-4 rounded shadow mt-6">
  <h3 className="text-lg font-semibold mb-2">Follow Us...</h3>
  <div className="space-x-4 text-xl text-green-700">
    {links.facebook && (
      <a href={links.facebook} target="_blank" rel="noopener noreferrer">
        <FaFacebook className="inline hover:text-blue-600 text-blue-600" />
      </a>
    )}
    {links.telegram && (
      <a href={links.telegram} target="_blank" rel="noopener noreferrer">
        <FaTelegram className="inline hover:text-blue-600 text-blue-600" />
      </a>
    )}
    {links.twitter && (
      <a href={links.twitter} target="_blank" rel="noopener noreferrer">
        <FaTwitter className="inline hover:text-blue-500 text-blue-500" />
      </a>
    )}
    {links.instagram && (
      <a href={links.instagram} target="_blank" rel="noopener noreferrer">
        <FaInstagram className="inline hover:text-pink-600 text-pink-600" />
      </a>
    )}
    {links.youtube && (
      <a href={links.youtube} target="_blank" rel="noopener noreferrer">
        <FaYoutube className="inline hover:text-red-600 text-red-600" />
      </a>
    )}
  </div>
</div>
    </div>
    
  );
}

export default MemberDashboard;
