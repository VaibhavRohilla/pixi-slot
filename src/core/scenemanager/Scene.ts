import { Container, Text, DisplayObject } from 'pixi.js';
import { EventEmitter } from 'events';
import { appConfig } from '../config/AppConfig';

export abstract class Scene extends Container {
  protected events: EventEmitter;
  public name: string;
  protected gameContainer: Container;
  protected fpsText!: Text;
  private lastTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;
  protected isActive: boolean = false;
  protected resizeHandler: (() => void) | null = null;

  constructor(name: string) {
    super();
    this.name = name;
    this.events = new EventEmitter();
    this.gameContainer = new Container();
    this.addChild(this.gameContainer);
    this.setupFPSDisplay();
    this.setupResizeHandler();
  }

  private setupResizeHandler(): void {
    this.resizeHandler = () => {
      if (this.isActive) {
        this.updateContainerScale();
      }
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  private updateContainerScale(): void {
    const scale = appConfig.getScale();
    this.gameContainer.scale.set(scale);

    // Center the container
    const centerX = appConfig.getCenter().x;
    const centerY = appConfig.getCenter().y;
    this.gameContainer.position.set(centerX, centerY);
    this.gameContainer.pivot.set(centerX, centerY);
  }

  protected setupFPSDisplay(): void {
    this.fpsText = new Text('FPS: 0', {
      fontFamily: 'Arial',
      fontSize: appConfig.isPortrait() ? 12 : 16,
      fill: 0xffffff,
    });
    this.fpsText.anchor.set(0, 0);
    const topLeftPos = appConfig.getPosition('topLeft', { x: 20, y: 20 });
    this.fpsText.position.set(topLeftPos.x, topLeftPos.y);
    this.addChild(this.fpsText);
  }

  public abstract init(): void;

  public update(delta: number): void {
    // Calculate FPS
    this.frameCount++;
    const currentTime = performance.now();
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.fpsText.text = `FPS: ${this.fps}`;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    // Call child update
    this.onUpdate(delta);
  }

  protected abstract onUpdate(delta: number): void;

  public resize(): void {
    // Update FPS text position
    const topLeftPos = appConfig.getPosition('topLeft', { x: 20, y: 20 });
    this.fpsText.position.set(topLeftPos.x, topLeftPos.y);
    this.fpsText.style.fontSize = appConfig.isPortrait() ? 12 : 16;

    // Update container scale
    this.updateContainerScale();

    // Call child resize
    this.onResize();
  }

  public abstract onResize(): void;

  public show(): void {
    this.visible = true;
    this.alpha = 0;
    this.isActive = true;
    this.updateContainerScale();
  }

  public hide(): void {
    this.visible = false;
    this.isActive = false;
  }

  public destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean }): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    this.isActive = false;
    this.events.removeAllListeners();
    super.destroy(options);
  }

  public addChild<T extends DisplayObject>(...children: T[]): T {
    return super.addChild(...children);
  }

  public removeChild<T extends DisplayObject>(...children: T[]): T {
    return super.removeChild(...children);
  }
}
