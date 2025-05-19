import { Container, Text, TextStyle } from 'pixi.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { PerformanceMonitor } from '../core/utils/PerformanceMonitor';

interface DebugMetrics {
  fps: number;
  memory: number;
  scene: string;
  drawCalls: number;
}

export class DebugOverlay {
  private static instance: DebugOverlay;
  private container: Container;
  private isVisible: boolean = false;
  private eventManager: EventManager;
  private performanceMonitor: PerformanceMonitor;

  private constructor() {
    this.eventManager = EventManager.getInstance();
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.container = new Container();
    this.setupEventListeners();
  }

  public static getInstance(): DebugOverlay {
    if (!DebugOverlay.instance) {
      DebugOverlay.instance = new DebugOverlay();
    }
    return DebugOverlay.instance;
  }

  private setupEventListeners(): void {
    this.eventManager.on(GameEvent.DEBUG_TOGGLE, this.toggleVisibility.bind(this));
    this.eventManager.on(GameEvent.DEBUG_METRICS_UPDATE, this.updateMetrics.bind(this));
  }

  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    this.container.visible = this.isVisible;
  }

  public getContainer(): Container {
    return this.container;
  }

  public updateMetrics(metrics: any): void {
    if (!this.isVisible) return;
    // Update metrics display
  }

  public destroy(): void {
    this.eventManager.off(GameEvent.DEBUG_TOGGLE, this.toggleVisibility.bind(this));
    this.eventManager.off(GameEvent.DEBUG_METRICS_UPDATE, this.updateMetrics.bind(this));
    this.container.destroy();
    (DebugOverlay as any).instance = null;
  }
}
