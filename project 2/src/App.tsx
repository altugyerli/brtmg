import React from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import GameCanvas from './components/GameCanvas';
import { Sword } from 'lucide-react';

function App() {
  const { player, enemies, projectiles } = useGameLoop();

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sword className="w-8 h-8" />
          Realm Clone
        </h1>
        <p className="text-gray-300">WASD to move, Click to shoot</p>
      </div>

      <div className="relative">
        <GameCanvas
          player={player}
          enemies={enemies}
          projectiles={projectiles}
        />
        
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
          Health: {Math.round(player.health)}
        </div>
        
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded">
          Score: {enemies.length}
        </div>
      </div>
    </div>
  );
}

export default App;