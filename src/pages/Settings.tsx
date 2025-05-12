
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin, loading } = useUserRole();
  
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
        <p className="text-muted-foreground">Manage system settings</p>
      </div>
      
      <Tabs defaultValue="booking">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="booking">Booking Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
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
    </div>
  );
};

export default Settings;
