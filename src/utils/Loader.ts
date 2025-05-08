import { Assets } from 'pixi.js';
import { Howl } from 'howler';
import { Globals } from '../Global';
import { initAssets, loadBundle, unloadBundle, backgroundLoadBundle } from './LoaderConfig';

type ProgressCallback = (progress: number) => void;

export class Loader {
    private static instance: Loader;

    private constructor() {}

    public static getInstance(): Loader {
        if (!Loader.instance) {
            Loader.instance = new Loader();
        }
        return Loader.instance;
    }

    public async init(): Promise<void> {
        if (!Globals.app) {
            throw new Error('Application not initialized');
        }

        try {
            await initAssets();
        } catch (error) {
            console.error('Error initializing assets:', error);
            throw error;
        }
    }

    public async load(bundleName: string, onProgress?: ProgressCallback): Promise<any> {
        if (!Globals.app) {
            throw new Error('Application not initialized');
        }

        try {
            const assets = await loadBundle(bundleName, (progress: number) => {
                if (onProgress) {
                    onProgress(progress);
                }
                Globals.app?.stage.emit('loadingProgress', progress);

                if (progress === 1) {
                    Globals.app?.stage.emit('loadingComplete');
                }
            });

            return assets;
        } catch (error) {
            console.error(`Error loading bundle ${bundleName}:`, error);
            throw error;
        }
    }

    public async unload(bundleName: string): Promise<void> {
        try {
            await unloadBundle(bundleName);
        } catch (error) {
            console.error(`Error unloading bundle ${bundleName}:`, error);
            throw error;
        }
    }

    public async backgroundLoad(bundleName: string): Promise<void> {
        try {
            await backgroundLoadBundle(bundleName);
        } catch (error) {
            console.error(`Error background loading bundle ${bundleName}:`, error);
            throw error;
        }
    }

    public getAsset(key: string): any {
        return Assets.get(key);
    }
}

export const loader = Loader.getInstance();
