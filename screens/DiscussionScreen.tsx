
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameSettings } from '../types';

interface Props {
  settings: GameSettings;
}

const DiscussionScreen: React.FC<Props> = ({ settings }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(settings.discussionMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / (settings.discussionMinutes * 60)) * 100;

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white font-display overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>

      <header className="relative z-10 glass-panel flex items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined">forum</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">Impostor Game Board</h1>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto">
        <div className="mb-10 text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 mb-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 ${!isActive ? 'hidden' : ''}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-semibold text-primary-200 uppercase tracking-wider">En vivo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Fase de Discusión</h2>
          <p className="text-text-muted text-lg">Debatan las pruebas y encuentren al impostor.</p>
        </div>

        <div className="w-full max-w-2xl glass-panel rounded-3xl p-8 md:p-12 shadow-2xl neon-box">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex flex-col items-center gap-2">
              <div className="h-32 w-32 md:h-40 md:w-40 flex items-center justify-center rounded-2xl bg-surface-darker border border-white/5 shadow-inner">
                <span className="text-6xl md:text-8xl font-black leading-none">{minutes.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-slate-500">Minutos</span>
            </div>
            <div className="flex flex-col justify-center gap-3 pb-6">
              <div className={`h-3 w-3 rounded-full bg-primary ${isActive ? 'animate-pulse' : ''}`}></div>
              <div className={`h-3 w-3 rounded-full bg-primary ${isActive ? 'animate-pulse' : ''}`}></div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-32 w-32 md:h-40 md:w-40 flex items-center justify-center rounded-2xl bg-surface-darker border border-white/5 shadow-inner">
                <span className="text-6xl md:text-8xl font-black leading-none">{seconds.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-slate-500">Segundos</span>
            </div>
          </div>

          <div className="mb-10 space-y-3">
            <div className="flex justify-between items-end px-1">
              <span className="text-sm font-medium text-slate-300">Tiempo restante</span>
              <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-surface-darker border border-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-primary shadow-lg transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setTimeLeft(prev => Math.max(0, prev - 30))} className="size-14 rounded-full bg-surface-dark flex items-center justify-center border border-white/10 hover:border-primary/50 transition-all">
              <span className="material-symbols-outlined text-white/70">remove</span>
            </button>
            <button 
              onClick={() => setIsActive(!isActive)}
              className="size-20 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "40px" }}>
                {isActive ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button onClick={() => setTimeLeft(prev => prev + 30)} className="size-14 rounded-full bg-surface-dark flex items-center justify-center border border-white/10 hover:border-primary/50 transition-all">
              <span className="material-symbols-outlined text-white/70">add</span>
            </button>
          </div>
        </div>

        <button 
          onClick={() => navigate('/voting')}
          className="mt-12 px-10 py-4 bg-surface-dark rounded-xl border border-white/10 flex items-center gap-3 hover:border-red-500/50 hover:shadow-lg transition-all"
        >
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold leading-tight">Terminar Discusión</span>
            <span className="text-xs text-text-muted">Ir directamente a votación</span>
          </div>
          <span className="material-symbols-outlined text-red-400">how_to_vote</span>
        </button>
      </main>
    </div>
  );
};

export default DiscussionScreen;
