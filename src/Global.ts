import { Application, Texture } from 'pixi.js';
import { Howl } from 'howler';
import * as Matter from 'matter-js';
import { SceneManager } from './core/SceneManager';

export const Globals = {
  app: null as Application | null,
  sceneManager: null as SceneManager | null,
  physics: Matter,
  isMobile: false,
  screenWidth: 0,
  screenHeight: 0,
  gameWidth: 0,
  gameHeight: 0,
  scale: 0,
  // Separate resources for different asset types
  resources: {} as { [key: string]: Texture | any },
  soundResources: {} as { [key: string]: Howl },

  init(app: Application): void {
    this.app = app;
    this.sceneManager = SceneManager.getInstance();
    this.physics = Matter;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    this.resize();
  },

  destroy(): void {
    if (this.sceneManager) {
      this.sceneManager.destroy();
      this.sceneManager = null;
    }
    // Clear all resources when destroying
    this.resources = {};
    this.soundResources = {};
    this.app = null;
  },

  resize(): void {
    if (!this.app) return;
    
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.gameWidth = this.app.screen.width;
    this.gameHeight = this.app.screen.height;
    this.scale = Math.min(
      this.screenWidth / this.gameWidth,
      this.screenHeight / this.gameHeight
    );

    // Update PIXI renderer
    this.app.renderer.resize(this.gameWidth, this.gameHeight);

    // Scale the stage
    this.app.stage.scale.set(this.scale);

    // Center the stage
    this.app.stage.position.set(
      (this.screenWidth - this.gameWidth * this.scale) / 2,
      (this.screenHeight - this.gameHeight * this.scale) / 2
    );
  }
};
