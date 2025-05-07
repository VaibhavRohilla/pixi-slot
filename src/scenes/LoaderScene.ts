import { Scene } from '../core/Scene';
import { Container, Text, Graphics } from 'pixi.js';
import { appConfig } from '../utils/AppConfig';
import { EventManager, GameEvent } from '../utils/EventManager';

export class LoaderScene extends Scene {
  private loadingText!: Text;
  private progressBar!: Graphics;
  private progressBarContainer!: Container;
  private isInitialized: boolean = false;

  constructor() {
    super('LoaderScene');
  }

  public init(): void {
    this.setupLoadingUI();
    this.simulateLoading();
    this.isInitialized = true;
  }

  private setupLoadingUI(): void {
    // Create loading text
    this.loadingText = new Text('Loading...', {
      fontFamily: 'Arial',
      fontSize: appConfig.isPortrait() ? 24 : 36,
      fill: 0xffffff,
    });
    this.loadingText.anchor.set(0.5);

    // Create progress bar container
    this.progressBarContainer = new Container();
    const barWidth = appConfig.isPortrait() ? 200 : 300;
    const barHeight = appConfig.isPortrait() ? 20 : 30;

    // Create progress bar background
    const bg = new Graphics();
    bg.beginFill(0x333333);
    bg.drawRoundedRect(0, 0, barWidth, barHeight, 5);
    bg.endFill();

    // Create progress bar
    this.progressBar = new Graphics();
    this.progressBar.beginFill(0x00ff00);
    this.progressBar.drawRoundedRect(0, 0, 0, barHeight, 5);
    this.progressBar.endFill();

    this.progressBarContainer.addChild(bg);
    this.progressBarContainer.addChild(this.progressBar);

    // Position elements
    const centerPos = appConfig.getCenter();
    this.loadingText.position.set(centerPos.x, centerPos.y - 50);
    this.progressBarContainer.position.set(centerPos.x - barWidth / 2, centerPos.y + 20);

    this.gameContainer.addChild(this.loadingText);
    this.gameContainer.addChild(this.progressBarContainer);
  }

  private simulateLoading(): void {
    let progress = 0;
    const updateProgress = () => {
      progress += 0.1;
      if (progress <= 1) {
        this.updateProgressBar(progress);
        setTimeout(updateProgress, 100);
      } else {
        EventManager.getInstance().emit('loadingComplete');
      }
    };
    updateProgress();
  }

  private updateProgressBar(progress: number): void {
    if (!this.progressBar) return;
    
    const barWidth = appConfig.isPortrait() ? 200 : 300;
    this.progressBar.clear();
    this.progressBar.beginFill(0x00ff00);
    this.progressBar.drawRoundedRect(0, 0, barWidth * progress, this.progressBar.height, 5);
    this.progressBar.endFill();
  }

  protected onUpdate(delta: number): void {
    // No update logic needed for loader scene
  }

  protected onResize(): void {
    if (!this.isInitialized) return;

    // Update positions
    const centerPos = appConfig.getCenter();
    const barWidth = appConfig.isPortrait() ? 200 : 300;
    const barHeight = appConfig.isPortrait() ? 20 : 30;

    if (this.loadingText) {
      this.loadingText.position.set(centerPos.x, centerPos.y - 50);
      this.loadingText.style.fontSize = appConfig.isPortrait() ? 24 : 36;
    }

    if (this.progressBarContainer) {
      this.progressBarContainer.position.set(centerPos.x - barWidth / 2, centerPos.y + 20);
    }
  }

  public destroy(): void {
    this.isInitialized = false;
    super.destroy();
  }
}
