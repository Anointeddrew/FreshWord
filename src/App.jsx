import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import AdminLayout from './Layouts/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminAttendance from './pages/Admin/Attendance';
import AdminGiving from './pages/Admin/Giving';
import AdminMessaging from './pages/Admin/Messaging';
import AdminAnnouncement from './pages/Admin/Announcements';
import AdminEvents from './pages/Admin/Events';
import AdminSuggestions from './pages/Admin/Suggestions';
import MemberLayout from './Layouts/MemberLayout';
import MemberDashboard from './pages/Member/Dashboard';
import MemberProfile from './pages/Member/Profile';
import MemberAttendance from './pages/Member/Attendance';
import MemberGiving from './pages/Member/Giving';
import MemberMessages from './pages/Member/Messages';
import MemberSuggestions from './pages/Member/Suggestions';
import ProtectedRoute from './Routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="giving" element={<AdminGiving />} />
            <Route path="messaging" element={<AdminMessaging />} />
            <Route path="announcements" element={<AdminAnnouncement />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="suggestion" element={<AdminSuggestions />} />
          </Route>

          {/* Member Protected Routes */}
          <Route path="/member" element={
            <ProtectedRoute allowedRole="member">
              <MemberLayout />
            </ProtectedRoute>
          }>
            <Route index element={<MemberDashboard />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="attendance" element={<MemberAttendance />} />
            <Route path="giving" element={<MemberGiving />} />
            <Route path="messages" element={<MemberMessages />} />
            <Route path="suggestions" element={<MemberSuggestions />} />

          </Route>

          {/* Default Route */}
          <Route path="/" element={<Login />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
