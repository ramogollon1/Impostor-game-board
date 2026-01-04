
import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConfigScreen from './screens/ConfigScreen';
import AssignmentScreen from './screens/AssignmentScreen';
import DiscussionScreen from './screens/DiscussionScreen';
import VotingScreen from './screens/VotingScreen';
import ResultsScreen from './screens/ResultsScreen';
import { Player, GameSettings } from './types';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    category: 'Comida',
    impostorsCount: 1,
    discussionMinutes: 5,
    secretWord: '',
    isManualWord: false
  });

  const startGame = useCallback((newPlayers: Player[], newSettings: GameSettings) => {
    // 1. Assign Roles
    const shuffled = [...newPlayers].sort(() => Math.random() - 0.5);
    const updatedPlayers = shuffled.map((p, idx) => ({
      ...p,
      role: idx < newSettings.impostorsCount ? ('impostor' as const) : ('crew' as const),
      status: 'alive' as const
    }));
    
    // 2. Determine Secret Word
    let finalWord = newSettings.secretWord;

    if (!newSettings.isManualWord) {
      if (newSettings.category === 'Aleatorio') {
        const allWords = CATEGORIES.filter(c => c.name !== 'Aleatorio').flatMap(c => c.words);
        finalWord = allWords[Math.floor(Math.random() * allWords.length)];
      } else {
        const cat = CATEGORIES.find(c => c.name === newSettings.category) || CATEGORIES[0];
        finalWord = cat.words[Math.floor(Math.random() * cat.words.length)];
      }
    }
    
    setPlayers(updatedPlayers);
    setSettings({ ...newSettings, secretWord: finalWord.toUpperCase() });
  }, []);

  const resetGame = useCallback(() => {
    setPlayers([]);
  }, []);

  const handleEliminations = useCallback((ids: string[]) => {
    setPlayers(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: 'dead' as const } : p));
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/" 
          element={<ConfigScreen onStart={startGame} />} 
        />
        <Route 
          path="/assignment" 
          element={<AssignmentScreen players={players} settings={settings} />} 
        />
        <Route 
          path="/discussion" 
          element={<DiscussionScreen settings={settings} />} 
        />
        <Route 
          path="/voting" 
          element={<VotingScreen players={players} settings={settings} onVote={handleEliminations} />} 
        />
        <Route 
          path="/results" 
          element={<ResultsScreen players={players} settings={settings} onReset={resetGame} />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
