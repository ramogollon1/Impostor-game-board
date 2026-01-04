
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, GameSettings } from '../types';

interface Props {
  players: Player[];
  settings: GameSettings;
}

const AssignmentScreen: React.FC<Props> = ({ players, settings }) => {
  const navigate = useNavigate();
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  if (players.length === 0) return <div>No hay jugadores.</div>;

  const currentPlayer = players[currentPlayerIdx];

  const handleNext = () => {
    setIsRevealed(false);
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
    } else {
      navigate('/discussion');
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white font-display overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <header className="p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Ronda 1: Asignación</h1>
            <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
              <span className="material-symbols-outlined text-lg">group</span>
              <span>Jugador {currentPlayerIdx + 1} de {players.length}</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {players.map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${i <= currentPlayerIdx ? 'bg-primary' : 'bg-slate-700'}`}></div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl glass-panel rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]">
          <div className="w-full md:w-5/12 bg-surface-darker flex flex-col items-center justify-center p-8 border-r border-white/5">
            <div className="relative w-32 h-32 rounded-full border-4 border-primary/30 p-1 mb-6 shadow-lg">
              <img className="w-full h-full rounded-full object-cover" src={currentPlayer.avatar} alt={currentPlayer.name} />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-surface-dark"></div>
            </div>
            <h2 className="text-2xl font-bold">{currentPlayer.name}</h2>
            <p className="text-text-muted text-sm">Es tu turno</p>
          </div>

          <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center text-center">
            {!isRevealed ? (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase">
                    <span className="material-symbols-outlined text-sm">visibility_off</span>
                    Zona Privada
                  </div>
                  <h3 className="text-3xl font-bold">¿Estás listo?</h3>
                  <p className="text-text-muted">Asegúrate de que nadie más mire la pantalla.</p>
                </div>
                <button 
                  onClick={() => setIsRevealed(true)}
                  className="w-full py-4 bg-primary rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined">fingerprint</span>
                  Revelar mi Identidad
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {currentPlayer.role === 'impostor' ? (
                  <>
                    <div className="size-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="material-symbols-outlined text-4xl">theater_comedy</span>
                    </div>
                    <h3 className="text-red-500 font-bold text-xl uppercase tracking-widest">IMPOSTOR</h3>
                    <p className="text-4xl font-black">Engaña a todos</p>
                    <p className="text-text-muted">No conoces la palabra secreta. ¡Suerte!</p>
                  </>
                ) : (
                  <>
                    <div className="size-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="material-symbols-outlined text-4xl">assignment</span>
                    </div>
                    <h3 className="text-primary font-bold text-xl uppercase tracking-widest">TRIPULANTE</h3>
                    <p className="text-text-muted">La palabra secreta es:</p>
                    <p className="text-4xl font-black text-white">{settings.secretWord.toUpperCase()}</p>
                  </>
                )}
                <button 
                  onClick={handleNext}
                  className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-bold"
                >
                  Ocultar y Pasar
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssignmentScreen;
