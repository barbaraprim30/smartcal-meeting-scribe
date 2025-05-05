
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      toast({
        title: "Email Sent",
        description: "Password reset instructions have been sent to your email"
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-smartcal-50">
      <div className="p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-smartcal-700">SmartCal</h1>
          <p className="text-smartcal-600">Advanced Meeting Booking Solution</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {isSubmitted
                ? "Check your email for reset instructions"
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-4">
                <p className="mb-4">A password reset link has been sent to:</p>
                <p className="font-medium">{email}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button disabled={isLoading} className="w-full" type="submit">
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" className="px-0" onClick={() => navigate('/login')}>
              Back to login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
