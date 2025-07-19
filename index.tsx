/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef, ReactNode, MouseEventHandler, ComponentType } from 'react';
import { BarChart3, PlaySquare, Wind, Construction, ArrowLeft, Smile, Meh, Frown, PlusCircle, ChevronDown, Laugh, Annoyed, Angry, History, ChevronUp, Video, Mic, Ear, Eye, Hand, Coffee, Waves, BrainCircuit, HeartPulse, Send } from 'lucide-react';
import { GoogleGenAI, Chat } from '@google/genai';

// --- HELPER & GENERIC COMPONENTS ---

// Helper component for Icons
const Icon = ({ name: LucideIcon, ...props }: { name: ComponentType<any>; [key: string]: any }) => {
  return <LucideIcon {...props} />;
};

// Reusable Card for sections
const PageCard = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <div className={`bg-slate-800 p-6 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

// Reusable Button
const Button = ({ onClick, children, className = '', ...props }: { onClick?: MouseEventHandler<HTMLButtonElement>, children: ReactNode, className?: string, [key: string]: any }) => (
    <button 
        onClick={onClick}
        className={`bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed ${className}`}
        {...props}
    >
        {children}
    </button>
);


// --- TRACKER PAGE COMPONENTS ---

interface LogEntry {
  id: number;
  substance: string;
  day: string;
  context: string;
  amount: string;
  timestamp: Date;
}

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState('');

  const moods = [
    { name: 'Very Good', icon: Laugh, color: 'text-green-400' },
    { name: 'Good', icon: Smile, color: 'text-lime-400' },
    { name: 'Neutral', icon: Meh, color: 'text-yellow-400' },
    { name: 'Sad', icon: Frown, color: 'text-blue-400' },
    { name: 'Very Sad', icon: Annoyed, color: 'text-indigo-400' },
    { name: 'Angry', icon: Angry, color: 'text-red-500' },
  ];

  const handleMoodSelect = (moodName: string) => {
    setSelectedMood(moodName);
    setConfirmation(`Mood logged: ${moodName}`);
    setTimeout(() => setConfirmation(''), 3000);
  };

  return (
    <PageCard>
      <h3 className="text-2xl font-bold text-gray-100 mb-4">Mood Tracker</h3>
      <p className="text-gray-400 mb-6">How are you feeling today? Select a mood to log it.</p>
      <div className="flex justify-around items-center mb-6 flex-wrap gap-2">
        {moods.map(mood => (
          <button key={mood.name} onClick={() => handleMoodSelect(mood.name)} className={`p-3 sm:p-4 rounded-full transition-all duration-200 ease-in-out ${selectedMood === mood.name ? 'bg-slate-600 scale-110' : 'bg-slate-700 hover:bg-slate-600'}`} aria-label={`Select mood: ${mood.name}`}>
            <Icon name={mood.icon} className={`${mood.color} h-8 w-8 sm:h-9 sm:w-9`} />
          </button>
        ))}
      </div>
      {confirmation && (<div className="text-center bg-slate-700/50 p-3 rounded-lg mt-4 fade-in"><p className="text-gray-200 font-bold">{confirmation}</p></div>)}
    </PageCard>
  );
};

const SubstanceTracker = ({ onLogUse }: { onLogUse: (log: LogEntry) => void }) => {
  const [selectedSubstance, setSelectedSubstance] = useState('');
  const [otherSubstance, setOtherSubstance] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [context, setContext] = useState('');
  const [amount, setAmount] = useState('');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  useEffect(() => {
    const todayIndex = new Date().getDay();
    const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
    setSelectedDay(days[adjustedIndex]);
  }, []);

  const substances = [ 'Alcohol', 'Cannabis', 'Cocaine', 'MDMA (Ecstasy)', 'Methamphetamine (Ice)', 'Pharmaceuticals (non-medical)', 'Heroin', 'Hallucinogens', 'Ketamine', 'Other' ];

  const handleLog = () => {
    const finalSubstance = selectedSubstance === 'Other' ? otherSubstance : selectedSubstance;
    if (!finalSubstance || !amount) {
        alert("Please select a substance and enter an amount.");
        return;
    }
    onLogUse({ id: Date.now(), substance: finalSubstance, day: selectedDay, context, amount, timestamp: new Date() });
    setSelectedSubstance(''); setOtherSubstance(''); setContext(''); setAmount('');
  };

  return (
    <PageCard>
      <h3 className="text-2xl font-bold text-gray-100 mb-4">Substance Tracker</h3>
      <p className="text-gray-400 mb-6">Log any substance use to track patterns over time.</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="substance" className="block mb-2 text-sm font-medium text-gray-300">Substance Name</label>
          <div className="relative">
            <select id="substance" value={selectedSubstance} onChange={(e) => setSelectedSubstance(e.target.value)} className="bg-slate-700 border border-slate-600 text-gray-200 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 appearance-none">
              <option value="" disabled>Select a substance...</option>
              {substances.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"><Icon name={ChevronDown} className="h-5 w-5" /></div>
          </div>
        </div>
        
        {selectedSubstance === 'Other' && (
           <div className="fade-in"><label htmlFor="other-substance" className="block mb-2 text-sm font-medium text-gray-300">Please Specify</label><input type="text" id="other-substance" value={otherSubstance} onChange={(e) => setOtherSubstance(e.target.value)} className="bg-slate-700 border border-slate-600 text-gray-200 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5" placeholder="Name of substance" /></div>
        )}

        <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Day of the Week</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">{days.map(day => (<button key={day} onClick={() => setSelectedDay(day)} className={`p-2 text-sm font-bold rounded-md transition-colors duration-200 ${selectedDay === day ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>{day}</button>))}</div>
        </div>

        <div><label htmlFor="context" className="block mb-2 text-sm font-medium text-gray-300">Place / Person / Location</label><input type="text" id="context" value={context} onChange={(e) => setContext(e.target.value)} className="bg-slate-700 border border-slate-600 text-gray-200 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5" placeholder="e.g., At home alone, with friends" /></div>
        <div><label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-300">Amount / Quantity</label><input type="text" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-slate-700 border border-slate-600 text-gray-200 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5" placeholder="e.g., 2 standard drinks, 1 pill" /></div>
        <Button onClick={handleLog} className="w-full flex items-center justify-center space-x-2" disabled={!selectedSubstance || !amount}><Icon name={PlusCircle} className="h-5 w-5" /><span>Log Use</span></Button>
      </div>
    </PageCard>
  );
};

