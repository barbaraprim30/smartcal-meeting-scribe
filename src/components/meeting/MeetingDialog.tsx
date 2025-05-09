
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, MapPin, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  onMeetingCreated?: () => void;
}

const MeetingDialog: React.FC<MeetingDialogProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate = new Date(),
  onMeetingCreated 
}) => {
  const [title, setTitle] = React.useState('');
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('10:00');
  const [location, setLocation] = React.useState('');
  const [isVirtual, setIsVirtual] = React.useState(true);
  const [meetingType, setMeetingType] = React.useState<string>('work');
  const [attendees, setAttendees] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Error",
        description: "Meeting title is required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const startDate = new Date(selectedDate);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    startDate.setHours(startHour, startMinute, 0);
    
    const endDate = new Date(selectedDate);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    endDate.setHours(endHour, endMinute, 0);

    // Parse attendees and ensure it's an array
    const attendeesArray = attendees
      ? attendees.split(',').map(email => email.trim()).filter(Boolean)
      : [];

    // Get current user
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    
    try {
      if (!session) {
        // If there's no authenticated session, use the mock auth for demo
        localStorage.setItem('smartcal_auth', 'true');
        
        toast({
          title: "Demo Mode",
          description: "Using demo user for this operation",
        });
        
        // Create meeting with a demo user ID
        const { error } = await supabase
          .from('meetings')
          .insert({
            title,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
            calendar_type: meetingType,
            attendees: attendeesArray,
            is_virtual: isVirtual,
            location: isVirtual ? undefined : location,
            platform: isVirtual ? location : undefined,
            description,
            created_by: '00000000-0000-0000-0000-000000000000' // Demo user ID
          });
        
        if (error) {
          throw error;
        }
      } else {
        // Create meeting with the authenticated user's ID
        const { error } = await supabase
          .from('meetings')
          .insert({
            title,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
            calendar_type: meetingType,
            attendees: attendeesArray,
            is_virtual: isVirtual,
            location: isVirtual ? undefined : location,
            platform: isVirtual ? location : undefined,
            description,
            created_by: session.user.id
          });
        
        if (error) {
          throw error;
        }
      }
      
      // Show success toast
      toast({
        title: "Success",
        description: "Meeting created successfully",
      });
      
      // Close dialog and reset form
      onClose();
      resetForm();
      
      // Call the callback to refresh meetings
      if (onMeetingCreated) {
        onMeetingCreated();
      }
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setLocation('');
    setIsVirtual(true);
    setMeetingType('work');
    setAttendees('');
    setDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Meeting</DialogTitle>
          <DialogDescription>
            Schedule a new meeting on {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Meeting Title *</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Weekly Team Standup"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="meeting-type">Calendar</Label>
              <Select
                value={meetingType}
                onValueChange={setMeetingType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Calendar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Meeting Type</Label>
              <div className="flex space-x-4 mt-2">
                <Button
                  type="button"
                  variant={isVirtual ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIsVirtual(true)}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Virtual
                </Button>
                <Button
                  type="button"
                  variant={!isVirtual ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIsVirtual(false)}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  In-Person
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">{isVirtual ? 'Platform' : 'Location'}</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={isVirtual ? "Zoom, Google Meet, Microsoft Teams" : "Conference Room A, Office Address"}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="attendees">Attendees</Label>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="Email addresses, comma separated"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter email addresses separated by commas
              </p>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Meeting agenda and notes"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDialog;
