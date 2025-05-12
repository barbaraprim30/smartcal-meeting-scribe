
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/pages/UserManagement';
import { v4 as uuidv4 } from '@/lib/utils';

interface UserFormDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: User, isNew: boolean) => void;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    email: '',
    avatar_url: null,
    role: 'user'
  });
  
  const isNewUser = !user;

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    } else {
      // Generate a UUID for new users
      setFormData({
        id: uuidv4(),
        name: '',
        email: '',
        avatar_url: null,
        role: 'user'
      });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }
    
    // If all validations pass, save the user
    onSave(formData, isNewUser);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isNewUser ? 'Add New User' : 'Edit User'}</DialogTitle>
            <DialogDescription>
              {isNewUser 
                ? 'Create a new user account' 
                : 'Make changes to user information and permissions'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {isNewUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="avatar" className="text-right">
                  Avatar
                </Label>
                <div className="col-span-3">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar_url || ''} />
                    <AvatarFallback>{formData.name.substring(0, 2).toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar_url" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url || ''}
                onChange={handleChange}
                placeholder="https://example.com/avatar.png"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="admin" className="text-right">
                Admin
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="admin"
                  checked={formData.role === 'admin'}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, role: checked ? 'admin' : 'user' }))
                  }
                />
                <Label htmlFor="admin">Administrator privileges</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isNewUser ? 'Create User' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
