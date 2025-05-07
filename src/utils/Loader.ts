import { Assets } from 'pixi.js';
import { Howl } from 'howler';
import { global } from '../Global';

interface AssetManifest {
  [key: string]: {
    name: string;
    url: string;
    type: string;
  }[];
}

export class Loader {
  private static instance: Loader;
  private manifest: AssetManifest;
  private totalAssets: number = 0;
  private loadedAssets: number = 0;

  private constructor() {
    this.manifest = {
      images: [],
      sounds: [],
      spritesheets: [],
      fonts: [],
    };
  }

  public static getInstance(): Loader {
    if (!Loader.instance) {
      Loader.instance = new Loader();
    }
    return Loader.instance;
  }

  public async load(manifest: AssetManifest): Promise<void> {
    if (!global.app) {
      throw new Error('Application not initialized');
    }

    this.manifest = manifest;
    this.totalAssets = this.calculateTotalAssets();
    this.loadedAssets = 0;

    try {
      await this.loadImages();
      await this.loadSpritesheets();
      await this.loadSounds();
      await this.loadFonts();
    } catch (error) {
      console.error('Error loading assets:', error);
      throw error;
    }
  }

  private calculateTotalAssets(): number {
    return Object.values(this.manifest).reduce((total, assets) => total + assets.length, 0);
  }

  private async loadImages(): Promise<void> {
    const imageAssets = this.manifest.images.map(asset => ({
      alias: asset.name,
      src: asset.url,
    }));

    if (imageAssets.length > 0) {
      await Assets.load(imageAssets, this.onProgress.bind(this));
    }
  }

  private async loadSpritesheets(): Promise<void> {
    const spritesheetAssets = this.manifest.spritesheets.map(asset => ({
      alias: asset.name,
      src: asset.url,
    }));

    if (spritesheetAssets.length > 0) {
      await Assets.load(spritesheetAssets, this.onProgress.bind(this));
    }
  }

  private async loadSounds(): Promise<void> {
    const soundPromises = this.manifest.sounds.map(asset => {
      return new Promise<void>((resolve, reject) => {
        const sound = new Howl({
          src: [asset.url],
          onload: () => {
            global.sound[asset.name] = sound;
            this.loadedAssets++;
            this.onProgress();
            resolve();
          },
          onloaderror: (id, error) => {
            reject(error);
          },
        });
      });
    });

    await Promise.all(soundPromises);
  }

  private async loadFonts(): Promise<void> {
    // Implement font loading logic here if needed
    // This is a placeholder for future font loading implementation
    this.loadedAssets += this.manifest.fonts.length;
    this.onProgress();
  }

  private onProgress(): void {
    if (!global.app) {
      console.error('Application not initialized during asset loading');
      return;
    }

    const progress = this.loadedAssets / this.totalAssets;
    global.app.stage.emit('loadingProgress', progress);

    if (progress === 1) {
      global.app.stage.emit('loadingComplete');
    }
  }

  public getProgress(): number {
    return this.loadedAssets / this.totalAssets;
  }
}

export const loader = Loader.getInstance();
