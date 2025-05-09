
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import MeetingDialog from '@/components/meeting/MeetingDialog';
import JoinMeetingDialog from '@/components/meeting/JoinMeetingDialog';
import { supabase } from '@/integrations/supabase/client';

type Meeting = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendar: string;
  attendees: string[];
  isVirtual: boolean;
  location?: string;
  platform?: string;
};

// Type for JoinMeetingDialog component props
type JoinMeetingProps = {
  id: number;
  title: string;
  isVirtual: boolean;
  platform?: string;
  location?: string;
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendar, setSelectedCalendar] = useState("all");
  const [isNewMeetingDialogOpen, setIsNewMeetingDialogOpen] = useState(false);
  const [isJoinMeetingDialogOpen, setIsJoinMeetingDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<JoinMeetingProps | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  // Fetch meetings from Supabase
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('meetings')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          // Transform data from Supabase format to our Meeting type
          const transformedMeetings: Meeting[] = data.map(meeting => ({
            id: meeting.id.toString(),
            title: meeting.title,
            start: new Date(meeting.start_time),
            end: new Date(meeting.end_time),
            calendar: meeting.calendar_type || 'work',
            attendees: meeting.attendees || [],
            isVirtual: meeting.is_virtual,
            location: meeting.location,
            platform: meeting.platform
          }));

          setMeetings(transformedMeetings);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load meetings.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
    
    // Set up real-time subscription for meetings updates
    const meetingsSubscription = supabase
      .channel('public:meetings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => {
        fetchMeetings();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(meetingsSubscription);
    };
  }, [toast]);

  const today = currentDate;
  const startWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
  const endWeek = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: startWeek, end: endWeek });
  
  // Time slots for the day view (7 AM to 8 PM)
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 7);
  
  // Filter meetings by selected calendar
  const filteredMeetings = selectedCalendar === "all" 
    ? meetings 
    : meetings.filter(meeting => meeting.calendar === selectedCalendar);
  
  // Navigation functions
  const goToPreviousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };
  
  const goToNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Handle opening new meeting dialog
  const handleNewMeeting = (day?: Date) => {
    if (day) {
      setSelectedDate(day);
    } else {
      setSelectedDate(currentDate);
    }
    setIsNewMeetingDialogOpen(true);
  };
  
  // Handle meeting creation
  const handleMeetingCreated = () => {
    toast({
      title: "Success",
      description: "Your meeting has been added to the calendar"
    });
  };
  
  // Handle joining a meeting
  const handleJoinMeeting = (meeting: Meeting) => {
    // Convert the string ID to a number
    const meetingId = parseInt(meeting.id);
    
    const meetingForDialog: JoinMeetingProps = {
      id: isNaN(meetingId) ? 0 : meetingId,
      title: meeting.title,
      isVirtual: meeting.isVirtual,
      platform: meeting.platform,
      location: meeting.location
    };
    setSelectedMeeting(meetingForDialog);
    setIsJoinMeetingDialogOpen(true);
  };
  
  // Get meetings for a specific day and time
  const getMeetingsForTimeSlot = (day: Date, hour: number) => {
    const dayStart = new Date(new Date(day).setHours(hour, 0, 0, 0));
    const dayEnd = new Date(new Date(day).setHours(hour, 59, 59, 999));
    
    return filteredMeetings.filter(meeting => 
      meeting.start >= dayStart && meeting.start <= dayEnd
    );
  };
  
  // Calendar color mapping
  const calendarColors: Record<string, string> = {
    work: "bg-smartcal-500",
    personal: "bg-indigo-500",
    university: "bg-amber-500"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and meetings</p>
        </div>
        <Button className="gap-2" onClick={() => handleNewMeeting()}>
          <Plus className="h-4 w-4" />
          New Meeting
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>Today</Button>
          <Button variant="outline" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium">
            {format(startWeek, "MMM d")} - {format(endWeek, "MMM d, yyyy")}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <Select
            value={selectedCalendar}
            onValueChange={setSelectedCalendar}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Calendars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Calendars</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="university">University</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-lg border bg-background">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, i) => (
            <div 
              key={i} 
              className="py-2 text-center cursor-pointer hover:bg-muted/50" 
              onClick={() => handleNewMeeting(day)}
            >
              <div className="text-sm font-medium">{format(day, "EEE")}</div>
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full mx-auto mt-1",
                isSameDay(day, new Date()) && "bg-smartcal-500 text-white"
              )}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        
        {/* Time grid */}
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
          {/* Time slots */}
          {timeSlots.map(hour => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="border-r border-b py-4 px-2 text-sm text-muted-foreground text-right min-w-20">
                {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
              </div>
              
              {/* Day cells */}
              {weekDays.map((day, dayIndex) => {
                const cellMeetings = getMeetingsForTimeSlot(new Date(day), hour);
                
                return (
                  <div 
                    key={dayIndex} 
                    className={cn(
                      "border-b relative p-1 min-h-[5rem] cursor-pointer hover:bg-muted/20",
                      dayIndex < 6 && "border-r"
                    )}
                    onClick={() => {
                      const clickedDay = new Date(day);
                      clickedDay.setHours(hour);
                      handleNewMeeting(clickedDay);
                    }}
                  >
                    {cellMeetings.map(meeting => (
                      <div 
                        key={meeting.id}
                        className={cn(
                          "text-xs rounded px-2 py-1 mb-1 text-white overflow-hidden cursor-pointer transition-opacity hover:opacity-90",
                          calendarColors[meeting.calendar] || "bg-gray-500"
                        )}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the parent onClick
                          handleJoinMeeting(meeting);
                        }}
                      >
                        <div className="font-medium truncate">{meeting.title}</div>
                        <div className="truncate">{format(meeting.start, "HH:mm")} - {format(meeting.end, "HH:mm")}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Meeting Dialogs */}
      <MeetingDialog 
        isOpen={isNewMeetingDialogOpen}
        onClose={() => setIsNewMeetingDialogOpen(false)}
        selectedDate={selectedDate}
        onMeetingCreated={handleMeetingCreated}
      />
      
      {selectedMeeting && (
        <JoinMeetingDialog
          isOpen={isJoinMeetingDialogOpen}
          onClose={() => setIsJoinMeetingDialogOpen(false)}
          meeting={selectedMeeting}
        />
      )}
    </div>
  );
};

export default Calendar;
