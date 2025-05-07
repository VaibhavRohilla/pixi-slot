import { Scene } from '../core/Scene';
import { Sprite } from 'pixi.js';
import { global } from '../Global';
import { appConfig } from '../utils/AppConfig';

export class FishScene extends Scene {
  private fish!: Sprite;
  private time: number = 0;
  private readonly baseFishScale: number = 0.5;

  constructor() {
    super('FishScene');
  }

  public init(): void {
    this.setupFish();
  }

  private setupFish(): void {
    // Create fish sprite
    this.fish = Sprite.from('https://pixijs.com/assets/tutorials/fish-pond/fish1.png');

    // Set initial position at center of the base dimensions
    const baseCenter = {
      x: appConfig.getBaseDimensions().width / 2,
      y: appConfig.getBaseDimensions().height / 2,
    };

    this.fish.anchor.set(0.5);
    this.fish.position.set(baseCenter.x, baseCenter.y);

    // Set base scale
    this.fish.scale.set(this.baseFishScale);

    this.gameContainer.addChild(this.fish);
  }

  protected onUpdate(delta: number): void {
    if (!this.isActive) return;

    // Update time
    this.time += delta * 0.01;

    // Update fish position
    if (this.fish) {
      const baseCenter = {
        x: appConfig.getBaseDimensions().width / 2,
        y: appConfig.getBaseDimensions().height / 2,
      };

      const isPortrait = appConfig.isPortrait();

      // Adjust movement parameters based on orientation
      const amplitude = isPortrait ? 50 : 100;
      const frequency = isPortrait ? 1.5 : 2;
      const horizontalSpeed = isPortrait ? 1.5 : 2;

      // Calculate movement bounds based on base dimensions
      const maxHorizontalMovement = baseCenter.x * (isPortrait ? 0.4 : 0.8);

      // Calculate new position using sine and cosine
      const x = baseCenter.x + Math.cos(this.time * horizontalSpeed) * maxHorizontalMovement;
      const y = baseCenter.y + Math.sin(this.time * frequency) * amplitude;

      this.fish.position.set(x, y);

      // Flip fish based on direction
      this.fish.scale.x =
        Math.cos(this.time * horizontalSpeed) > 0
          ? Math.abs(this.fish.scale.x)
          : -Math.abs(this.fish.scale.x);
    }
  }

  protected onResize(): void {
    // No need to update fish scale or position as the container handles scaling
  }

  public destroy(): void {
    // Clear all children
    this.gameContainer.removeChildren();

    // Clear references
    this.fish = null!;

    super.destroy();
  }
}
