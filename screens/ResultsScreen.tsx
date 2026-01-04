
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, GameSettings } from '../types';

interface Props {
  players: Player[];
  settings: GameSettings;
  onReset: () => void;
}

const ResultsScreen: React.FC<Props> = ({ players, settings, onReset }) => {
  const navigate = useNavigate();
  const impostors = players.filter(p => p.role === 'impostor');
  const allImpostorsDead = impostors.every(p => p.status === 'dead');

  const handleRestart = () => {
    onReset();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark text-white font-display overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px]"></div>
      </div>

      <header className="relative z-10 glass-panel flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">emoji_events</span>
          <h2 className="text-xl font-bold tracking-tight">Fin del Juego</h2>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center justify-center p-4 rounded-full ${allImpostorsDead ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} animate-bounce`}>
              <span className="material-symbols-outlined text-5xl">
                {allImpostorsDead ? 'sentiment_very_satisfied' : 'sentiment_very_dissatisfied'}
              </span>
            </div>
            <h1 className={`text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r ${allImpostorsDead ? 'from-green-400 to-blue-400' : 'from-red-400 to-primary'}`}>
              {allImpostorsDead ? '¡Victoria Tripulante!' : '¡Victoria Impostora!'}
            </h1>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              {allImpostorsDead ? 'Los impostores han sido detectados y expulsados.' : 'El impostor ha sobrevivido a las votaciones.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
               <span className="text-sm font-semibold uppercase tracking-widest text-text-muted">Palabra Secreta</span>
               <div className="text-5xl font-black tracking-widest text-primary">{settings.secretWord.toUpperCase()}</div>
               <div className="mt-4 px-3 py-1 bg-white/5 rounded-full text-xs font-medium border border-white/10">{settings.category}</div>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">visibility_off</span>
                Identidades:
              </h3>
              <div className="grid gap-3">
                {impostors.map(imp => (
                  <div key={imp.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-red-500/30">
                    <img src={imp.avatar} className="size-12 rounded-full ring-2 ring-red-500 ring-offset-2 ring-offset-background-dark" />
                    <div>
                      <p className="font-bold">{imp.name}</p>
                      <p className={`text-xs ${imp.status === 'dead' ? 'text-green-400' : 'text-red-400'}`}>
                        {imp.status === 'dead' ? 'Expulsado' : 'Sobreviviente'}
                      </p>
                    </div>
                    <div className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">IMP</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleRestart}
              className="px-10 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">replay</span>
              Nueva Partida
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-10 py-4 bg-surface-dark hover:bg-surface-light rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">home</span>
              Ir al Menú
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsScreen;
