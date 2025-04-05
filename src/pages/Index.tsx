
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';

const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      console.log("Already authenticated, redirecting to dashboard. User role:", user?.role);
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, user, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edu-primary"></div>
      </div>
    );
  }

  // If not authenticated, show login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-edu-light to-white p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
