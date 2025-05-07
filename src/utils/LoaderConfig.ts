import { Assets } from 'pixi.js';

export interface AssetConfig {
  name: string;
  url: string;
  type: 'image' | 'audio' | 'json';
}

export const assets: AssetConfig[] = [
  // Test assets
  { name: 'testImage', url: 'assets/images/test.svg', type: 'image' },
];

export class LoaderConfig {
  private static instance: LoaderConfig;
  private loadedAssets: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): LoaderConfig {
    if (!LoaderConfig.instance) {
      LoaderConfig.instance = new LoaderConfig();
    }
    return LoaderConfig.instance;
  }

  public async loadAssets(): Promise<void> {
    try {
      // Load all assets
      for (const asset of assets) {
        await Assets.load(asset.url);
        this.loadedAssets.set(asset.name, Assets.get(asset.url));
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      throw error;
    }
  }

  public getAsset(name: string): { path: string; type: string } {
    const asset = assets.find(a => a.name === name);
    if (asset) {
      return { path: asset.url, type: asset.type };
    }
    throw new Error(`Asset ${name} not found`);
  }

  public getAllAssets(): Map<string, any> {
    return this.loadedAssets;
  }

  public addAsset(name: string, path: string, type: string): void {
    // Implementation needed
  }

  public getAssetsByType(type: string): { path: string; type: string }[] {
    // Implementation needed
    return [];
  }
}

export const loaderConfig = LoaderConfig.getInstance();
