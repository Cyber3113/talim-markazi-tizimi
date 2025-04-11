import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import Navbar from '@/components/Navbar';
import CEODashboard from '@/components/dashboard/CEODashboard';
import MentorDashboard from '@/components/dashboard/MentorDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import { Toaster } from "@/components/ui/toaster";

const PrivateRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) => {
  const { user, tokens, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!tokens?.access || !user) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

const RedirectToRoleDashboard = () => {
  const { user, tokens, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!tokens?.access || !user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'CEO':
      return <Navigate to="/dashboard/ceo" />;
    case 'Mentor':
      return <Navigate to="/dashboard/mentor" />;
    case 'Admin':
      return <Navigate to="/dashboard/admin" />;
    case 'Student':
      return <Navigate to="/dashboard/student" />;
    default:
      return <Navigate to="/unauthorized" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/dashboard/ceo"
              element={
                <PrivateRoute allowedRoles={['CEO']}>
                  <CEODashboard stats={[]} onTabChange={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/mentor"
              element={
                <PrivateRoute allowedRoles={['Mentor']}>
                  <MentorDashboard stats={[]} userId="" onTabChange={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <PrivateRoute allowedRoles={['Admin']}>
                  <AdminDashboard stats={[]} onTabChange={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/student"
              element={
                <PrivateRoute allowedRoles={['Student']}>
                  <StudentDashboard stats={[]} userId="" onTabChange={() => {}} />
                </PrivateRoute>
              }
            />
            <Route path="/unauthorized" element={<div className="p-4">Ruxsat yo'q!</div>} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/dashboard" element={<RedirectToRoleDashboard />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
