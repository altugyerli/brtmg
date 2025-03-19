import { useState, useEffect } from 'react';
import { Player, Enemy, Projectile, Position } from '../types';

const ENEMY_SPAWN_INTERVAL = 3000;
const PROJECTILE_SPEED = 8;
const ENEMY_SPEED = 2;

export const useGameLoop = () => {
  const [player, setPlayer] = useState<Player>({
    id: 'player',
    position: { x: 400, y: 300 },
    health: 100,
    maxHealth: 100,
    speed: 5,
    damage: 20,
    projectiles: []
  });

  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys(prev => new Set(prev).add(e.key));
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle mouse click for shooting
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const canvas = e.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const angle = Math.atan2(
        mouseY - player.position.y,
        mouseX - player.position.x
      );

      const projectile: Projectile = {
        id: Math.random().toString(),
        position: { ...player.position },
        angle,
        speed: PROJECTILE_SPEED,
        damage: player.damage
      };

      setProjectiles(prev => [...prev, projectile]);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [player.position]);

  // Spawn enemies
  useEffect(() => {
    const spawnEnemy = () => {
      const side = Math.floor(Math.random() * 4);
      let position: Position;

      switch (side) {
        case 0: // Top
          position = { x: Math.random() * 800, y: -20 };
          break;
        case 1: // Right
          position = { x: 820, y: Math.random() * 600 };
          break;
        case 2: // Bottom
          position = { x: Math.random() * 800, y: 620 };
          break;
        default: // Left
          position = { x: -20, y: Math.random() * 600 };
          break;
      }

      const enemy: Enemy = {
        id: Math.random().toString(),
        position,
        health: 50,
        maxHealth: 50,
        speed: ENEMY_SPEED,
        damage: 10
      };

      setEnemies(prev => [...prev, enemy]);
    };

    const interval = setInterval(spawnEnemy, ENEMY_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      // Update player position
      setPlayer(prev => {
        const newPos = { ...prev.position };
        if (keys.has('w')) newPos.y -= prev.speed;
        if (keys.has('s')) newPos.y += prev.speed;
        if (keys.has('a')) newPos.x -= prev.speed;
        if (keys.has('d')) newPos.x += prev.speed;

        // Keep player in bounds
        newPos.x = Math.max(20, Math.min(780, newPos.x));
        newPos.y = Math.max(20, Math.min(580, newPos.y));

        return { ...prev, position: newPos };
      });

      // Update projectiles
      setProjectiles(prev => prev.filter(projectile => {
        const newX = projectile.position.x + Math.cos(projectile.angle) * projectile.speed;
        const newY = projectile.position.y + Math.sin(projectile.angle) * projectile.speed;

        // Remove projectiles that are out of bounds
        if (newX < 0 || newX > 800 || newY < 0 || newY > 600) {
          return false;
        }

        projectile.position.x = newX;
        projectile.position.y = newY;
        return true;
      }));

      // Update enemies
      setEnemies(prev => prev.filter(enemy => {
        // Move towards player
        const angle = Math.atan2(
          player.position.y - enemy.position.y,
          player.position.x - enemy.position.x
        );

        enemy.position.x += Math.cos(angle) * enemy.speed;
        enemy.position.y += Math.sin(angle) * enemy.speed;

        // Check collision with projectiles
        projectiles.forEach(projectile => {
          const dx = projectile.position.x - enemy.position.x;
          const dy = projectile.position.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20) {
            enemy.health -= projectile.damage;
            setProjectiles(prev => prev.filter(p => p.id !== projectile.id));
          }
        });

        // Check collision with player
        const dx = player.position.x - enemy.position.x;
        const dy = player.position.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 35) {
          setPlayer(prev => ({
            ...prev,
            health: Math.max(0, prev.health - enemy.damage * 0.1)
          }));
        }

        return enemy.health > 0;
      }));
    };

    const frameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameId);
  }, [keys, player, enemies, projectiles]);

  return { player, enemies, projectiles };
};