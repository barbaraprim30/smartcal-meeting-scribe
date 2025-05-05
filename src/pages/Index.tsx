
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard or login page based on authentication
    const isAuthenticated = localStorage.getItem('smartcal_auth');
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-smartcal-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-smartcal-700">SmartCal</h1>
        <p className="text-xl text-smartcal-600">Loading your calendar...</p>
      </div>
    </div>
  );
};

export default Index;
