
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Dashboard from '@/components/Dashboard';
import Navbar from '@/components/Navbar';

const DashboardPage = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate('/');
      return;
    }

    // Additional role-based redirects could be added here in the future
    // For example, if certain roles should only access specific sections
  }, [isAuthenticated, isLoading, navigate, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edu-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 px-4 md:px-6 max-w-7xl mx-auto py-8">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
