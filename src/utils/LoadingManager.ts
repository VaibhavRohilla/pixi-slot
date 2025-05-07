import { Assets } from 'pixi.js';
import { EventManager, GameEvent } from './EventManager';

interface Asset {
  url: string;
  options?: any;
  type: 'image' | 'audio' | 'json' | 'spritesheet';
}

export interface AssetManifest {
  [key: string]: {
    url: string;
    type: 'image' | 'audio' | 'json' | 'spritesheet';
    options?: any;
  };
}

export class LoadingManager {
  private static instance: LoadingManager;
  private manifest: AssetManifest = {};
  private loadedAssets: Map<string, any> = new Map();
  private loadingProgress: number = 0;
  private isLoading: boolean = false;
  private eventManager: EventManager;

  private constructor() {
    this.eventManager = EventManager.getInstance();
  }

  public static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager();
    }
    return LoadingManager.instance;
  }

  public setManifest(manifest: AssetManifest): void {
    this.manifest = manifest;
  }

  public async loadAssets(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.loadingProgress = 0;
    this.loadedAssets.clear();

    try {
      for (const [key, asset] of Object.entries(this.manifest)) {
        try {
          const loadedAsset = await this.loadAsset(asset);
          this.loadedAssets.set(key, loadedAsset);
          this.loadingProgress = this.loadedAssets.size / Object.keys(this.manifest).length;
          this.eventManager.emit(GameEvent.ASSET_LOADED, { key, progress: this.loadingProgress });
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private async loadAsset(asset: Asset): Promise<any> {
    switch (asset.type) {
      case 'image':
        return await Assets.load(asset.url);
      case 'audio':
        return new Promise((resolve, reject) => {
          const audio = new Audio(asset.url);
          audio.oncanplaythrough = () => resolve(audio);
          audio.onerror = reject;
          audio.load();
        });
      case 'json':
        const response = await fetch(asset.url);
        return await response.json();
      case 'spritesheet':
        return await Assets.load(asset.url);
      default:
        throw new Error(`Unsupported asset type: ${asset.type}`);
    }
  }

  public getAsset<T>(key: string): T | undefined {
    return this.loadedAssets.get(key) as T;
  }

  public getLoadingProgress(): number {
    return this.loadingProgress;
  }

  public isAssetLoaded(key: string): boolean {
    return this.loadedAssets.has(key);
  }

  public unloadAsset(key: string): void {
    if (this.loadedAssets.has(key)) {
      this.loadedAssets.delete(key);
    }
  }

  public unloadAllAssets(): void {
    this.loadedAssets.clear();
  }

  public destroy(): void {
    this.unloadAllAssets();
    (LoadingManager as any).instance = null;
  }
}
