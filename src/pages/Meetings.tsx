
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarPlus, ChevronDown, Filter, Search, Video, MapPin, Clock, Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import JoinMeetingDialog from '@/components/meeting/JoinMeetingDialog';

type Meeting = {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  attendees: {
    name: string;
    email: string;
    avatar?: string;
    isRegistered: boolean;
  }[];
  isVirtual: boolean;
  location?: string;
  platform?: string;
  description?: string;
};

const Meetings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  
  // Mock meetings data
  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Weekly Team Standup',
      date: new Date(),
      startTime: '10:00',
      endTime: '10:30',
      attendees: [
        { name: 'John Doe', email: 'john@example.com', isRegistered: true },
        { name: 'Sarah Smith', email: 'sarah@example.com', isRegistered: true },
        { name: 'Mike Johnson', email: 'mike@example.com', isRegistered: true },
        { name: 'Anna Brown', email: 'anna@example.com', isRegistered: false },
      ],
      isVirtual: true,
      platform: 'Zoom',
      description: 'Weekly team status update and planning'
    },
    {
      id: '2',
      title: 'Client Meeting - Project Kickoff',
      date: new Date(),
      startTime: '14:00',
      endTime: '15:30',
      attendees: [
        { name: 'John Doe', email: 'john@example.com', isRegistered: true },
        { name: 'Client Rep', email: 'client@example.com', isRegistered: false },
        { name: 'Sales Manager', email: 'sales@example.com', isRegistered: true },
      ],
      isVirtual: false,
      location: 'Conference Room A',
      description: 'Initial client meeting to discuss project goals and timeline'
    },
    {
      id: '3',
      title: 'Product Design Review',
      date: new Date(Date.now() + 86400000), // Tomorrow
      startTime: '11:00',
      endTime: '12:00',
      attendees: [
        { name: 'John Doe', email: 'john@example.com', isRegistered: true },
        { name: 'Designer', email: 'design@example.com', isRegistered: true },
        { name: 'PM', email: 'pm@example.com', isRegistered: true },
      ],
      isVirtual: true,
      platform: 'Google Meet',
      description: 'Review latest design mockups and provide feedback'
    },
  ];
  
  // Handle filter changes
  const handleFilterChange = (filter: string) => {
    console.log('Filter changed:', filter);
  };
  
  const handleJoinMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsJoinDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">Manage your meetings and teams</p>
        </div>
        <Button>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Create Meeting
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search meetings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="space-x-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange('all')}>All Meetings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('virtual')}>Virtual Meetings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('in-person')}>In-Person Meetings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('today')}>Today's Meetings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('upcoming')}>Upcoming Meetings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {meetings.map(meeting => (
            <Card key={meeting.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{meeting.title}</CardTitle>
                    <CardDescription>
                      {format(meeting.date, 'EEEE, MMMM d, yyyy')} • {meeting.startTime} - {meeting.endTime}
                    </CardDescription>
                  </div>
                  <Badge variant={meeting.isVirtual ? "default" : "outline"}>
                    {meeting.isVirtual ? 'Virtual' : 'In-Person'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      {meeting.isVirtual ? (
                        <Video className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      ) : (
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">
                          {meeting.isVirtual ? meeting.platform : meeting.location}
                        </p>
                        {meeting.isVirtual && (
                          <p className="text-sm text-muted-foreground">Meeting link will be available 15 minutes before</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Duration: 30 minutes</p>
                        {!meeting.isVirtual && (
                          <p className="text-sm text-muted-foreground">Includes 15 min travel buffer</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start space-x-2">
                      <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Attendees ({meeting.attendees.length})</p>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <UserPlus className="h-3 w-3 mr-1" />
                            <span className="text-xs">Add</span>
                          </Button>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden">
                          {meeting.attendees.slice(0, 4).map((attendee, i) => (
                            <Avatar key={i} className="border-2 border-background w-8 h-8">
                              <AvatarFallback className={attendee.isRegistered ? "bg-primary text-white" : "bg-muted"}>
                                {attendee.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {meeting.attendees.length > 4 && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted text-xs font-medium">
                              +{meeting.attendees.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {meeting.description && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    {meeting.description}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Edit</Button>
                <Button size="sm" onClick={() => handleJoinMeeting(meeting)}>Join Meeting</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="past" className="mt-4">
          <div className="flex items-center justify-center h-40 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">No past meetings to display</p>
          </div>
        </TabsContent>
        
        <TabsContent value="teams" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Teams</CardTitle>
              <CardDescription>
                Manage your meeting groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Development Team</h3>
                    <Badge className="bg-green-500">All registered</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">5 members</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Client Project Team</h3>
                    <Badge variant="outline" className="text-red-500">2 unregistered</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">4 members</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Design Team</h3>
                    <Badge className="bg-green-500">All registered</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">3 members</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Create New Team
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Join Meeting Dialog */}
      <JoinMeetingDialog 
        isOpen={isJoinDialogOpen} 
        onClose={() => setIsJoinDialogOpen(false)} 
        meeting={selectedMeeting ? {
          id: parseInt(selectedMeeting.id),
          title: selectedMeeting.title,
          isVirtual: selectedMeeting.isVirtual,
          platform: selectedMeeting.platform,
          location: selectedMeeting.location,
        } : undefined} 
      />
    </div>
  );
};

export default Meetings;
