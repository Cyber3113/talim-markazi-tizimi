
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserProfile from './UserProfile';
import { 
  UsersRound, Book, CalendarCheck, Award, 
  Layers, BookOpen, BarChart, User2 
} from 'lucide-react';
import { 
  getGroupsByMentorId, 
  getStudentByUserId, 
  MOCK_GROUPS,
  getTopStudents
} from '@/lib/authUtils';
import CEODashboard from './dashboard/CEODashboard';
import MentorDashboard from './dashboard/MentorDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import StudentDashboard from './dashboard/StudentDashboard';

const mockStats = {
  CEO: [
    { title: 'Total Students', value: '124', icon: UsersRound, color: 'text-blue-500' },
    { title: 'Active Groups', value: '8', icon: Layers, color: 'text-green-500' },
    { title: 'Mentors', value: '6', icon: User2, color: 'text-purple-500' },
    { title: 'Courses', value: '12', icon: BookOpen, color: 'text-orange-500' },
  ],
  Admin: [
    { title: 'Active Groups', value: '8', icon: Layers, color: 'text-green-500' },
    { title: 'Today\'s Attendance', value: '88%', icon: CalendarCheck, color: 'text-blue-500' },
    { title: 'Upcoming Exams', value: '3', icon: Book, color: 'text-red-500' },
  ],
  Mentor: [
    { title: 'My Groups', value: '2', icon: Layers, color: 'text-green-500' },
    { title: 'My Students', value: '37', icon: UsersRound, color: 'text-blue-500' },
    { title: 'Assignments', value: '5', icon: Book, color: 'text-orange-500' },
  ],
  Student: [
    { title: 'Average Score', value: '85%', icon: Award, color: 'text-yellow-500' },
    { title: 'Attendance', value: '92%', icon: CalendarCheck, color: 'text-green-500' },
    { title: 'Upcoming Tests', value: '2', icon: Book, color: 'text-red-500' },
  ]
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return <div>Loading...</div>;
  }

  // Update statistics based on actual data
  const stats = [...mockStats[user.role]];
  
  if (user.role === 'CEO') {
    // Update with actual counts
    stats[0].value = MOCK_GROUPS.reduce((sum, group) => sum + group.students.length, 0).toString();
    stats[1].value = MOCK_GROUPS.length.toString();
  }

  if (user.role === 'Student') {
    const student = getStudentByUserId(user.id);
    
    if (student) {
      const averageScore = student.scores.length > 0
        ? Math.round(student.scores.reduce((sum, score) => sum + score.value, 0) / student.scores.length)
        : 0;
      
      const attendanceRate = student.attendance.length > 0
        ? Math.round((student.attendance.filter(a => a.present).length / student.attendance.length) * 100)
        : 0;
      
      stats[0].value = `${averageScore}%`;
      stats[1].value = `${attendanceRate}%`;
    }
  }

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'CEO':
        return <CEODashboard stats={stats} onTabChange={setActiveTab} />;
      case 'Mentor':
        return <MentorDashboard stats={stats} userId={user.id} onTabChange={setActiveTab} />;
      case 'Admin':
        return <AdminDashboard stats={stats} onTabChange={setActiveTab} />;
      case 'Student':
        return <StudentDashboard stats={stats} userId={user.id} onTabChange={setActiveTab} />;
      default:
        return <div>Unknown role</div>;
    }
  };

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
