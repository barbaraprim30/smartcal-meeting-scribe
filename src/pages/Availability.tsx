
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeIcon, CalendarIcon, Link, LinkIcon, Clock, Plus, Copy, Edit, Trash } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const weekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

type TimeRange = {
  id: string;
  start: string;
  end: string;
};

type DayAvailability = {
  enabled: boolean;
  timeRanges: TimeRange[];
};

type AvailabilitySchedule = {
  [key: string]: DayAvailability;
};

const Availability: React.FC = () => {
  const { toast } = useToast();
  
  // State for availability settings
  const [availability, setAvailability] = useState<AvailabilitySchedule>({
    Monday: { enabled: true, timeRanges: [{ id: '1', start: '07:00', end: '23:00' }] },
    Tuesday: { enabled: true, timeRanges: [{ id: '2', start: '07:00', end: '23:00' }] },
    Wednesday: { enabled: true, timeRanges: [{ id: '3', start: '07:00', end: '23:00' }] },
    Thursday: { enabled: true, timeRanges: [{ id: '4', start: '07:00', end: '23:00' }] },
    Friday: { enabled: true, timeRanges: [{ id: '5', start: '07:00', end: '23:00' }] },
    Saturday: { enabled: false, timeRanges: [{ id: '6', start: '09:00', end: '18:00' }] },
    Sunday: { enabled: false, timeRanges: [{ id: '7', start: '09:00', end: '18:00' }] },
  });
  
  // State for meeting duration options
  const [meetingDurations, setMeetingDurations] = useState([30, 60]);
  
  // State for buffer times
  const [bufferBefore, setBufferBefore] = useState(15);
  const [bufferAfter, setBufferAfter] = useState(15);
  
  // State for daily agenda email
  const [dailyAgendaEmail, setDailyAgendaEmail] = useState(true);
  const [agendaEmailTime, setAgendaEmailTime] = useState("06:00");
  
  // State for timezone
  const [timezone, setTimezone] = useState("UTC");
  
  // Booking pages
  const [bookingPages, setBookingPages] = useState([
    { id: '1', name: 'Work Meetings', duration: 30, url: 'smartcal.com/user/work' },
    { id: '2', name: 'Personal Consultations', duration: 60, url: 'smartcal.com/user/personal' },
  ]);
  
  // Handle toggling a day's availability
  const toggleDayAvailability = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
  };
  
  // Handle changing time range
  const updateTimeRange = (day: string, rangeId: string, field: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeRanges: prev[day].timeRanges.map(range => 
          range.id === rangeId ? { ...range, [field]: value } : range
        )
      }
    }));
  };
  
  // Add a new time range to a day
  const addTimeRange = (day: string) => {
    const newId = `${day}-${Date.now()}`;
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeRanges: [
          ...prev[day].timeRanges,
          { id: newId, start: '09:00', end: '17:00' }
        ]
      }
    }));
  };
  
  // Remove a time range
  const removeTimeRange = (day: string, rangeId: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeRanges: prev[day].timeRanges.filter(range => range.id !== rangeId)
      }
    }));
  };
  
  // Add a meeting duration option
  const addMeetingDuration = () => {
    setMeetingDurations(prev => [...prev, 45]);
  };
  
  // Remove a meeting duration option
  const removeMeetingDuration = (duration: number) => {
    setMeetingDurations(prev => prev.filter(d => d !== duration));
  };
  
  // Add a new booking page
  const addBookingPage = () => {
    const newId = `page-${Date.now()}`;
    setBookingPages(prev => [
      ...prev,
      { id: newId, name: 'New Booking Page', duration: 30, url: `smartcal.com/user/new-${newId}` }
    ]);
  };
  
  // Save availability settings
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your availability settings have been updated",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Availability</h1>
        <p className="text-muted-foreground">Configure your availability and booking settings</p>
      </div>
      
      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="booking-pages">Booking Pages</TabsTrigger>
        </TabsList>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Set your availability for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {weekdays.map(day => (
                <div key={day} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={availability[day].enabled}
                        onCheckedChange={() => toggleDayAvailability(day)}
                      />
                      <Label className="font-medium">{day}</Label>
                    </div>
                    
                    {availability[day].enabled && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => addTimeRange(day)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Time Range
                      </Button>
                    )}
                  </div>
                  
                  {availability[day].enabled && (
                    <div className="space-y-2 pl-7">
                      {availability[day].timeRanges.map(range => (
                        <div key={range.id} className="flex items-center space-x-2">
                          <div className="grid grid-cols-2 gap-2 flex-1">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <Input
                                type="time"
                                value={range.start}
                                onChange={e => updateTimeRange(day, range.id, 'start', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <Input
                                type="time"
                                value={range.end}
                                onChange={e => updateTimeRange(day, range.id, 'end', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          {availability[day].timeRanges.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeRange(day, range.id)}
                            >
                              <Trash className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>Save Schedule</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Preferences</CardTitle>
              <CardDescription>
                Configure duration options and buffer times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Meeting Durations (minutes)</Label>
                <div className="flex flex-wrap gap-2">
                  {meetingDurations.map(duration => (
                    <div key={duration} className="flex items-center space-x-1 bg-secondary rounded-md px-3 py-1">
                      <span>{duration} min</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeMeetingDuration(duration)}
                        className="h-5 w-5 p-0"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addMeetingDuration}
                    className="rounded-md"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Buffer Before Meetings (minutes)</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Slider
                      value={[bufferBefore]}
                      max={60}
                      step={5}
                      onValueChange={(value) => setBufferBefore(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{bufferBefore}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Buffer After Meetings (minutes)</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Slider
                      value={[bufferAfter]}
                      max={60}
                      step={5}
                      onValueChange={(value) => setBufferAfter(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{bufferAfter}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Agenda Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive an email with your daily schedule
                    </p>
                  </div>
                  <Switch
                    checked={dailyAgendaEmail}
                    onCheckedChange={setDailyAgendaEmail}
                  />
                </div>
                
                {dailyAgendaEmail && (
                  <div className="space-y-2">
                    <Label>Email Time</Label>
                    <Input
                      type="time"
                      value={agendaEmailTime}
                      onChange={(e) => setAgendaEmailTime(e.target.value)}
                      className="w-full md:w-52"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label>Time Zone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="w-full md:w-52">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Central European (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Japan (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Booking Pages Tab */}
        <TabsContent value="booking-pages" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Booking Pages</CardTitle>
                <CardDescription>
                  Manage your public booking pages
                </CardDescription>
              </div>
              <Button onClick={addBookingPage}>
                <Plus className="h-4 w-4 mr-1" /> New Page
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingPages.map(page => (
                  <div key={page.id} className="flex flex-col space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">{page.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Duration</Label>
                        <div className="font-medium">{page.duration} minutes</div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Booking Link</Label>
                        <div className="flex items-center space-x-2">
                          <Input value={page.url} readOnly className="bg-muted" />
                          <Button variant="outline" size="icon" title="Copy link">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Availability;
