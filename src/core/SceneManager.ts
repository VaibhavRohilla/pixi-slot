import { Application, Container } from 'pixi.js';
import { Scene } from './Scene';
import { PhysicsManager } from './PhysicsManager';
import { MobileManager } from '../utils/MobileManager';
import { EventManager, GameEvent } from '../utils/EventManager';

export class SceneManager {
  private static instance: SceneManager;
  private stage: Container;
  private scenes: Map<string, Scene> = new Map();
  private currentScene: Scene | null = null;
  private physicsManager: PhysicsManager | null;
  private mobileManager: MobileManager;
  private usePhysics: boolean;
  private eventManager: EventManager;

  private constructor() {
    this.stage = null as any;
    this.usePhysics = false;
    this.eventManager = EventManager.getInstance();
    this.mobileManager = MobileManager.getInstance();
    this.physicsManager = null;
  }

  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  public init(stage: Container): void {
    this.stage = stage;
  }

  public addScene(scene: Scene): void {
    if (this.scenes.has(scene.name)) {
      // Remove logger.warn
    }
    this.scenes.set(scene.name, scene);
    this.stage.addChild(scene);
    scene.visible = false;
  }

  public removeScene(sceneName: string): void {
    const scene = this.scenes.get(sceneName);
    if (scene) {
      this.stage.removeChild(scene);
      this.scenes.delete(sceneName);
    }
  }

  public async changeScene(sceneName: string): Promise<void> {
    const scene = this.scenes.get(sceneName);
    if (!scene) {
      throw new Error(`Scene ${sceneName} not found`);
    }

    try {
      if (this.currentScene) {
        await this.currentScene.destroy();
      }
      this.currentScene = scene;
      await this.currentScene.init();
      this.eventManager.emit(GameEvent.SCENE_CHANGED, { scene: sceneName });
    } catch (error) {
      throw error;
    }
  }

  public getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  public getScene(sceneName: string): Scene | undefined {
    return this.scenes.get(sceneName);
  }

  public update(delta: number): void {
    if (this.currentScene) {
      this.currentScene.update(delta);
      if (this.usePhysics && this.physicsManager) {
        this.physicsManager.update(delta);
      }
    }
  }

  public onResize(width: number, height: number): void {
    this.scenes.forEach(scene => {
      scene.resize();
    });
  }

  public destroy(): void {
    if (this.physicsManager) {
      this.physicsManager.destroy();
    }
    this.mobileManager.destroy();
    this.scenes.forEach(scene => {
      scene.destroy();
    });
    this.scenes.clear();
    this.currentScene = null;
    (SceneManager as any).instance = null;
  }
}
