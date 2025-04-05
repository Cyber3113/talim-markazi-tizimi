import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserProfile from './UserProfile';
import { 
  UsersRound, Book, CalendarCheck, Award, 
  Layers, BookOpen, BarChart, User2 
} from 'lucide-react';
import CEODashboard from './dashboard/CEODashboard';
import MentorDashboard from './dashboard/MentorDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import StudentDashboard from './dashboard/StudentDashboard';
import { useNavigate } from 'react-router-dom';

const initialStats = {
  CEO: [
    { title: 'Total Students', value: '0', icon: UsersRound, color: 'text-blue-500' },
    { title: 'Active Groups', value: '0', icon: Layers, color: 'text-green-500' },
    { title: 'Mentors', value: '0', icon: User2, color: 'text-purple-500' },
    { title: 'Courses', value: '0', icon: BookOpen, color: 'text-orange-500' },
  ],
  Admin: [
    { title: 'Active Groups', value: '0', icon: Layers, color: 'text-green-500' },
    { title: "Today's Attendance", value: '0%', icon: CalendarCheck, color: 'text-blue-500' },
    { title: 'Upcoming Exams', value: '0', icon: Book, color: 'text-red-500' },
  ],
  Mentor: [
    { title: 'My Groups', value: '0', icon: Layers, color: 'text-green-500' },
    { title: 'My Students', value: '0', icon: UsersRound, color: 'text-blue-500' },
    { title: 'Assignments', value: '0', icon: Book, color: 'text-orange-500' },
  ],
  Student: [
    { title: 'Average Score', value: '0%', icon: Award, color: 'text-yellow-500' },
    { title: 'Attendance', value: '0%', icon: CalendarCheck, color: 'text-green-500' },
    { title: 'Upcoming Tests', value: '0', icon: Book, color: 'text-red-500' },
  ],
};

const Dashboard = () => {
  const { user, tokens, apiRequest, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens?.access || !user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        let updatedStats = { ...stats };

        switch (user.role) {
          case 'CEO':
            const students = await apiRequest('get', '/api/student/');
            const groups = await apiRequest('get', '/api/group/');
            const mentors = await apiRequest('get', '/api/mentors');
            updatedStats.CEO[0].value = students.length.toString();
            updatedStats.CEO[1].value = groups.length.toString();
            updatedStats.CEO[2].value = mentors.length.toString();
            break;

          case 'Admin':
            const adminGroups = await apiRequest('get', '/api/group/');
            const attendance = await apiRequest('get', '/api/attendance/');
            updatedStats.Admin[0].value = adminGroups.length.toString();
            updatedStats.Admin[1].value = `${attendance.rate || 0}%`;
            break;

          case 'Mentor':
            const mentorGroups = await apiRequest('get', `/api/groups/mentor/${user.id}/`);
            const mentorStudents = await apiRequest('get', `/api/students/mentor/${user.id}/`);
            const assignments = await apiRequest('get', `/api/assignments/mentor/${user.id}/`);
            updatedStats.Mentor[0].value = mentorGroups.length.toString();
            updatedStats.Mentor[1].value = mentorStudents.length.toString();
            updatedStats.Mentor[2].value = assignments.length.toString();
            break;

          case 'Student':
            const studentData = await apiRequest('get', `/api/students/${user.id}/`);
            updatedStats.Student[0].value = `${studentData.average_score || 0}%`;
            updatedStats.Student[1].value = `${studentData.attendance_rate || 0}%`;
            const upcomingTests = await apiRequest('get', `/api/tests/student/${user.id}/upcoming/`);
            updatedStats.Student[2].value = upcomingTests.length.toString();
            break;

          default:
            console.warn('Unknown role:', user.role);
        }

        setStats(updatedStats);
      } catch (error) {
        console.error('Dashboard ma\'lumotlarini olish xatosi:', error);
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, tokens, apiRequest, navigate, logout]);

  const renderDashboardByRole = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    switch (user?.role) {
      case 'CEO':
        return <CEODashboard stats={stats.CEO} onTabChange={setActiveTab} />;
      case 'Mentor':
        return <MentorDashboard stats={stats.Mentor} userId={user.id} onTabChange={setActiveTab} />;
      case 'Admin':
        return <AdminDashboard stats={stats.Admin} onTabChange={setActiveTab} />;
      case 'Student':
        return <StudentDashboard stats={stats.Student} userId={user.id} onTabChange={setActiveTab} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <UserProfile />
        </div>
        <div className="md:col-span-3">
          {renderDashboardByRole()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;