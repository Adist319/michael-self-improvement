'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DayPicker } from 'react-day-picker';

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
  const [selectedEmoji, setSelectedEmoji] = useState('');
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
    if (!currentDeed.trim() || !selectedEmoji) return;

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
    setSelectedEmoji('');
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950">
      <main className="w-full max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Michael's Recovery Arc</h1>
          <p className="text-zinc-400">Turn those L's into W's king 👑</p>
        </div>

        {/* Streak Counter */}
        <div className="flex justify-center">
          <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 text-center w-full max-w-sm">
            <div className="text-4xl font-bold text-white mb-2">{streak}</div>
            <div className="text-zinc-400">Day{streak !== 1 ? 's' : ''} Strong</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input and Recent W's Section */}
          <div className="bg-zinc-900/50 rounded-xl p-6 space-y-4 border border-zinc-800">
            <div className="space-y-3">
              <div className="flex flex-col space-y-3">
                <div className="flex items-stretch gap-2">
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="h-full aspect-square flex items-center justify-center text-xl bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors min-w-[2.75rem]"
                    >
                      {selectedEmoji || '😊'}
                    </button>
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter your good deed..."
                    value={currentDeed}
                    onChange={(e) => setCurrentDeed(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 text-white h-11"
                    onKeyPress={(e) => e.key === 'Enter' && currentDeed.trim() && selectedEmoji && handleGoodDeed()}
                  />
                </div>
                
                {showEmojiPicker && (
                  <div className="flex flex-wrap gap-2 p-2 bg-zinc-800 rounded-lg justify-center">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setSelectedEmoji(emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="w-10 h-10 flex items-center justify-center text-xl hover:bg-zinc-700 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleGoodDeed}
                  disabled={!currentDeed.trim() || !selectedEmoji}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add W
                </Button>
              </div>
            </div>

            {deeds.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-white mb-3 text-center">Recent W's</h2>
                <div className="space-y-2">
                  {deeds.slice(-3).reverse().map((deed, index) => (
                    <div key={index} className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-xl bg-zinc-800/50 rounded-lg">
                          {deed.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-zinc-400">{new Date(deed.date).toLocaleDateString()}</div>
                          <div className="text-white break-words">{deed.deed}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Calendar Section */}
          <div className="bg-zinc-900/50 rounded-xl p-6 space-y-4 border border-zinc-800">
            <h2 className="text-lg font-medium text-white mb-3 text-center">Progress Calendar</h2>
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              modifiers={{
                completed: (date) => deeds.some(deed => deed.date === date.toISOString().split('T')[0])
              }}
              modifiersStyles={{
                completed: {
                  color: 'white',
                  backgroundColor: '#16a34a'
                }
              }}
              className="mx-auto text-white 
                [&_.rdp-day]:hover:bg-zinc-800/50 
                [&_.rdp-day_button]:transition-colors
                [&_.rdp-caption]:text-zinc-200
                [&_.rdp-caption_label]:font-medium
                [&_.rdp-head_cell]:text-zinc-400
                [&_.rdp-button]:text-zinc-400
                [&_.rdp-button:hover]:bg-zinc-800/50
                [&_.rdp-button:hover]:text-zinc-200
                [&_.rdp-nav_button]:hover:bg-zinc-800/50
                [&_.rdp-nav_button]:text-zinc-400
                [&_.rdp-nav_button]:hover:text-zinc-200
                [&_.rdp-day_selected]:bg-emerald-600
                [&_.rdp-day_selected]:text-white
                [&_.rdp-day_selected]:hover:bg-emerald-500
                [&_.rdp-day_today]:text-emerald-400
                [&_.rdp-day_today]:font-bold
                [&_.rdp-button_reset]:text-zinc-400
                [&_.rdp-button_reset]:hover:text-zinc-200
                [&_.rdp-button_reset]:hover:bg-zinc-800/50
                [&_.rdp-months]:space-y-4
                [&_.rdp-month]:space-y-4
                [&_.rdp-table]:w-full
                [&_.rdp-cell]:p-0
                [&_.rdp-day]:h-9
                [&_.rdp-day]:w-9
                [&_.rdp-day]:p-0
                [&_.rdp-day]:text-center"
            />
            
            {getSelectedDateDeed() && (
              <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-xl bg-zinc-800/50 rounded-lg">
                    {getSelectedDateDeed()?.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-zinc-400">
                      {date?.toLocaleDateString()}
                    </div>
                    <div className="text-white break-words">{getSelectedDateDeed()?.deed}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
