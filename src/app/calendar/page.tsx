'use client';

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [completedDates, setCompletedDates] = useState<string[]>([]);

  useEffect(() => {
    // Load completed dates from localStorage
    const savedDates = localStorage.getItem('completedDates');
    if (savedDates) {
      setCompletedDates(JSON.parse(savedDates));
    }
  }, []);

  // Function to check if a date is marked as completed
  const isDateCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return completedDates.includes(dateString);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Progress Calendar</h1>
          <Button 
            variant="outline"
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={{
              completed: (date) => isDateCompleted(date),
            }}
            modifiersStyles={{
              completed: {
                backgroundColor: '#22c55e',
                color: 'white',
              }
            }}
            className="rounded-md border"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Total Days</p>
              <p className="text-2xl font-bold">{completedDates.length}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold">
                {completedDates.filter(date => 
                  date.startsWith(new Date().toISOString().slice(0, 7))
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
