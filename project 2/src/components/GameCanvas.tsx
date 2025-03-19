import React, { useEffect, useRef } from 'react';
import { Player, Enemy, Projectile } from '../types';

interface GameCanvasProps {
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({ player, enemies, projectiles }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#4A90E2';
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Health bar
    const healthBarWidth = 40;
    const healthPercentage = player.health / player.maxHealth;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.position.x - healthBarWidth/2, player.position.y - 30, healthBarWidth, 5);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(player.position.x - healthBarWidth/2, player.position.y - 30, healthBarWidth * healthPercentage, 5);
  };

  const drawEnemies = (ctx: CanvasRenderingContext2D) => {
    enemies.forEach(enemy => {
      ctx.fillStyle = '#E74C3C';
      ctx.beginPath();
      ctx.arc(enemy.position.x, enemy.position.y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Enemy health bar
      const healthBarWidth = 30;
      const healthPercentage = enemy.health / enemy.maxHealth;
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(enemy.position.x - healthBarWidth/2, enemy.position.y - 25, healthBarWidth, 4);
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(enemy.position.x - healthBarWidth/2, enemy.position.y - 25, healthBarWidth * healthPercentage, 4);
    });
  };

  const drawProjectiles = (ctx: CanvasRenderingContext2D) => {
    projectiles.forEach(projectile => {
      ctx.fillStyle = '#F1C40F';
      ctx.beginPath();
      ctx.arc(projectile.position.x, projectile.position.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawProjectiles(ctx);
    drawEnemies(ctx);
    drawPlayer(ctx);
  }, [player, enemies, projectiles]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="bg-gray-900 rounded-lg shadow-lg"
    />
  );
};

export default GameCanvas;