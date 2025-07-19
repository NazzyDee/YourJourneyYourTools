/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const moods = [
  { 
    label: 'Happy', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
  },
  { 
    label: 'Sad', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
  },
  { 
    label: 'Lonely', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="8" y1="10" x2="10" y2="10"></line><line x1="14" y1="10" x2="16" y2="10"></line></svg>
  },
  { 
    label: 'Angry', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><path d="m8 9 2 1" /><path d="m16 9-2 1" /></svg>
  },
  { 
    label: 'Neutral', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
  },
];

const substanceList = [
    "Select Substance", "Alcohol", "Cannabis", "Cocaine", "MDMA (Ecstasy)", "Heroin", 
    "Methamphetamine (Ice)", "Inhalants", "Ketamine", "LSD (Acid)", "Other"
];

const substanceUnits = {
    'Alcohol': 'e.g., 1 standard drink',
    'Cannabis': 'e.g., 1 joint, 1 gram',
    'Cocaine': 'e.g., 1 line, 0.1g',
    'MDMA (Ecstasy)': 'e.g., 1 pill, 100mg',
    'Heroin': 'e.g., 1 point, 0.1g',
    'Methamphetamine (Ice)': 'e.g., 1 point, 0.1g',
    'Inhalants': 'e.g., 1 can, 10 minutes',
    'Ketamine': 'e.g., 1 bump, 50mg',
    'LSD (Acid)': 'e.g., 1 tab',
    'Other': 'e.g., 1 pill, 50mg'
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const quotes = [
    { quote: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
    { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "Your limitation is only your imagination.", author: "Unknown" },
    { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
];

// --- Tracker Page Component ---
const TrackerPage = ({ onBack }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSubstance, setSelectedSubstance] = useState("Select Substance");
  const [otherSubstance, setOtherSubstance] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [substanceHistory, setSubstanceHistory] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleLogEntry = () => {
    const substanceToLog = selectedSubstance === 'Other' ? otherSubstance : selectedSubstance;
    
    const newLog = {
      id: Date.now(),
      mood: selectedMood,
      day: selectedDay,
      substance: substanceToLog,
      amount,
      location: location.trim(),
    };

    setSubstanceHistory([newLog, ...substanceHistory]);

    // Show confirmation message
    setConfirmationMessage('Entry saved successfully!');
    setTimeout(() => {
      setConfirmationMessage('');
    }, 3000);


    // Reset fields
    setSelectedMood(null);
    setSelectedDay(null);
    setSelectedSubstance("Select Substance");
    setOtherSubstance("");
    setAmount("");
    setLocation("");
  };

  const isLogEntryDisabled = 
    !selectedMood || 
    !selectedDay || 
    selectedSubstance === "Select Substance" || 
    !amount.trim() || 
    (selectedSubstance === 'Other' && !otherSubstance.trim());

  return (
    <div className="page-container">
      <button onClick={onBack} className="home-button" aria-label="Go back to home">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
           <span>Home</span>
        </button>
      <header className="app-header">
        <h1 className="app-title">Trackers</h1>
        <p className="app-subtitle">Log your mood and substance use to gain insight.</p>
      </header>
      <main className="tracker-content">
        <div className="tracker-section card">
          <h2 className="tracker-title">Daily Journal</h2>
          <p className="tracker-description">Log your mood and activities for the day.</p>
          
          <div className="form-group">
            <label>How are you feeling?</label>
            <div className="mood-options">
              {moods.map((mood) => (
                <div key={mood.label} className="mood-item-container">
                    <button
                      className={`mood-button ${selectedMood?.label === mood.label ? 'selected' : ''}`}
                      aria-label={mood.label}
                      onClick={() => setSelectedMood(mood)}
                    >
                      {mood.icon}
                    </button>
                    <div className="mood-label-container">
                      {selectedMood?.label === mood.label && (
                        <div className="selected-mood-label">
                          {mood.label}
                        </div>
                      )}
                    </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Day of the Week</label>
            <div className="day-selector-container">
              {daysOfWeek.map(day => (
                <button key={day} className={`day-button ${selectedDay === day ? 'selected' : ''}`} onClick={() => setSelectedDay(day)}>
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="substance-select">Substance</label>
            <select
                id="substance-select"
                value={selectedSubstance}
                onChange={(e) => setSelectedSubstance(e.target.value)}
            >
                {substanceList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>
          {selectedSubstance === 'Other' && (
            <div className="form-group">
                <label htmlFor="other-substance-input">Please specify</label>
                <input
                    id="other-substance-input"
                    type="text"
                    placeholder="e.g., Prescription med"
                    value={otherSubstance}
                    onChange={(e) => setOtherSubstance(e.target.value)}
                />
            </div>
          )}
           <div className="form-group">
            <label htmlFor="location-input">Place or People (Optional)</label>
            <input 
              id="location-input" 
              type="text" 
              placeholder="e.g., At home, with friends"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount-input">Amount / Quantity</label>
            <input 
              id="amount-input" 
              type="text" 
              placeholder={substanceUnits[selectedSubstance] || 'e.g., 1 cup'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button className="log-button" onClick={handleLogEntry} disabled={isLogEntryDisabled}>
            Log Entry
          </button>
          {confirmationMessage && (
            <div className="confirmation-message">{confirmationMessage}</div>
          )}

          <hr className="history-divider" />
          <div className="history-section">
            <h3 className="history-title">History</h3>
            {substanceHistory.length > 0 ? (
              <ul className="history-list">
                {substanceHistory.map(log => (
                  <li key={log.id} className="history-item">
                    <div className="history-mood-icon">
                        {log.mood.icon}
                    </div>
                    <div className="history-details">
                        <strong>{log.day}: {log.amount} of {log.substance}</strong>
                        {log.location && <span className="location-text">{log.location}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-history-message">No logs yet. Your journal will appear here.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Media Page Component ---
const MediaPage = ({ onBack }) => {
  const mediaCards = [
    { 
      title: 'Videos', 
      link: 'https://www.youtube.com/playlist?list=PL1MHtsikpzrnje9hJbwVRhYry28G4jQz2',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg> 
    },
    { 
      title: 'Podcast', 
      subtitle: 'powered by notebook lm',
      link: 'https://www.youtube.com/playlist?list=PL1MHtsikpzrlXgHVnVD2txdA2weD0xDFX',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
    },
  ];

  return (
    <div className="page-container">
       <button onClick={onBack} className="home-button" aria-label="Go back to home">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
           <span>Home</span>
        </button>
      <header className="app-header">
        <h1 className="app-title">Media Resources</h1>
        <p className="app-subtitle">Videos and podcasts to support your journey.</p>
      </header>
      <main>
        <div className="card-grid">
          {mediaCards.map((card) => (
            <a
              key={card.title}
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              aria-label={card.title}
            >
              {card.icon}
              <h2 className="card-title">{card.title}</h2>
              {card.subtitle && <p className="card-subtitle">{card.subtitle}</p>}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

// --- 5-4-3-2-1 Grounding Exercise Page Component ---
const FiveFourThreeTwoOnePage = ({ onBack, onHome }) => {
  const steps = [
    "Name 5 things you can see.",
    "Name 4 things you can feel.",
    "Name 3 things you can hear.",
    "Name 2 things you can smell.",
    "Name 1 thing you can taste.",
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [randomQuote, setRandomQuote] = useState(null);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Last step, show quote
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setRandomQuote(quotes[randomIndex]);
      setStepIndex(stepIndex + 1);
    }
  };
  
  const isFinished = stepIndex >= steps.length;

  return (
    <div className="page-container exercise-page-container">
      <button onClick={onHome} className="home-button" aria-label="Go back to home">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
           <span>Home</span>
      </button>
      <header className="app-header">
        <h1 className="app-title">The 5-4-3-2-1 Method</h1>
      </header>
      <main>
          <div className="exercise-card">
              {!isFinished ? (
                  <p className="exercise-instruction">{steps[stepIndex]}</p>
              ) : (
                  <div className="exercise-quote">
                      <p>"{randomQuote?.quote}"</p>
                      <span>- {randomQuote?.author}</span>
                  </div>
              )}
          </div>
          <button onClick={isFinished ? onBack : handleNext} className="exercise-nav-button">
              {isFinished ? 'Finish' : 'Next'}
          </button>
      </main>
    </div>
  );
};


// --- Breathing Exercise Page Component ---
const BreathingExercisePage = ({ onBack, onHome }) => {
  const breathOptions = [5, 10, 15, 20];
  const [selectedBreaths, setSelectedBreaths] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completionQuote, setCompletionQuote] = useState(null);
  const [breathPhase, setBreathPhase] = useState(''); // 'Inhale' or 'Exhale'

  useEffect(() => {
    let cycleTimer;
    let phaseTimer;

    if (isActive) {
      const runCycle = (count) => {
        if (count >= selectedBreaths) {
          setIsActive(false);
          setIsAnimating(false);
          const randomIndex = Math.floor(Math.random() * quotes.length);
          setCompletionQuote(quotes[randomIndex]);
          setBreathPhase('');
          return;
        }

        setBreathCount(count + 1);
        setIsAnimating(true);
        setBreathPhase('Inhale');

        phaseTimer = setTimeout(() => {
          setBreathPhase('Exhale');
        }, 4000); // Inhale duration is 4s

        cycleTimer = setTimeout(() => {
          runCycle(count + 1);
        }, 10000); // Total cycle is 10s
      };
      runCycle(0);
    }

    return () => {
      clearTimeout(cycleTimer);
      clearTimeout(phaseTimer);
    };
  }, [isActive, selectedBreaths]);

  const handleStartStop = () => {
    if (isActive) { // If currently running, stop it
      setIsActive(false);
      setBreathCount(0);
      setIsAnimating(false);
      setCompletionQuote(null);
      setBreathPhase('');
    } else { // If stopped, start it
      setCompletionQuote(null); // Reset quote before starting
      setBreathCount(0);
      setIsActive(true);
    }
  };

  const handleSelectBreaths = (num) => {
    if (!isActive) { // only allow change if not active
      setSelectedBreaths(num);
      setCompletionQuote(null); // Reset if selection changes
    }
  }

  const isFinished = completionQuote !== null;

  return (
    <div className="page-container exercise-page-container">
      <button onClick={onHome} className="home-button" aria-label="Go back to home">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
           <span>Home</span>
      </button>
      <header className="app-header">
        <h1 className="app-title">Breathing Exercise</h1>
      </header>
      <main>
          <div className="breath-choice-container">
            {breathOptions.map(num => (
                <button 
                    key={num} 
                    className={`breath-choice-button ${selectedBreaths === num ? 'selected' : ''}`}
                    onClick={() => handleSelectBreaths(num)}
                    disabled={isActive}
                >
                    {num} Breaths
                </button>
            ))}
          </div>

          <div className={`breathing-circle-container ${isAnimating ? 'animating' : ''}`}>
             <div className="breathing-circle">
                 {isFinished ? (
                     <div className="exercise-quote breathing-quote">
                         <p>"{completionQuote.quote}"</p>
                         <span>- {completionQuote.author}</span>
                     </div>
                 ) : isActive ? (
                     <>
                        <div className="breathing-phase">{breathPhase}</div>
                        <div className="breathing-count-display">{breathCount}</div>
                     </>
                 ) : (
                     <div className="breathing-text">Ready to begin?</div>
                 )}
             </div>
          </div>

          <button onClick={isFinished ? onBack : handleStartStop} className="exercise-nav-button">
              {isFinished ? 'Finish' : (isActive ? 'Stop' : 'Start')}
          </button>
      </main>
    </div>
  );
};


// --- Grounding Page Component ---
const GroundingPage = ({ onBack, onNavigate }) => {
  const groundingCards = [
    { 
      title: 'The 5-4-3-2-1 Method', 
      enabled: true,
      page: 'five-four-three-two-one',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon"><path d="M7 20h10" /><path d="M10 20v-6l-2-2a3 3 0 0 1-2-2.8V8.2a3 3 0 0 1 2-2.8l2-1.2a3 3 0 0 1 3.2 0l2 1.2a3 3 0 0 1 2 2.8v1a3 3 0 0 1-2 2.8l-2 2v6" /></svg>
    },
    { 
      title: 'Breathing', 
      enabled: true, 
      page: 'breathing-exercise',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
    },
  ];

  return (
    <div className="page-container">
       <button onClick={onBack} className="home-button" aria-label="Go back to home">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
           <span>Home</span>
        </button>
      <header className="app-header">
        <h1 className="app-title">Grounding Techniques</h1>
        <p className="app-subtitle">Tools to help you anchor in the present moment.</p>
      </header>
      <main>
        <div className="card-grid">
          {groundingCards.map((card) => (
            <button
              key={card.title}
              className={`card ${!card.enabled ? 'disabled' : ''}`}
              disabled={!card.enabled}
              onClick={() => card.enabled && onNavigate(card.page)}
              aria-label={card.title}
            >
              {card.icon}
              <h2 className="card-title">{card.title}</h2>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};


// --- Home Page Component ---
const HomePage = ({ onNavigate }) => {
  const cards = [
    { title: 'Tracker', page: 'tracker', enabled: true, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> },
    { title: 'Media', page: 'media', enabled: true, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg> },
    { title: 'Grounding', page: 'grounding', enabled: true, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon"><path d="M7 20h10" /><path d="M10 20v-6l-2-2a3 3 0 0 1-2-2.8V8.2a3 3 0 0 1 2-2.8l2-1.2a3 3 0 0 1 3.2 0l2 1.2a3 3 0 0 1 2 2.8v1a3 3 0 0 1-2 2.8l-2 2v6" /></svg> },
    { title: 'Coming Soon', enabled: false, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> },
  ];

  return (
    <div className="page-container">
      <header className="app-header">
        <h1 className="app-title">Your Journey Your Tools</h1>
        <p className="app-subtitle">A collection of tools for growth and well-being</p>
      </header>
      <main>
        <div className="card-grid">
          {cards.map((card) => (
            <button
              key={card.title}
              className={`card ${!card.enabled ? 'disabled' : ''}`}
              disabled={!card.enabled}
              onClick={() => card.enabled && onNavigate(card.page)}
              aria-label={card.title}
            >
              {card.icon}
              <h2 className="card-title">{card.title}</h2>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'tracker':
        return <TrackerPage onBack={() => setCurrentPage('home')} />;
      case 'media':
        return <MediaPage onBack={() => setCurrentPage('home')} />;
      case 'grounding':
        return <GroundingPage onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />;
      case 'five-four-three-two-one':
        return <FiveFourThreeTwoOnePage onBack={() => setCurrentPage('grounding')} onHome={() => setCurrentPage('home')} />;
      case 'breathing-exercise':
        return <BreathingExercisePage onBack={() => setCurrentPage('grounding')} onHome={() => setCurrentPage('home')} />;
      case 'home':
      default:
        return <HomePage onNavigate={(page) => setCurrentPage(page)} />;
    }
  }

  return (
    <div className="app-container">
      {renderPage()}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}