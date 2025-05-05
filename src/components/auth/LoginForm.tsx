
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if admin user (for demo purposes)
      if (email === 'admin@smartcal.com' && password === 'admin') {
        setShowTwoFactor(true);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulating 2FA verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, accept 123456 as valid 2FA code
      if (twoFactorCode === '123456') {
        toast({
          title: "Login Successful",
          description: "Welcome to SmartCal",
        });
        // Call the global login function to update app state
        window.handleLogin();
        navigate('/dashboard');
      } else {
        throw new Error('Invalid 2FA code');
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid authentication code",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login to SmartCal</CardTitle>
        <CardDescription>
          {showTwoFactor 
            ? "Enter the code from your authenticator app" 
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showTwoFactor ? (
          <form onSubmit={handleTwoFactorSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="twoFactorCode">Authentication Code</Label>
                <Input
                  id="twoFactorCode"
                  placeholder="123456"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              <Button disabled={isLoading} className="w-full" type="submit">
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@smartcal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button disabled={isLoading} className="w-full" type="submit">
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {!showTwoFactor && (
          <>
            <Button variant="link" className="px-0" onClick={() => navigate('/forgot-password')}>
              Forgot your password?
            </Button>
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-smartcal-600 hover:underline">
                Sign Up
              </Link>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
