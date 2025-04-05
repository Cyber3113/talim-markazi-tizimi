import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Stat {
  title: string;
  value: string;
  icon: any;
  color: string;
}

const CEODashboard = ({ stats: initialStats, onTabChange }: { stats: Stat[]; onTabChange: (tab: string) => void }) => {
  const { apiRequest, user, tokens } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens?.access || !user || user.role !== 'CEO') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const students = await apiRequest('get', '/api/student/');
        const groups = await apiRequest('get', '/api/group/');
        const mentors = await apiRequest('get', '/api/mentors');
        setStats([
          { title: 'Total Students', value: students.length.toString(), icon: 'UsersRound', color: 'text-blue-500' },
          { title: 'Active Groups', value: groups.length.toString(), icon: 'Layers', color: 'text-green-500' },
          { title: 'Mentors', value: mentors.length.toString(), icon: 'User2', color: 'text-purple-500' },
        ]);
      } catch (error) {
        console.error('CEO Dashboard xatosi:', error);
      }
    };

    fetchData();
  }, [apiRequest, user, tokens, navigate]);

  return (
    <div>
      <h1>CEO Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 border rounded">
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
            <p className="text-lg font-semibold">{stat.value}</p>
            <p>{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CEODashboard;