const HistoryCard = ({ history }: { history: LogEntry[] }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <PageCard>
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="text-2xl font-bold text-gray-100 flex items-center"><Icon name={History} className="mr-3"/>Use Log History</h3>
                <button><Icon name={isOpen ? ChevronUp : ChevronDown} className="h-6 w-6 text-gray-400"/></button>
            </div>
            {isOpen && (
                <div className="mt-6">
                    {history.length === 0 ? (<p className="text-gray-400 text-center py-4">No entries logged yet.</p>) : (
                        <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {history.map(log => (
                                <li key={log.id} className="bg-slate-700/50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-lg text-amber-400">{log.substance}</p>
                                            <p className="text-sm text-gray-300">{log.amount}</p>
                                            {log.context && <p className="text-sm text-gray-400 italic">"{log.context}"</p>}
                                        </div>
                                        <div className="text-right"><p className="font-semibold text-gray-200">{log.day}</p><p className="text-xs text-gray-500">{log.timestamp.toLocaleDateString()}</p></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </PageCard>
    );
};

const TrackerPage = ({ onBack }: { onBack: () => void }) => {
  const [logHistory, setLogHistory] = useState<LogEntry[]>([]);
  const handleLogUse = (newLog: LogEntry) => { setLogHistory(prevHistory => [newLog, ...prevHistory]); };
  return (
    <div className="py-12">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 transition-colors"><Icon name={ArrowLeft} className="h-6 w-6" /><span className="font-bold">Back to Tools</span></button>
        <h2 className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Tracker</h2>
        <div className="w-24"></div>
      </header>
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <MoodTracker />
        <div className="space-y-8"><SubstanceTracker onLogUse={handleLogUse} /><HistoryCard history={logHistory} /></div>
      </main>
    </div>
  );
};


// --- MEDIA PAGE COMPONENTS ---

const MediaPage = ({ onBack }: { onBack: () => void }) => {
    const mediaOptions = [
        { icon: Video, title: "Videos", description: "A curated collection of videos to support and inform.", color: "border-orange-500", onClick: () => window.open('https://www.youtube.com/playlist?list=PL1MHtsikpzrnje9hJbwVRhYry28G4jQz2', '_blank') },
        { icon: Mic, title: "Podcast", description: "Listen to episodes on wellness and recovery.", color: "border-sky-400", footer: "powered by notebook lm", onClick: () => window.open('https://www.youtube.com/playlist?list=PL1MHtsikpzrlXgHVnVD2txdA2weD0xDFX', '_blank') },
    ];

    return (
        <div className="py-12">
            <header className="flex items-center justify-between mb-12">
                <button onClick={onBack} className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 transition-colors"><Icon name={ArrowLeft} className="h-6 w-6" /><span className="font-bold">Back to Tools</span></button>
                <h2 className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Media</h2>
                <div className="w-24"></div>
            </header>
            <main>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {mediaOptions.map(option => (
                        <div key={option.title} onClick={option.onClick} className={`bg-slate-800 border-l-4 ${option.color} p-6 rounded-xl shadow-lg flex flex-col justify-between transform hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer`}>
                            <div>
                                <div className="flex items-center space-x-4"><div className="bg-slate-700 p-3 rounded-full"><Icon name={option.icon} className="text-gray-100 h-8 w-8" /></div><h3 className="text-2xl font-bold text-gray-100">{option.title}</h3></div>
                                <p className="mt-4 text-gray-300">{option.description}</p>
                            </div>
                            {option.footer && <p className="text-right text-xs text-slate-500 mt-4 italic">{option.footer}</p>}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

// --- GROUNDING PAGE COMPONENTS ---

const FiveFourThreeTwoOne = ({ onFinish }: { onFinish: () => void }) => {
    const [step, setStep] = useState(0);
    const [quote, setQuote] = useState('');

    const steps = [
        { icon: Eye, text: "Name 5 things you can see", color: "text-sky-400" },
        { icon: Hand, text: "Name 4 things you can feel", color: "text-lime-400" },
        { icon: Ear, text: "Name 3 things you can hear", color: "text-amber-400" },
        { icon: Coffee, text: "Name 2 things you can smell", color: "text-orange-500" },
        { icon: BrainCircuit, text: "Name 1 thing you can taste", color: "text-purple-400" },
    ];
    
    const quotes = [ "The journey of a thousand miles begins with a single step.", "Your present circumstances don't determine where you can go; they merely determine where you start.", "Believe you can and you're halfway there.", "The only person you are destined to become is the person you decide to be.", "It does not matter how slowly you go as long as you do not stop.", "The best way to get started is to quit talking and begin doing.", "You are stronger than you think.", "Every moment is a fresh beginning.", "Fall seven times, stand up eight.", "The secret of change is to focus all of your energy not on fighting the old, but on building the new." ];

    const handleNext = () => {
        if (step < steps.length) {
            setStep(step + 1);
            if (step === steps.length - 1) {
                const randomIndex = Math.floor(Math.random() * quotes.length);
                setQuote(quotes[randomIndex]);
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto text-center">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 transition-all duration-500 ease-in-out">
                {step < steps.length ? (
                    <>
                        <div className={`bg-slate-700 w-24 h-24 p-5 rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-slate-600`}><Icon name={steps[step].icon} className={`${steps[step].color} h-12 w-12`} /></div>
                        <h3 className="text-3xl font-bold text-gray-100 mb-8">{steps[step].text}</h3>
                        <Button onClick={handleNext}>Next</Button>
                    </>
                ) : (
                    <>
                        <div className={`bg-slate-700 w-24 h-24 p-5 rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-slate-600`}><Icon name={Waves} className="text-sky-400 h-12 w-12" /></div>
                        <p className="text-2xl font-semibold text-gray-200 italic mb-8">"{quote}"</p>
                        <Button onClick={onFinish}>Finish</Button>
                    </>
                )}
            </div>
        </div>
    );
};

const BreathingExercise = ({ onFinish }: { onFinish: () => void }) => {
    const [breathTarget, setBreathTarget] = useState(10);
    const [breathCount, setBreathCount] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [cycleStep, setCycleStep] = useState(0); // 0: Inhale, 1: Exhale
    const [displayText, setDisplayText] = useState('Ready?');
    const [quote, setQuote] = useState('');
    const timerRef = useRef<number | null>(null);

    const quotes = [ "Calmness is the cradle of power.", "Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself.", "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", "The greatest weapon against stress is our ability to choose one thought over another.", "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor." ];

    const cyclePhases = [
        { text: 'Inhale', duration: 4000, glow: true },
        { text: 'Exhale', duration: 6000, glow: false },
    ];

    useEffect(() => {
        if (isStarted && breathCount < breathTarget) {
            timerRef.current = window.setTimeout(() => {
                const nextStep = (cycleStep + 1) % 2;
                setCycleStep(nextStep);
                if (nextStep === 0) {
                    setBreathCount(prev => prev + 1);
                }
            }, cyclePhases[cycleStep].duration);
        } else if (breathCount >= breathTarget && isStarted) {
            setIsStarted(false);
            setCycleStep(2); // Finished state
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setQuote(quotes[randomIndex]);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isStarted, cycleStep, breathCount, breathTarget]);
    
    useEffect(() => {
        if(isStarted) {
            setDisplayText(cyclePhases[cycleStep].text);
        } else if (cycleStep === 2) {
            setDisplayText(''); // Clear text to show quote
        } else {
            setDisplayText('Ready?');
        }
    }, [cycleStep, isStarted]);


    const handleStart = () => {
        setQuote('');
        setBreathCount(1);
        setCycleStep(0);
        setIsStarted(true);
    };

    const handleStop = () => {
        setIsStarted(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setBreathCount(0);
        setCycleStep(0);
    };
    
    const currentPhase = isStarted ? cyclePhases[cycleStep] : { duration: 4000, glow: false };

    return (
        <div className="max-w-xl mx-auto text-center">
            <div className="mb-8 flex justify-center gap-4">
                {[10, 20, 30].map(num => (
                    <button key={num} onClick={() => setBreathTarget(num)} disabled={isStarted} className={`px-6 py-2 rounded-lg font-bold transition-colors ${breathTarget === num ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'} disabled:opacity-50`}>
                        {num} Breaths
                    </button>
                ))}
            </div>

            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
                 <div 
                    className={`absolute inset-0 bg-amber-500/40 rounded-full blur-3xl transition-all ease-linear`} 
                    style={{ 
                        transitionDuration: `${currentPhase.duration}ms`,
                        opacity: currentPhase.glow ? 1 : 0,
                        transform: currentPhase.glow ? 'scale(1.5)' : 'scale(1.0)',
                    }}
                ></div>
                 <div className="relative bg-slate-800 rounded-full w-full h-full flex flex-col items-center justify-center shadow-2xl p-4">
                    <div className="transition-opacity duration-1000 ease-in-out">
                        {cycleStep === 2 ? (
                             <p className="text-xl font-semibold text-gray-200 italic">"{quote}"</p>
                        ) : (
                            <>
                                <h3 className="text-5xl font-bold text-gray-100">
                                    {displayText}
                                </h3>
                                {isStarted && cycleStep < 2 && <p className="text-4xl text-gray-400 mt-4 font-mono">{breathCount}</p>}
                           </>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                {cycleStep === 2 ? (
                    <Button onClick={onFinish} className="w-48">Finish</Button>
                ) : !isStarted ? (
                    <Button onClick={handleStart} className="w-48">Start</Button>
                ) : (
                    <Button onClick={handleStop} className="w-48 bg-red-600 hover:bg-red-700">Stop</Button>
                )}
            </div>
        </div>
    );
};


const GroundingPage = ({ onBack }: { onBack: () => void }) => {
    const [activeExercise, setActiveExercise] = useState<string | null>(null);

    const renderContent = () => {
        switch(activeExercise) {
            case '54321':
                return (
                    <>
                        <header className="flex items-center justify-between mb-12">
                            <button onClick={() => setActiveExercise(null)} className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 transition-colors"><Icon name={ArrowLeft} className="h-6 w-6" /><span className="font-bold">Back to Grounding</span></button>
                            <h2 className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">5-4-3-2-1 Method</h2>
                            <div className="w-36"></div>
                        </header>
                        <main><FiveFourThreeTwoOne onFinish={() => setActiveExercise(null)} /></main>
                    </>
                );
            case 'breathing':
                 return (
                    <>
                        <header className="flex items-center justify-between mb-12">
                            <button onClick={() => setActiveExercise(null)} className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 transition-colors"><Icon name={ArrowLeft} className="h-6 w-6" /><span className="font-bold">Back to Grounding</span></button>
                            <h2 className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Breathing</h2>
                            <div className="w-36"></div>
                        </header>
                        <main><BreathingExercise onFinish={() => setActiveExercise(null)} /></main>
                    </>
                );
            default:
                const groundingOptions = [
                    { icon: Waves, title: "The 5-4-3-2-1 Method", description: "A simple technique to anchor you in the present moment using your five senses.", color: "border-sky-400", onClick: () => setActiveExercise('54321') },
                    { icon: HeartPulse, title: "Breathing", description: "A guided exercise to regulate your breath and calm your nervous system.", color: "border-green-400", onClick: () => setActiveExercise('breathing') },
                ];
                return (
                     <>
                        <header className="flex items-center justify-between mb-12">
                            <button onClick={onBack} className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 transition-colors"><Icon name={ArrowLeft} className="h-6 w-6" /><span className="font-bold">Back to Tools</span></button>
                            <h2 className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Grounding</h2>
                            <div className="w-24"></div>
                        </header>
                        <main>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {groundingOptions.map(option => (
                                    <div key={option.title} onClick={option.onClick} className={`bg-slate-800 border-l-4 ${option.color} p-6 rounded-xl shadow-lg flex flex-col justify-between transform hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer`}>
                                        <div>
                                            <div className="flex items-center space-x-4"><div className="bg-slate-700 p-3 rounded-full"><Icon name={option.icon} className="text-gray-100 h-8 w-8" /></div><h3 className="text-2xl font-bold text-gray-100">{option.title}</h3></div>
                                            <p className="mt-4 text-gray-300">{option.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </main>
                    </>
                );
        }
    };

    return <div className="py-12">{renderContent()}</div>;
};

// --- AI COMPANION PAGE COMPONENTS ---

type Message = {
  role: 'user' | 'model';
  text: string;
};

const AICompanionPage = ({ onBack }: { onBack: () => void }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const initChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatSession: Chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are a supportive and empathetic companion for a user named Nathan on his wellness journey. You are not a therapist and must not provide medical advice. Your goal is to listen, offer encouragement, and help Nathan reflect on his thoughts and feelings in a gentle and constructive way. Keep your responses thoughtful but reasonably concise. Your tone should be warm and understanding.",
          },
        });
        setChat(chatSession);
        setMessages([{
          role: 'model',
          text: "Hello Nathan. I'm here to listen. What's on your mind today?"
        }]);
      } catch (error) {
        console.error("AI Initialization Error:", error);
        setMessages([{
          role: 'model',
          text: "I'm having a little trouble starting up. Please check your connection or API key setup and refresh the page."
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: currentInput });
      const modelMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { role: 'model', text: "I'm having a little trouble connecting right now. Please try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  
  return (
    <div className="py-12">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 transition-colors"><Icon name={ArrowLeft} className="h-6 w-6" /><span className="font-bold">Back to Tools</span></button>
        <h2 className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">AI Companion</h2>
        <div className="w-24"></div>
      </header>
      <main className="bg-slate-800/80 p-4 sm:p-6 rounded-2xl shadow-2xl flex flex-col" style={{height: 'calc(100vh - 20rem)'}}>
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0"><Icon name={BrainCircuit} className="text-purple-400 h-6 w-6"/></div>}
              <div className={`max-w-xl px-5 py-3 rounded-2xl shadow-md ${msg.role === 'user' ? 'bg-amber-500 text-slate-900 rounded-br-lg' : 'bg-slate-700 text-gray-200 rounded-bl-lg'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
             <div className="flex items-start gap-3 justify-start">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0"><Icon name={BrainCircuit} className="text-purple-400 h-6 w-6"/></div>
                <div className="max-w-lg lg:max-w-xl px-5 py-3 rounded-2xl bg-slate-700 text-gray-200 rounded-bl-lg">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>Thinking</span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:0.0s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                  </div>
                </div>
            </div>
          )}
        </div>
        <div className="mt-auto pt-4 flex-shrink-0">
          <form onSubmit={handleSend} className="flex items-start gap-4">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
              placeholder={isLoading ? "Waiting for response..." : "Type your message here..."}
              className="flex-grow bg-slate-700 border border-slate-600 text-gray-200 rounded-lg p-3 resize-none focus:ring-amber-500 focus:border-amber-500 transition-all max-h-40"
              rows="1"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="!py-3 self-stretch" aria-label="Send message">
              <Icon name={Send} className="h-6 w-6" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};


// --- HOME PAGE COMPONENTS ---

const ToolCard = ({ icon, title, description, color, onClick }: { icon: ComponentType<any>, title: string, description: string, color: string, onClick: () => void }) => {
  return (
    <div onClick={onClick} className={`bg-slate-800 border-l-4 ${color} p-6 rounded-xl shadow-lg flex flex-col justify-between transform hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer`}>
      <div>
        <div className="flex items-center space-x-4"><div className="bg-slate-700 p-3 rounded-full"><Icon name={icon} className="text-gray-100 h-8 w-8" /></div><h3 className="text-2xl font-bold text-gray-100">{title}</h3></div>
        <p className="mt-4 text-gray-300">{description}</p>
      </div>
    </div>
  );
};

const HomePage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const tools = [
    { icon: BarChart3, title: "Tracker", description: "Monitor your progress, habits, and mood over time.", color: "border-amber-400", onClick: () => onNavigate('tracker') },
    { icon: BrainCircuit, title: "AI Companion", description: "Talk through your thoughts with a supportive AI companion.", color: "border-purple-400", onClick: () => onNavigate('companion') },
    { icon: PlaySquare, title: "Media", description: "Access a curated library of helpful videos and audio resources.", color: "border-orange-500", onClick: () => onNavigate('media') },
    { icon: Wind, title: "Grounding", description: "Find calm and presence with guided exercises and techniques.", color: "border-sky-400", onClick: () => onNavigate('grounding') },
  ];

  return (
    <div className="py-12">
      <header className="text-center mb-12">
        <h1 className="font-display text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 tracking-wide">Your Journey Your Tools</h1>
        <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">Welcome, Nathan. Here are some tools to support you.</p>
      </header>
      <main><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">{tools.map((tool) => <ToolCard key={tool.title} icon={tool.icon} title={tool.title} description={tool.description} color={tool.color} onClick={tool.onClick} />)}</div></main>
    </div>
  );
};


// --- MAIN APP COMPONENT (Router) ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'tracker': return <TrackerPage onBack={() => setCurrentPage('home')} />;
      case 'companion': return <AICompanionPage onBack={() => setCurrentPage('home')} />;
      case 'media': return <MediaPage onBack={() => setCurrentPage('home')} />;
      case 'grounding': return <GroundingPage onBack={() => setCurrentPage('home')} />;
      case 'home': default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1A202C] font-sans text-gray-200">
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
          .font-display { font-family: 'Lilita One', sans-serif; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
          .fade-in { animation: fadeIn 0.3s ease-in-out; }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fade-in">{renderPage()}</div>
      </div>
      <footer className="text-center pb-8 text-slate-500">
          <p>&copy; {new Date().getFullYear()} Your Journey Your Tools. All rights reserved.</p>
          <a href="https://www.yourjourneyyourtools.com" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-slate-400 hover:text-amber-400 transition-colors">
            www.yourjourneyyourtools.com
          </a>
      </footer>
    </div>
  );
}
