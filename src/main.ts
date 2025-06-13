import { GameScene } from "@scenes/GameScene/GameScene";
import { LoadingScene } from "@scenes/LoadingScene";
import '../css/main.css';
import { Game } from "phaser";
import './lib/phaser';
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  backgroundColor: '#87CEEB',
  scene: [LoadingScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  parent:"game-container"
};
export const game: Game = new Game(config);
export const originalWidth = 1920;
export const originalHeight = 1080;
export type game = Game;
(globalThis as any).__PHASER_GAME__ = game;