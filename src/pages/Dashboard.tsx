
import React from 'react';
import { CalendarClock, Users, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  // Mock data
  const upcomingMeetings = [
    { id: 1, title: 'Weekly Team Standup', time: '10:00 - 10:30', date: 'Today', attendees: 5 },
    { id: 2, title: 'Client Presentation', time: '14:00 - 15:00', date: 'Today', attendees: 3 },
    { id: 3, title: 'Project Planning', time: '09:00 - 10:00', date: 'Tomorrow', attendees: 4 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your calendar overview and upcoming meetings</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">2 hours total duration</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">12 members total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Availability</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">70%</div>
            <p className="text-xs text-muted-foreground">Open slots this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>
              Your schedule for the next 48 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center">
                  <div className="w-16 text-center">
                    <div className="text-sm font-medium">{meeting.date}</div>
                    <div className="text-xs text-muted-foreground">{meeting.time.split(' - ')[0]}</div>
                  </div>
                  <div className="ml-4 flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{meeting.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {meeting.time} • {meeting.attendees} attendees
                    </p>
                  </div>
                  <div>
                    <Button size="sm" variant="ghost">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Calendar
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calendar Sync Status</CardTitle>
            <CardDescription>
              Your connected calendars
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-sm">Google Calendar (Work)</p>
                </div>
                <span className="text-xs text-muted-foreground">Synced</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-sm">Outlook (Personal)</p>
                </div>
                <span className="text-xs text-muted-foreground">Synced</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <p className="text-sm">Mailcow</p>
                </div>
                <span className="text-xs text-red-500">Auth required</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Manage Calendars
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
