import { Container } from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';

export interface TransitionOptions {
  duration?: number;
  easing?: (k: number) => number;
  onComplete?: () => void;
}

export class SceneTransitionManager {
  private static instance: SceneTransitionManager;
  private currentTransition: TWEEN.Tween<any> | null = null;
  private isTransitioning: boolean = false;

  private constructor() {}

  public static getInstance(): SceneTransitionManager {
    if (!SceneTransitionManager.instance) {
      SceneTransitionManager.instance = new SceneTransitionManager();
    }
    return SceneTransitionManager.instance;
  }

  public async fadeOut(scene: Container, options: TransitionOptions = {}): Promise<void> {
    const { duration = 500, easing = TWEEN.Easing.Quadratic.InOut, onComplete } = options;

    return new Promise<void>(resolve => {
      this.currentTransition = new TWEEN.Tween(scene)
        .to({ alpha: 0 }, duration)
        .easing(easing)
        .onComplete(() => {
          if (onComplete) onComplete();
          resolve();
        })
        .start();
    });
  }

  public async fadeIn(scene: Container, options: TransitionOptions = {}): Promise<void> {
    const { duration = 500, easing = TWEEN.Easing.Quadratic.InOut, onComplete } = options;

    scene.alpha = 0;
    return new Promise<void>(resolve => {
      this.currentTransition = new TWEEN.Tween(scene)
        .to({ alpha: 1 }, duration)
        .easing(easing)
        .onComplete(() => {
          if (onComplete) onComplete();
          resolve();
        })
        .start();
    });
  }

  public async slideOut(
    scene: Container,
    direction: 'left' | 'right' | 'up' | 'down',
    options: TransitionOptions = {}
  ): Promise<void> {
    const { duration = 500, easing = TWEEN.Easing.Quadratic.InOut, onComplete } = options;
    const distance = 100;
    let x = 0;
    let y = 0;

    switch (direction) {
      case 'left':
        x = -distance;
        break;
      case 'right':
        x = distance;
        break;
      case 'up':
        y = -distance;
        break;
      case 'down':
        y = distance;
        break;
    }

    return new Promise<void>(resolve => {
      this.currentTransition = new TWEEN.Tween(scene)
        .to({ x, y, alpha: 0 }, duration)
        .easing(easing)
        .onComplete(() => {
          if (onComplete) onComplete();
          resolve();
        })
        .start();
    });
  }

  public async slideIn(
    scene: Container,
    direction: 'left' | 'right' | 'up' | 'down',
    options: TransitionOptions = {}
  ): Promise<void> {
    const { duration = 500, easing = TWEEN.Easing.Quadratic.InOut, onComplete } = options;
    const distance = 100;
    let x = 0;
    let y = 0;

    switch (direction) {
      case 'left':
        x = -distance;
        break;
      case 'right':
        x = distance;
        break;
      case 'up':
        y = -distance;
        break;
      case 'down':
        y = distance;
        break;
    }

    scene.x = x;
    scene.y = y;
    scene.alpha = 0;

    return new Promise<void>(resolve => {
      this.currentTransition = new TWEEN.Tween(scene)
        .to({ x: 0, y: 0, alpha: 1 }, duration)
        .easing(easing)
        .onComplete(() => {
          if (onComplete) onComplete();
          resolve();
        })
        .start();
    });
  }

  public async crossFade(
    oldScene: Container,
    newScene: Container,
    options: TransitionOptions = {}
  ): Promise<void> {
    const { duration = 500, easing = TWEEN.Easing.Quadratic.InOut, onComplete } = options;

    newScene.alpha = 0;

    return new Promise<void>(resolve => {
      const oldTween = new TWEEN.Tween(oldScene).to({ alpha: 0 }, duration).easing(easing);

      const newTween = new TWEEN.Tween(newScene)
        .to({ alpha: 1 }, duration)
        .easing(easing)
        .onComplete(() => {
          if (onComplete) onComplete();
          resolve();
        });

      oldTween.chain(newTween);
      this.currentTransition = oldTween;
      oldTween.start();
    });
  }

  public stopCurrentTransition(): void {
    if (this.currentTransition) {
      this.currentTransition.stop();
      this.currentTransition = null;
    }
  }

  public isInTransition(): boolean {
    return this.isTransitioning;
  }

  public update(): void {
    TWEEN.update();
  }
}
