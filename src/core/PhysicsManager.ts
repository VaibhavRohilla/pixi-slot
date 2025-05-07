import { Engine, World, Bodies, Body } from 'matter-js';
import { EventManager, GameEvent } from '../utils/EventManager';

export class PhysicsManager {
  private static instance: PhysicsManager;
  private engine: Engine;
  private eventManager: EventManager;

  private constructor() {
    this.engine = Engine.create();
    this.eventManager = EventManager.getInstance();
    this.setupEventListeners();
  }

  public static getInstance(): PhysicsManager {
    if (!PhysicsManager.instance) {
      PhysicsManager.instance = new PhysicsManager();
    }
    return PhysicsManager.instance;
  }

  private setupEventListeners(): void {
    this.eventManager.on(GameEvent.GAME_PAUSED, this.pause.bind(this));
    this.eventManager.on(GameEvent.GAME_RESUMED, this.resume.bind(this));
  }

  public update(delta: number): void {
    Engine.update(this.engine, delta * 1000);
  }

  public createBody(options: any): Body {
    return Bodies.rectangle(
      options.x || 0,
      options.y || 0,
      options.width || 10,
      options.height || 10,
      options
    );
  }

  public addBody(body: Body): void {
    World.add(this.engine.world, body);
  }

  public removeBody(body: Body): void {
    World.remove(this.engine.world, body);
  }

  private pause(): void {
    this.engine.enabled = false;
  }

  private resume(): void {
    this.engine.enabled = true;
  }

  public destroy(): void {
    this.eventManager.off(GameEvent.GAME_PAUSED, this.pause.bind(this));
    this.eventManager.off(GameEvent.GAME_RESUMED, this.resume.bind(this));
    World.clear(this.engine.world, false);
    Engine.clear(this.engine);
    (PhysicsManager as any).instance = null;
  }
}

// Create and export a singleton instance
export const physicsManager = PhysicsManager.getInstance();
