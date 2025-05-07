import { Application } from 'pixi.js';
import { EventManager, GameEvent } from './EventManager';
import { ConfigManager } from './ConfigManager';

interface ScreenOrientationWithLock extends ScreenOrientation {
  lock(orientation: 'portrait' | 'landscape'): Promise<void>;
  unlock(): void;
}

export class MobileManager {
  private static instance: MobileManager;
  private isMobile: boolean = false;
  private isLandscape: boolean = false;
  private isFullscreen: boolean = false;
  private isOrientationLocked: boolean = false;
  private eventManager: EventManager;

  private constructor() {
    this.eventManager = EventManager.getInstance();
    this.detectMobileCapabilities();
    this.setupEventListeners();
  }

  public static getInstance(): MobileManager {
    if (!MobileManager.instance) {
      MobileManager.instance = new MobileManager();
    }
    return MobileManager.instance;
  }

  private detectMobileCapabilities(): void {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    this.isLandscape = window.innerWidth > window.innerHeight;
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
  }

  private handleResize(): void {
    this.isLandscape = window.innerWidth > window.innerHeight;
    this.eventManager.emit(GameEvent.RESIZE, {
      width: window.innerWidth,
      height: window.innerHeight,
      isLandscape: this.isLandscape
    });
  }

  private handleOrientationChange(): void {
    this.isLandscape = window.innerWidth > window.innerHeight;
    this.eventManager.emit(GameEvent.ORIENTATION_CHANGED, { isLandscape: this.isLandscape });
  }

  public async enterFullscreen(): Promise<void> {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      }
      this.isFullscreen = true;
      this.eventManager.emit(GameEvent.FULLSCREEN_CHANGED, { isFullscreen: true });
    } catch (error) {
      throw error;
    }
  }

  public async exitFullscreen(): Promise<void> {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      }
      this.isFullscreen = false;
      this.eventManager.emit(GameEvent.FULLSCREEN_CHANGED, { isFullscreen: false });
    } catch (error) {
      throw error;
    }
  }

  public async lockOrientation(orientation: 'portrait' | 'landscape'): Promise<void> {
    try {
      const screenOrientation = screen.orientation as ScreenOrientationWithLock;
      if (screenOrientation && screenOrientation.lock) {
        await screenOrientation.lock(orientation);
        this.isOrientationLocked = true;
        this.eventManager.emit(GameEvent.ORIENTATION_CHANGED, { isLocked: true, orientation });
      }
    } catch (error) {
      throw error;
    }
  }

  public async unlockOrientation(): Promise<void> {
    try {
      const screenOrientation = screen.orientation as ScreenOrientationWithLock;
      if (screenOrientation && screenOrientation.unlock) {
        await screenOrientation.unlock();
        this.isOrientationLocked = false;
        this.eventManager.emit(GameEvent.ORIENTATION_CHANGED, { isLocked: false });
      }
    } catch (error) {
      throw error;
    }
  }

  public destroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
    window.removeEventListener('orientationchange', this.handleOrientationChange.bind(this));
    (MobileManager as any).instance = null;
  }
}
