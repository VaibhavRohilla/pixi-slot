import { TextUtil } from '../utils/TextUtil';
import { Scene } from '../core/Scene';
import { EventManager } from '../utils/EventManager';

export class MainScene extends Scene {
  private eventManager: EventManager;
    text: any;

  constructor() {
    super('MainScene');
    this.eventManager = EventManager.getInstance();
  }

  public init(): void {
    this.text = TextUtil.createText('Hello World', window.innerWidth / 2,  window.innerHeight / 2, 30, 0xffffff,0.5);
    this.addChild(this.text);
    // Scene initialization
  }

  protected onUpdate(delta: number): void {
    // Scene update logic
  }

  protected onResize(): void {
    this.text.position.x = window.innerWidth / 2;
    this.text.position.y = window.innerHeight / 2;
    // Handle resize if needed
  }

  public destroy(): void {
    super.destroy();
  }
}
