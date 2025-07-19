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

  useEffect(() => {
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

        // Real-time announcement listener
        let firstLoad = true;
        const annQuery = query(
          collection(db, 'announcements'),
          where('department', 'in', [dept, 'all']),
          orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(annQuery, (snapshot) => {
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

        // Cleanup
        return () => {
          if (unsubscribe) unsubscribe();
        };
      }

      const attendanceSnap = await getDocs(query(
        collection(db, 'attendance'),
        where('uid', '==', auth.currentUser.uid)
      ));
      setAttendanceCount(attendanceSnap.size);

      const givingSnap = await getDocs(query(
        collection(db, 'giving'),
        where('uid', '==', auth.currentUser.uid)
      ));
      const total = givingSnap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
      setTotalGiving(total);
    };

    const fetchEvents = async () => {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => doc.data());
      setEvents(list);
    };

    fetchDashboardData();
    fetchEvents();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce transition-opacity duration-500">
          📢 <strong>{newAnnouncementTitle}</strong> just arrived!
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Welcome, {fullName || 'Member'} 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="text-gray-600">Profile Completion</p>
          <p className="text-xl font-bold">{profileCompletion}%</p>
          <Link to="/member/profile" className="text-blue-600 text-sm">Update Profile</Link>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="text-gray-600">Attendance</p>
          <p className="text-xl font-bold">{attendanceCount}</p>
          <Link to="/member/attendance" className="text-blue-600 text-sm">View Attendance</Link>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="text-gray-600">Total Giving</p>
          <p className="text-xl font-bold">₦{totalGiving.toLocaleString()}</p>
          <Link to="/member/giving" className="text-blue-600 text-sm">View Giving</Link>
        </div>
      </div>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <ul className="space-y-2">
            {events.map((event, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded shadow-sm">
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
        <h2 className="text-xl font-semibold mb-4">Announcements for {department || 'your department'}</h2>
        {loadingAnnouncements ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements for your department.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold text-lg">{a.title}</h3>
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
        <Link to="/member/messages" className="btn">Messages</Link>
        <Link to="/member/profile" className="btn">My Profile</Link>
        <Link to="/member/giving" className="btn">Give Now</Link>
      </div>
    </div>
  );
}

export default MemberDashboard;
