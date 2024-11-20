'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

interface DailyDeed {
  date: string;
  deed: string;
  emoji: string;
}

const EMOJI_OPTIONS = ['😊', '💪', '🌟', '🎯', '🚀', '💡', '🌱', '💭'];

export default function Home() {
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [currentDeed, setCurrentDeed] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [deeds, setDeeds] = useState<DailyDeed[]>([]);
  const [isDownBad, setIsDownBad] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedStreak = localStorage.getItem('streak');
    const savedLastCheckIn = localStorage.getItem('lastCheckIn');
    const savedDeeds = localStorage.getItem('deeds');
    const savedIsDownBad = localStorage.getItem('isDownBad');
    
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLastCheckIn) setLastCheckIn(savedLastCheckIn);
    if (savedDeeds) setDeeds(JSON.parse(savedDeeds));
    if (savedIsDownBad) setIsDownBad(JSON.parse(savedIsDownBad));
  }, []);

  const handleGoodDeed = () => {
    if (!currentDeed.trim()) return;

    const today = new Date().toISOString().split('T')[0];
    const newDeed: DailyDeed = {
      date: today,
      deed: currentDeed,
      emoji: selectedEmoji
    };

    const newDeeds = [...deeds, newDeed];
    setDeeds(newDeeds);
    localStorage.setItem('deeds', JSON.stringify(newDeeds));

    // Update streak
    const newStreak = lastCheckIn === 
      new Date(Date.now() - 86400000).toISOString().split('T')[0] 
      ? streak + 1 
      : 1;
    
    setStreak(newStreak);
    setLastCheckIn(today);
    setCurrentDeed('');
    setIsDownBad(false);
    setShowEmojiPicker(false);
    
    localStorage.setItem('streak', newStreak.toString());
    localStorage.setItem('lastCheckIn', today);
    localStorage.setItem('isDownBad', 'false');
  };

  const getMotivationalMessage = () => {
    if (isDownBad) {
      return "Time to turn that L into a W. What's one good thing you did today?";
    }
    return streak > 1 
      ? `${streak} days of W energy! Keep it going!` 
      : "First W of many! What's your good deed for today?";
  };

  const isDateCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return deeds.some(deed => deed.date === dateString);
  };

  const getSelectedDateDeed = () => {
    if (!date) return null;
    const dateString = date.toISOString().split('T')[0];
    return deeds.find(deed => deed.date === dateString);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
      <main className="w-full max-w-3xl space-y-8 relative">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Michael's Recovery Arc
          </h1>
          
          <div className={`text-2xl font-medium transition-colors drop-shadow-lg ${
            isDownBad ? 'text-red-400' : 'text-green-400'
          }`}>
            {getMotivationalMessage()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input and Recent W's Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 space-y-4 border border-white/10 shadow-lg">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-12 h-12 flex items-center justify-center text-2xl bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {selectedEmoji}
                  </button>
                  <Input
                    type="text"
                    placeholder="Enter your good deed..."
                    value={currentDeed}
                    onChange={(e) => setCurrentDeed(e.target.value)}
                    className="bg-white/5 border-white/10 placeholder:text-white/50 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleGoodDeed()}
                  />
                </div>
                
                {showEmojiPicker && (
                  <div className="flex gap-2 p-2 bg-white/5 rounded-lg">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setSelectedEmoji(emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleGoodDeed}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 hover:from-blue-600 hover:via-purple-600 hover:to-blue-600 border-0"
                >
                  Add W
                </Button>
              </div>

              {deeds.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-3">Recent W's:</h2>
                  <div className="space-y-2">
                    {deeds.slice(-3).reverse().map((deed, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl group-hover:scale-110 transition-transform">
                            {deed.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-white/60">{new Date(deed.date).toLocaleDateString()}</div>
                            <div>{deed.deed}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {streak > 0 && (
                <div className="text-xl font-medium mt-4 bg-white/5 p-4 rounded-lg border border-white/10">
                  🔥 {streak} Day{streak !== 1 ? 's' : ''} Streak
                </div>
              )}
            </div>

            {/* Calendar Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 shadow-lg">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={{
                  completed: (date) => isDateCompleted(date),
                }}
                modifiersStyles={{
                  completed: {
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    color: 'white',
                    borderColor: 'rgba(34, 197, 94, 0.5)',
                  }
                }}
                className="rounded-md border-0 bg-transparent text-white [&_.rdp-day]:hover:bg-white/10 [&_.rdp-day_button]:transition-colors"
              />
              
              {getSelectedDateDeed() && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {getSelectedDateDeed()?.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white/60">
                        {date?.toLocaleDateString()}
                      </div>
                      <div>{getSelectedDateDeed()?.deed}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
