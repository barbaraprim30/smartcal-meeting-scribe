import React from 'react';
import { TimerIcon } from 'lucide-react'; // Changed from TimeIcon to TimerIcon

const Availability = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Availability Settings</h1>
        <div className="flex items-center text-muted-foreground">
          <TimerIcon className="mr-2 h-5 w-5" />
          <span>Set your available hours</span>
        </div>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
          <p className="text-muted-foreground mb-6">
            Define when you're typically available for meetings.
          </p>
          
          {/* To be implemented: Weekly availability scheduler */}
          <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              Weekly availability scheduler will be implemented here
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Buffer Time</h2>
          <p className="text-muted-foreground mb-6">
            Set buffer time before and after your meetings.
          </p>
          
          {/* To be implemented: Buffer time settings */}
          <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              Buffer time settings will be implemented here
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Meeting Durations</h2>
          <p className="text-muted-foreground mb-6">
            Define the meeting duration options.
          </p>
          
          {/* To be implemented: Meeting duration settings */}
          <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              Meeting duration settings will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
