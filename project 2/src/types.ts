export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  position: Position;
  health: number;
  maxHealth: number;
}

export interface Player extends Entity {
  speed: number;
  damage: number;
  projectiles: Projectile[];
}

export interface Enemy extends Entity {
  speed: number;
  damage: number;
}

export interface Projectile {
  id: string;
  position: Position;
  angle: number;
  speed: number;
  damage: number;
}