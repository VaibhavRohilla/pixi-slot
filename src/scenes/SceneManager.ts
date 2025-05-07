import { Container } from 'pixi.js';
import { EventManager, GameEvent } from '../utils/EventManager';
import { SceneTransitionManager } from '../utils/SceneTransitionManager';

export interface Scene {
  name: string;
  container: Container;
  init?(): Promise<void>;
  update?(delta: number): void;
  onResize?(width: number, height: number): void;
  destroy?(): void;
}

export class SceneManager {
  private static instance: SceneManager;
  private scenes: Map<string, Scene> = new Map();
  private currentScene: Scene | null = null;
  private stage!: Container;
  private eventManager: EventManager;
  private transitionManager: SceneTransitionManager;

  private constructor() {
    this.eventManager = EventManager.getInstance();
    this.transitionManager = SceneTransitionManager.getInstance();
  }

  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  public async init(stage: Container): Promise<void> {
    this.stage = stage;
    console.log('Scene manager initialized');
  }

  public addScene(scene: Scene): void {
    if (this.scenes.has(scene.name)) {
      console.warn(`Scene ${scene.name} already exists, overwriting`);
    }
    this.scenes.set(scene.name, scene);
    console.debug(`Scene ${scene.name} added`);
  }

  public async changeScene(sceneName: string): Promise<void> {
    const newScene = this.scenes.get(sceneName);
    if (!newScene) {
      console.error(`Scene ${sceneName} not found`);
      return;
    }

    try {
      // Initialize new scene if needed
      if (newScene.init) {
        await newScene.init();
      }

      // Add new scene to stage
      this.stage.addChild(newScene.container);

      // Perform transition
      if (this.currentScene) {
        // Cross fade between scenes
        await this.transitionManager.crossFade(
          this.currentScene.container,
          newScene.container,
          {
            duration: 500,
            onComplete: () => {
              // Clean up old scene
              this.cleanupScene(this.currentScene!);
            }
          }
        );
      } else {
        // First scene, just make it visible
        newScene.container.alpha = 1;
      }

      this.currentScene = newScene;
      console.log(`Changed to scene: ${sceneName}`);
      this.eventManager.emit(GameEvent.SCENE_CHANGED, sceneName);
    } catch (error) {
      console.error(`Failed to change scene to ${sceneName}:`, error);
      throw error;
    }
  }

  private cleanupScene(scene: Scene): void {
    // Remove from stage
    if (scene.container.parent) {
      scene.container.parent.removeChild(scene.container);
    }

    // Call destroy method if it exists
    if (scene.destroy) {
      scene.destroy();
    }

    // Remove from scenes map
    this.scenes.delete(scene.name);
    console.log(`Scene ${scene.name} cleaned up`);
  }

  public getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  public getScene(sceneName: string): Scene | undefined {
    return this.scenes.get(sceneName);
  }

  public onResize(width: number, height: number): void {
    this.scenes.forEach(scene => {
      if (scene.onResize) {
        scene.onResize(width, height);
      }
    });
  }

  public destroy(): void {
    // Clean up all scenes
    this.scenes.forEach(scene => {
      this.cleanupScene(scene);
    });
    
    this.scenes.clear();
    this.currentScene = null;
    (SceneManager as any).instance = null;
    console.log('Scene manager destroyed');
  }
}
