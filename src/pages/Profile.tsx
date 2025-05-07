import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Profile: React.FC = () => {
  const { toast } = useToast();
  
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    alias: '',
    bio: '',
    timeZone: 'America/New_York',
  });
  
  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user profile data
  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Error",
            description: "You must be logged in to view your profile",
            variant: "destructive"
          });
          return;
        }

        // Set email from auth
        setProfile(prev => ({
          ...prev,
          email: session.user.email || ''
        }));

        // Fetch profile data
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (profileData) {
          setProfile(prev => ({
            ...prev,
            name: profileData.full_name || '',
            alias: profileData.username || '',
            bio: profileData.bio || '',
            timeZone: profileData.time_zone || 'America/New_York',
          }));

          // Set avatar if it exists
          if (profileData.avatar_url) {
            setAvatarUrl(profileData.avatar_url);
          }
        }

      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, [toast]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    try {
      setIsUploading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Not authenticated");
      }
      
      // Upload to Supabase Storage
      const fileName = `avatar-${session.user.id}-${Date.now()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: publicUrlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);
        
      const avatarUrl = publicUrlData.publicUrl;
      
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', session.user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update state
      setAvatarUrl(avatarUrl);
      
      toast({
        title: "Profile Picture Updated",
        description: "Your new profile picture has been saved",
      });
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Save profile
  const saveProfile = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Not authenticated");
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          full_name: profile.name,
          username: profile.alias,
          bio: profile.bio,
          time_zone: profile.timeZone,
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved",
      });
      
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    }
  };
  
  // Update password
  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation must match",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully",
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Password Update Failed",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage src={avatarPreview || avatarUrl || undefined} />
            <AvatarFallback className="text-2xl">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer">
            <Camera className="h-6 w-6" />
          </label>
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleAvatarChange}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          
          {avatarFile && (
            <Button 
              size="sm" 
              className="mt-2" 
              onClick={handleAvatarUpload} 
              disabled={isUploading}
            >
              {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Picture
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="calendars">Connected Calendars</TabsTrigger>
        </TabsList>
        
        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={profile.name} 
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={profile.email} 
                    onChange={handleProfileChange}
                    disabled
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alias">Alias/Username</Label>
                <Input 
                  id="alias" 
                  name="alias" 
                  value={profile.alias} 
                  onChange={handleProfileChange}
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in your booking URLs: smartcal.com/{profile.alias}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio/Description</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  rows={4} 
                  placeholder="Tell others about yourself..."
                  value={profile.bio} 
                  onChange={handleProfileChange}
                />
                <p className="text-xs text-muted-foreground">
                  This will be shown on your booking pages
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeZone">Default Time Zone</Label>
                <select 
                  id="timeZone" 
                  name="timeZone" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  value={profile.timeZone}
                  onChange={(e) => handleProfileChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Central European (CET)</option>
                  <option value="Asia/Tokyo">Japan (JST)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Password Tab */}
        <TabsContent value="password" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  name="currentPassword" 
                  type="password" 
                  value={passwordData.currentPassword} 
                  onChange={handlePasswordChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  name="newPassword" 
                  type="password" 
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  value={passwordData.confirmPassword} 
                  onChange={handlePasswordChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={updatePassword}>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Connected Calendars Tab */}
        <TabsContent value="calendars" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Calendars</CardTitle>
              <CardDescription>
                Manage your calendar synchronization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Google Calendar (Work)</h3>
                        <p className="text-sm text-muted-foreground">work@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-green-600 mr-2">Connected</span>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Outlook (Personal)</h3>
                        <p className="text-sm text-muted-foreground">personal@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-green-600 mr-2">Connected</span>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Mailcow</h3>
                        <p className="text-sm text-red-500">Authentication required</p>
                      </div>
                    </div>
                    <Button size="sm">Connect</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Connect New Calendar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
