import { Application, Container } from 'pixi.js';
import { SceneManager } from './scenes/SceneManager';
import { LoadingManager } from './utils/LoadingManager';
import { InputManager } from './utils/InputManager';
import { PerformanceMonitor } from './utils/PerformanceMonitor';
import { DebugOverlay } from './utils/DebugOverlay';
import { EventManager, GameEvent } from './utils/EventManager';
import { ConfigManager } from './utils/ConfigManager';
import { LoaderScene } from './scenes/LoaderScene';
import { MainScene } from './scenes/MainScene';
import { FishScene } from './scenes/FishScene';
import * as TWEEN from '@tweenjs/tween.js';

const isDevelopment = process.env.NODE_ENV === 'development';

export class App {
  private static instance: App;
  private app: Application;
  private sceneManager: SceneManager;
  private loadingManager: LoadingManager;
  private inputManager: InputManager;
  private performanceMonitor: PerformanceMonitor | null = null;
  private debugOverlay: DebugOverlay | null = null;
  private eventManager: EventManager;
  private configManager: ConfigManager;

  private constructor() {
    // Create the PIXI application
    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    });

    // Mount the view to the DOM
    const gameContainer = document.getElementById('game');
    if (gameContainer) {
      gameContainer.appendChild(this.app.view as HTMLCanvasElement);
    } else {
      document.body.appendChild(this.app.view as HTMLCanvasElement);
    }

    // Set canvas style
    const canvas = this.app.view as HTMLCanvasElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    this.eventManager = EventManager.getInstance();
    this.configManager = ConfigManager.getInstance();
    this.sceneManager = SceneManager.getInstance();
    this.loadingManager = LoadingManager.getInstance();
    this.inputManager = InputManager.getInstance();

    // Initialize debug tools only in development mode
    if (isDevelopment) {
      this.performanceMonitor = PerformanceMonitor.getInstance();
      this.debugOverlay = DebugOverlay.getInstance();
      this.app.stage.addChild(this.debugOverlay.getContainer());
    }

    this.setupEventListeners();
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  private setupEventListeners(): void {
    // Window resize
    window.addEventListener('resize', this.onResize.bind(this));

    // Game events
    this.eventManager.on(GameEvent.GAME_PAUSED, this.onGamePaused.bind(this));
    this.eventManager.on(GameEvent.GAME_RESUMED, this.onGameResumed.bind(this));
    this.eventManager.on(GameEvent.SCENE_CHANGED, this.onSceneChanged.bind(this));
    this.eventManager.on('changeScene', this.onChangeScene.bind(this));

    // Debug events
    this.eventManager.on(GameEvent.DEBUG_TOGGLE, this.onDebugToggle.bind(this));
  }

  public async init(): Promise<void> {
    try {
      console.log('Initializing application...');

      // Initialize performance monitoring only in development mode
      if (isDevelopment && this.performanceMonitor) {
        this.performanceMonitor.start();
      }

      // Initialize scene manager
      await this.sceneManager.init(this.app.stage);

      // Start with loading scene
      const loaderScene = new LoaderScene();
      this.sceneManager.addScene({
        name: 'LoaderScene',
        container: loaderScene,
        init: async () => {
          await loaderScene.init();
          return Promise.resolve();
        },
        update: delta => loaderScene.update(delta),
        onResize: (width, height) => loaderScene.resize(),
        destroy: () => loaderScene.destroy(),
      });

      // Listen for loading complete event
      this.eventManager.on('loadingComplete', async () => {
        console.log('Loading complete, transitioning to main scene');

        // Create and add main scene
        const mainScene = new MainScene();
        this.sceneManager.addScene({
          name: 'MainScene',
          container: mainScene,
          init: async () => {
            await mainScene.init();
            return Promise.resolve();
          },
          update: delta => mainScene.update(delta),
          onResize: (width, height) => mainScene.resize(),
          destroy: () => mainScene.destroy(),
        });

        // Create and add fish scene
        const fishScene = new FishScene();
        this.sceneManager.addScene({
          name: 'FishScene',
          container: fishScene,
          init: async () => {
            await fishScene.init();
            return Promise.resolve();
          },
          update: delta => fishScene.update(delta),
          onResize: (width, height) => fishScene.resize(),
          destroy: () => fishScene.destroy(),
        });

        // Switch to main scene
        await this.sceneManager.changeScene('MainScene');
      });

      // Start with loader scene
      await this.sceneManager.changeScene('LoaderScene');

      // Start game loop
      this.app.ticker.add(this.gameLoop.bind(this));

      console.log('Application initialized successfully');
      this.eventManager.emit(GameEvent.GAME_STARTED);
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw error;
    }
  }

  private async onChangeScene(sceneName: string): Promise<void> {
    try {
      await this.sceneManager.changeScene(sceneName);
      console.log(`Changed to scene: ${sceneName}`);
    } catch (error) {
      console.error(`Failed to change scene to ${sceneName}:`, error);
    }
  }

  private gameLoop(delta: number): void {
    // Update TweenJS
    TWEEN.update();

    // Update current scene
    const currentScene = this.sceneManager.getCurrentScene();
    if (currentScene?.update) {
      currentScene.update(delta);
    }

    // Update performance metrics and debug overlay only in development mode
    if (isDevelopment && this.performanceMonitor && this.debugOverlay) {
      this.performanceMonitor.update();
      this.debugOverlay.updateMetrics({
        fps: this.performanceMonitor.getFPS(),
        memory: this.performanceMonitor.getMemoryUsage(),
        scene: currentScene?.name || 'None',
        drawCalls: (this.app.renderer as any).drawCalls || 0,
      });
    }
  }

  private onResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.app.renderer.resize(width, height);
    this.sceneManager.onResize(width, height);
  }

  private onGamePaused(): void {
    this.app.ticker.stop();
    console.log('Game paused');
  }

  private onGameResumed(): void {
    this.app.ticker.start();
    console.log('Game resumed');
  }

  private onSceneChanged(sceneName: string): void {
    console.log(`Scene changed to: ${sceneName}`);
  }

  private onDebugToggle(): void {
    this.debugOverlay?.toggleVisibility();
  }

  public getRenderer() {
    return this.app.renderer;
  }

  public getStage(): Container {
    return this.app.stage;
  }

  public destroy(): void {
    console.log('Destroying application...');

    // Stop game loop
    this.app.ticker.stop();

    // Remove event listeners
    window.removeEventListener('resize', this.onResize.bind(this));

    // Destroy managers
    this.sceneManager.destroy();
    this.loadingManager.destroy();
    this.inputManager.destroy();
    if (this.performanceMonitor) {
      this.performanceMonitor.destroy();
    }
    if (this.debugOverlay) {
      this.debugOverlay.destroy();
    }
    this.eventManager.destroy();
    this.configManager.destroy();

    // Destroy PIXI application
    this.app.destroy(true, { children: true, texture: true, baseTexture: true });
  }
}

// Create and export a singleton instance
export const app = App.getInstance();
