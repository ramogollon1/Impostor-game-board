
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, GameSettings } from '../types';

interface Props {
  players: Player[];
  settings: GameSettings;
  onVote: (ids: string[]) => void;
}

const VotingScreen: React.FC<Props> = ({ players, settings, onVote }) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length < settings.impostorsCount) {
        setSelectedIds([...selectedIds, id]);
      } else if (settings.impostorsCount === 1) {
        // Simple swap if only 1 is needed
        setSelectedIds([id]);
      }
    }
  };

  const confirmElimination = () => {
    if (selectedIds.length === settings.impostorsCount) {
      onVote(selectedIds);
      navigate('/results');
    }
  };

  const isSelectionComplete = selectedIds.length === settings.impostorsCount;

  return (
    <div className="flex h-screen w-full flex-col bg-background-dark text-white font-display overflow-hidden">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4 glass-panel shrink-0">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">sports_esports</span>
          <div className="hidden sm:flex flex-col">
            <h2 className="text-xl font-bold tracking-tight">Fase de Votación</h2>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Se buscan {settings.impostorsCount} impostor{settings.impostorsCount > 1 ? 'es' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-dark px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            <span className={`size-2 rounded-full ${isSelectionComplete ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
            <span className="text-xs font-bold">{selectedIds.length} / {settings.impostorsCount} seleccionados</span>
          </div>
          <button onClick={() => navigate('/')} className="h-10 px-4 bg-surface-dark hover:bg-surface-light rounded-xl text-sm font-bold transition-all">
            Salir
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-[1024px] mx-auto flex flex-col gap-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-5xl font-black">
              {settings.impostorsCount > 1 
                ? `Selecciona a los ${settings.impostorsCount} sospechosos` 
                : '¿Quién es el impostor?'}
            </h1>
            <p className="text-text-muted text-lg">Debéis poneros de acuerdo para expulsar a los correctos.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-6 pb-20">
            {players.map(player => {
              const isSelected = selectedIds.includes(player.id);
              return (
                <div 
                  key={player.id} 
                  onClick={() => toggleSelection(player.id)}
                  className={`group relative flex flex-col gap-3 p-3 rounded-2xl cursor-pointer transition-all border-2
                    ${isSelected ? 'border-primary bg-surface-dark shadow-[0_0_20px_rgba(127,13,242,0.2)]' : 
                      'border-transparent bg-surface-darker hover:border-primary/50'}`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden relative">
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="size-12 bg-primary rounded-full flex items-center justify-center text-white shadow-xl animate-scale-in">
                          <span className="material-symbols-outlined text-2xl font-bold">check</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-bold truncate">{player.name}</p>
                    <p className={`text-xs ${isSelected ? 'text-primary font-bold' : 'text-text-muted'}`}>
                      {isSelected ? 'SOSPECHOSO' : 'Jugador'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="p-6 flex justify-center glass-panel">
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-darker/50 backdrop-blur-xl border border-white/10 p-2 px-4 rounded-2xl shadow-2xl w-full max-w-2xl">
          <div className="flex-1 px-4 sm:border-r border-white/10 flex flex-col justify-center py-2">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest text-center sm:text-left">Estado de Votación</span>
            <p className="text-sm font-bold text-center sm:text-left">
              {isSelectionComplete 
                ? '¡Objetivos confirmados! ¿Expulsar?' 
                : `Faltan ${settings.impostorsCount - selectedIds.length} selecciones`}
            </p>
          </div>
          <button 
            disabled={!isSelectionComplete}
            onClick={confirmElimination}
            className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2
              ${isSelectionComplete ? 'bg-primary hover:bg-primary-hover hover:scale-105' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
          >
            <span className="material-symbols-outlined">how_to_vote</span>
            Confirmar Expulsión Final
          </button>
        </div>
      </footer>
    </div>
  );
};

export default VotingScreen;
