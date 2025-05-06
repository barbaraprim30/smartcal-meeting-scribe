
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface JoinMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meeting?: {
    id: number;
    title: string;
    isVirtual: boolean;
    platform?: string;
    location?: string;
  };
}

const JoinMeetingDialog: React.FC<JoinMeetingDialogProps> = ({
  isOpen,
  onClose,
  meeting
}) => {
  const { toast } = useToast();
  
  if (!meeting) {
    return null;
  }
  
  const handleJoinMeeting = () => {
    if (meeting.isVirtual) {
      // In a real application, this would open the meeting URL
      // For now we'll just show a toast
      toast({
        title: "Joining Meeting",
        description: `Opening ${meeting.platform || 'virtual meeting'} link...`
      });
      
      // Mock opening an external link
      window.open("https://example.com/meeting", "_blank");
    } else {
      toast({
        title: "In-Person Meeting",
        description: `Meeting will take place at ${meeting.location || 'the specified location'}`
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Meeting: {meeting.title}</DialogTitle>
          <DialogDescription>
            {meeting.isVirtual
              ? `You are about to join a virtual meeting via ${meeting.platform || 'video conference'}`
              : `This is an in-person meeting at ${meeting.location || 'the specified location'}`
            }
          </DialogDescription>
        </DialogHeader>
        
        {meeting.isVirtual ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              You'll be redirected to the meeting platform. Make sure your camera and microphone are working properly.
            </p>
            
            <div className="flex items-center p-3 border rounded-md bg-muted/30">
              <div className="mr-3 h-9 w-9 rounded-full bg-primary flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">{meeting.platform || 'Video Conference'}</p>
                <p className="text-sm text-muted-foreground">External link</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Please arrive 5 minutes before the scheduled time. The meeting will take place at:
            </p>
            <p className="text-base font-medium mt-2 p-3 border rounded-md bg-muted/30">
              {meeting.location || 'The specified location'}
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleJoinMeeting}>
            {meeting.isVirtual ? 'Join Now' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinMeetingDialog;
