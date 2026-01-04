
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, GameSettings } from '../types';
import { CATEGORIES, AVATARS } from '../constants';

interface Props {
  onStart: (players: Player[], settings: GameSettings) => void;
}

const ConfigScreen: React.FC<Props> = ({ onStart }) => {
  const navigate = useNavigate();
  const [names, setNames] = useState<string[]>(['Juan Luis', 'María', 'Carlos', 'Sofía']);
  const [newName, setNewName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1].name);
  const [impostors, setImpostors] = useState(1);
  const [isManual, setIsManual] = useState(false);
  const [manualWord, setManualWord] = useState('');

  // Keep impostors in check when names change
  useEffect(() => {
    const maxAllowed = names.length > 0 ? names.length - 1 : 0;
    if (impostors > maxAllowed) {
      setImpostors(Math.max(1, maxAllowed));
    }
  }, [names.length]);

  const addPlayer = () => {
    if (newName.trim()) {
      setNames([...names, newName.trim()]);
      setNewName('');
    }
  };

  const removePlayer = (idx: number) => {
    if (names.length <= 3) return; // Mínimo 3 jugadores
    setNames(names.filter((_, i) => i !== idx));
  };

  const handleStart = () => {
    if (names.length < 3) return;
    if (isManual && !manualWord.trim()) {
      alert("Introduce una palabra secreta manual");
      return;
    }

    const initialPlayers: Player[] = names.map((name, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      avatar: AVATARS[i % AVATARS.length],
      role: 'crew',
      status: 'alive'
    }));

    const settings: GameSettings = {
      category,
      impostorsCount: impostors,
      discussionMinutes: 3,
      secretWord: isManual ? manualWord : '',
      isManualWord: isManual
    };

    onStart(initialPlayers, settings);
    navigate('/assignment');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden">
      <div className="px-6 pt-10 pb-6 flex justify-center">
        <div className="max-w-[1200px] w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight neon-text">Impostor Board</h1>
            <p className="text-slate-500 dark:text-text-muted text-lg font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">sports_esports</span>
              Configura tu partida
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-card-dark p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-white/5">
            <div className="bg-primary/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary">group</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-text-muted font-bold uppercase tracking-widest">Jugadores</p>
              <p className="text-2xl font-black leading-none">{names.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-20 flex flex-1 justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1200px] w-full">
          {/* Jugadores */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-white/5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Participantes</h2>
                  <p className="text-slate-400 dark:text-text-muted text-sm">Añade a tus amigos para empezar.</p>
                </div>
              </div>
              
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">person_add</span>
                  <input 
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 dark:bg-input-dark border-none focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                    placeholder="Nombre del jugador..." 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  />
                </div>
                <button onClick={addPlayer} className="h-14 px-6 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/25 transition-transform active:scale-95">
                  <span>Añadir</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[450px] pr-2 space-y-3 custom-scrollbar">
                {names.map((name, i) => (
                  <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-background-dark/50 border border-slate-100 dark:border-white/5 hover:border-primary/50 transition-all animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-black shadow-lg">
                        {name.substring(0, 1).toUpperCase()}
                      </div>
                      <span className="font-bold text-lg">{name}</span>
                    </div>
                    <button 
                      onClick={() => removePlayer(i)} 
                      disabled={names.length <= 3}
                      className={`p-2 rounded-lg transition-all ${names.length <= 3 ? 'opacity-20' : 'text-slate-400 hover:text-red-500 hover:bg-red-500/10'}`}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-card-dark rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-white/5">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">vpn_key</span>
                    Palabra Secreta
                  </h2>
                  <div className="flex bg-slate-100 dark:bg-background-dark p-1 rounded-xl border border-slate-200 dark:border-white/5">
                    <button 
                      onClick={() => setIsManual(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!isManual ? 'bg-primary text-white shadow-md' : 'text-slate-400'}`}
                    >Auto</button>
                    <button 
                      onClick={() => setIsManual(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isManual ? 'bg-primary text-white shadow-md' : 'text-slate-400'}`}
                    >Manual</button>
                  </div>
                </div>

                {!isManual ? (
                  <div className="animate-fade-in">
                    <label className="text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-widest">Categoría del Juego</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(c => (
                        <button
                          key={c.name}
                          onClick={() => setCategory(c.name)}
                          className={`px-3 py-3 rounded-xl text-sm font-bold border transition-all ${category === c.name ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 dark:border-white/5 hover:border-primary/50'}`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-widest">Tu Palabra Personalizada</label>
                      <input 
                        className="w-full h-14 px-4 rounded-2xl bg-slate-50 dark:bg-input-dark border-none focus:ring-2 focus:ring-primary font-bold text-lg" 
                        placeholder="Ej: Tortilla, Messi..." 
                        value={manualWord}
                        onChange={(e) => setManualWord(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-text-muted italic bg-primary/5 p-3 rounded-xl border border-primary/10">
                      Usa el modo manual para que nadie sepa qué palabra has elegido, ¡perfecto para retos locales!
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <span className="material-symbols-outlined text-red-500">theater_comedy</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Impostores</h3>
                  <p className="text-xs text-text-muted">Dificultad de la partida</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-50 dark:bg-input-dark p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                <button 
                  disabled={impostors <= 1}
                  onClick={() => setImpostors(Math.max(1, impostors - 1))}
                  className="w-12 h-12 rounded-xl bg-white dark:bg-card-dark shadow-md flex items-center justify-center hover:bg-slate-100 disabled:opacity-20 active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <div className="text-center">
                  <span className="text-4xl font-black text-primary">{impostors}</span>
                  <p className="text-[10px] text-text-muted font-bold uppercase">De {names.length - 1} max.</p>
                </div>
                <button 
                  disabled={impostors >= names.length - 1}
                  onClick={() => setImpostors(impostors + 1)}
                  className="w-12 h-12 rounded-xl bg-white dark:bg-card-dark shadow-md flex items-center justify-center hover:bg-slate-100 disabled:opacity-20 active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>

            <button 
              onClick={handleStart}
              className="w-full h-20 bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white rounded-3xl font-black text-2xl shadow-2xl shadow-primary/40 active:scale-[0.98] flex items-center justify-center gap-4 group"
            >
              <span>¡JUGAR YA!</span>
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward_ios</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
