import { EventManager, GameEvent } from './EventManager';

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  drawCalls: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private eventManager: EventManager;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private fps: number = 0;
  private frameTime: number = 1000 / 60;
  private drawCalls: number = 0;
  private isRunning: boolean = false;
  private targetFPS: number = 60;
  private lastFrameTime: number = 0;
  private frameTimeHistory: number[] = [];
  private readonly HISTORY_SIZE: number = 60;

  private constructor() {
    this.eventManager = EventManager.getInstance();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.frameTimeHistory = [];
    requestAnimationFrame(this.update.bind(this));
  }

  public stop(): void {
    this.isRunning = false;
  }

  public update(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.frameCount++;

    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Emit metrics update event
      this.eventManager.emit(GameEvent.DEBUG_METRICS_UPDATE, {
        fps: this.fps,
        memory: this.getMemoryUsage(),
      });
    }
  }

  public getFPS(): number {
    return this.fps;
  }

  public getMemoryUsage(): number {
    const perf = performance as PerformanceWithMemory;
    return perf.memory?.usedJSHeapSize || 0;
  }

  public setTargetFPS(fps: number): void {
    this.targetFPS = Math.max(1, Math.min(120, fps));
    this.frameTime = 1000 / this.targetFPS;
  }

  public destroy(): void {
    this.stop();
    (PerformanceMonitor as any).instance = null;
  }

  public getMetrics(): PerformanceMetrics {
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      memoryUsage: this.getMemoryUsage(),
      drawCalls: this.drawCalls,
    };
  }

  private updateDrawCalls(count: number): void {
    this.drawCalls = count;
  }

  private reset(): void {
    this.frameCount = 0;
    this.fps = 0;
    this.frameTime = 1000 / 60;
    this.drawCalls = 0;
    this.lastTime = performance.now();
    this.lastFrameTime = this.lastTime;
  }
}
