
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-smartcal-50">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Calendar className="h-24 w-24 text-smartcal-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-smartcal-700">404 - Page Not Found</h1>
        <p className="text-lg mb-8 text-gray-600 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="px-6"
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="px-6"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
