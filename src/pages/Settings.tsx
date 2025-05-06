
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Shield, Trash, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EditUserDialog from '@/components/user/EditUserDialog';

type User = {
  id: string;
  name: string;
  email: string;
  alias: string;
  role: 'admin' | 'user';
  status: 'active' | 'pending';
  calendars: number;
};

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin, loading } = useUserRole();
  
  // Mock users data
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john@example.com', 
      alias: 'johndoe', 
      role: 'admin', 
      status: 'active',
      calendars: 3
    },
    { 
      id: '2', 
      name: 'Sarah Smith', 
      email: 'sarah@example.com', 
      alias: 'sarahsmith', 
      role: 'user', 
      status: 'active',
      calendars: 3
    },
    { 
      id: '3', 
      name: 'Michael Johnson', 
      email: 'michael@example.com', 
      alias: 'michaelj', 
      role: 'user', 
      status: 'active',
      calendars: 3
    },
    { 
      id: '4', 
      name: 'Pedro Martinez', 
      email: 'pedro@example.com', 
      alias: 'pedrom', 
      role: 'user', 
      status: 'active',
      calendars: 5
    },
  ]);
  
  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    alias: '',
    role: 'user',
    calendars: 3,
  });

  // State for user editing
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Handle new user form change
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add new user
  const addNewUser = () => {
    const id = `user-${Date.now()}`;
    const user: User = {
      id,
      name: newUser.name,
      email: newUser.email,
      alias: newUser.alias,
      role: newUser.role as 'admin' | 'user',
      status: 'pending',
      calendars: newUser.calendars,
    };
    
    setUsers(prev => [...prev, user]);
    
    toast({
      title: "User Created",
      description: `Invitation sent to ${newUser.email}`,
    });
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      alias: '',
      role: 'user',
      calendars: 3,
    });
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  // Save edited user
  const saveEditedUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };
  
  // Delete user
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    
    toast({
      title: "User Deleted",
      description: "User has been removed from the system",
    });
  };
  
  // Toggle user role
  const toggleUserRole = (id: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === id) {
        return {
          ...user,
          role: user.role === 'admin' ? 'user' : 'admin'
        };
      }
      return user;
    }));
    
    toast({
      title: "User Role Updated",
      description: "User permissions have been modified",
    });
  };
  
  // Save general settings
  const saveGeneralSettings = () => {
    toast({
      title: "Settings Saved",
      description: "General settings have been updated",
    });
  };

  // If not admin and still loading, show nothing
  if (!isAdmin && !loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You don't have permission to access the settings page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This page is only available to administrators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage system settings and user accounts</p>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
          <TabsTrigger value="booking">Booking Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Users & Permissions Tab */}
        <TabsContent value="users" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account. An invitation email will be sent.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={newUser.name} 
                        onChange={handleNewUserChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={newUser.email} 
                        onChange={handleNewUserChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="alias">Alias/Username</Label>
                      <Input 
                        id="alias" 
                        name="alias" 
                        value={newUser.alias} 
                        onChange={handleNewUserChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="calendars">Number of Calendars</Label>
                      <Input 
                        id="calendars" 
                        name="calendars" 
                        type="number" 
                        min={1}
                        value={newUser.calendars} 
                        onChange={handleNewUserChange}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="admin"
                        checked={newUser.role === 'admin'}
                        onCheckedChange={(checked) => 
                          setNewUser(prev => ({ ...prev, role: checked ? 'admin' : 'user' }))
                        }
                      />
                      <Label htmlFor="admin">Make this user an Administrator</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={addNewUser}>Create User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Calendars</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name}
                        <div className="text-xs text-muted-foreground">{user.alias}</div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === 'admin' ? (
                          <Badge className="bg-smartcal-600">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.calendars}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                          {user.status === 'active' ? 'Active' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => toggleUserRole(user.id)}>
                            {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}>
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Booking Settings Tab */}
        <TabsContent value="booking" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>
                Configure global booking parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Default Meeting Durations</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="defaultShort">Short (minutes)</Label>
                    <Input id="defaultShort" type="number" defaultValue={30} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultMedium">Medium (minutes)</Label>
                    <Input id="defaultMedium" type="number" defaultValue={45} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultLong">Long (minutes)</Label>
                    <Input id="defaultLong" type="number" defaultValue={60} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Booking Limits</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxPerDay">Max Bookings Per Day</Label>
                    <Input id="maxPerDay" type="number" defaultValue={10} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPerEmail">Max Bookings Per Email</Label>
                    <Input id="maxPerEmail" type="number" defaultValue={3} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Travel Time Settings</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="shortTravel">Short Travel (minutes)</Label>
                    <Input id="shortTravel" type="number" defaultValue={30} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mediumTravel">Medium Travel (minutes)</Label>
                    <Input id="mediumTravel" type="number" defaultValue={45} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longTravel">Long Travel (minutes)</Label>
                    <Input id="longTravel" type="number" defaultValue={60} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Booking Page Options</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="approvalRequired" defaultChecked />
                  <Label htmlFor="approvalRequired">
                    Require admin approval for new booking pages
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="limitBookingWindow" defaultChecked />
                  <Label htmlFor="limitBookingWindow">
                    Limit booking window (days in advance)
                  </Label>
                </div>
                {/* Only show this input if the above switch is checked */}
                <div className="pl-7">
                  <Input
                    id="bookingWindowDays"
                    type="number"
                    className="w-24"
                    defaultValue={60}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveGeneralSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure system security and authentication options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="require2fa" defaultChecked />
                  <div>
                    <Label htmlFor="require2fa">
                      Require 2FA for administrator accounts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      All administrator accounts must use two-factor authentication
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="2faForUsers" />
                  <div>
                    <Label htmlFor="2faForUsers">
                      Require 2FA for all users
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      All user accounts must use two-factor authentication
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Policy</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="passwordComplexity" defaultChecked />
                  <div>
                    <Label htmlFor="passwordComplexity">
                      Enforce password complexity
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Require special characters, numbers, and mixed case letters
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordLength">Minimum Password Length</Label>
                  <Input
                    id="passwordLength"
                    type="number"
                    className="w-24"
                    defaultValue={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    className="w-24"
                    defaultValue={90}
                  />
                  <p className="text-sm text-muted-foreground">
                    Set to 0 to disable password expiry
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Security</h3>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    className="w-24"
                    defaultValue={30}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="singleSession" />
                  <div>
                    <Label htmlFor="singleSession">
                      Limit to one active session per user
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Logging in on a new device will terminate existing sessions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveGeneralSettings}>Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <EditUserDialog
        user={editingUser}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={saveEditedUser}
      />
    </div>
  );
};

export default Settings;
