
import React from 'react';
import SignupForm from '@/components/auth/SignupForm';

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-smartcal-50">
      <div className="p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-smartcal-700">SmartCal</h1>
          <p className="text-smartcal-600">Advanced Meeting Booking Solution</p>
        </div>
        
        <SignupForm />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>For demo purposes, user creation requires admin approval</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
