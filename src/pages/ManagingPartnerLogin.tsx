import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Briefcase, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const ManagingPartnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Only accept specific demo credentials
      if (email === 'demo123@gmail.com' && password === 'demo123') {
        // Store auth state
        localStorage.setItem('managingPartnerLoggedIn', 'true');
        localStorage.setItem('managingPartnerEmail', email);
        
        toast.success('Login successful');
        navigate('/ai-assistant');
      } else {
        toast.error('Invalid credentials. Please use the demo account.');
      }
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-col w-full">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-6">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Managing Partner Portal</h1>
              <p className="text-muted-foreground">
                Sign in to access your firm's comprehensive analytics dashboard
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo123@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">Signing in</span>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                For demo purposes, use email: demo123@gmail.com and password: demo123
              </p>
            </div>
            
            <div className="flex items-center justify-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-sm text-muted-foreground"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagingPartnerLogin;
