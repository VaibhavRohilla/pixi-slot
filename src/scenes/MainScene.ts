import { Text } from 'pixi.js';
import { Scene } from '../core/Scene';
import { EventManager } from '../utils/EventManager';
import { TextUtil } from '../utils/TextUtil';
import { log } from 'node:console';
import { Globals } from '@/Global';

export class MainScene extends Scene {
  private eventManager: EventManager;
  private text!: Text;

  constructor() {
    super('MainScene');
    this.eventManager = EventManager.getInstance();
    this.setup();
    console.log(Globals.soundResources,Globals.resources);
    
  }

  private setup(): void {
    this.text = TextUtil.createText('Main Scene', window.innerWidth / 2, window.innerHeight / 2, 32, 0xffffff, 0.5);
    this.addChild(this.text);

  }

  public init(): void {
    // Initialize main scene
  }

  protected onUpdate(delta: number): void {
    // Update main scene logic
  }

  public onResize(): void {
    this.text.position.set(window.innerWidth / 2, window.innerHeight / 2);
  }

  public destroy(): void {
    super.destroy();
  }
}
