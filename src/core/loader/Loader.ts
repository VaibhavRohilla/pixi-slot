import { Globals } from "@/core/Global";
import { Spritesheet, Assets, Texture } from "pixi.js";
import { manifest } from "../config/LoaderConfig";
import { bundleConfigs } from "../config/loaderGeneratorConfig";
import { Howl } from 'howler';


type ProgressCallback = (progress: number) => void;

interface AssetData {
    frames: { [key: string]: any };
    meta: any;
}

interface LoadedAsset {
    src: string;
    data?: AssetData;
}

export class Loader {
    private static instance: Loader;
    private spriteSheets: Map<string, Spritesheet> = new Map();
    private loadedBundles: Set<string> = new Set();

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
            console.log('Initializing assets...');
            await Assets.init({ manifest });
            console.log('Assets initialization complete');
        } catch (error) {
            console.error('Error initializing assets:', error);
            throw error;
        }
    }

    public async loadAllBundles(onProgress?: ProgressCallback): Promise<void> {
        const totalBundles = bundleConfigs.length;
        let loadedBundles = 0;

        for (const bundle of bundleConfigs) {
            try {
                await this.load(bundle.name, (progress) => {
                    if (onProgress) {
                        // Calculate overall progress including previously loaded bundles
                        const overallProgress = (loadedBundles + progress) / totalBundles;
                        onProgress(overallProgress);
                    }
                });
                loadedBundles++;
            } catch (error) {
                console.error(`Error loading bundle ${bundle.name}:`, error);
                throw error;
            }
        }
    }

    public async load(bundleName: string, onProgress?: ProgressCallback): Promise<any> {
        if (!Globals.app) {
            throw new Error('Application not initialized');
        }

        if (this.loadedBundles.has(bundleName)) {
            console.log(`Bundle ${bundleName} already loaded, skipping...`);
            return;
        }

        try {
            console.log(`Starting to load bundle: ${bundleName}`);
            
            // Handle audio bundle separately
            if (bundleName === 'audio') {
                const bundle = manifest.bundles.find(b => b.name === 'audio');
                if (!bundle) {
                    throw new Error('Audio bundle not found in manifest');
                }

                let loadedCount = 0;
                const totalAssets = bundle.assets.length;

                for (const asset of bundle.assets) {
                    const sound = new Howl({
                        src: [asset.src],
                        preload: true,
                        onload: () => {
                            loadedCount++;
                            const progress = loadedCount / totalAssets;
                            if (onProgress) {
                                onProgress(progress);
                            }
                            Globals.app?.stage.emit('loadingProgress', progress);

                            if (progress === 1) {
                                Globals.app?.stage.emit('loadingComplete');
                            }
                        }
                    });
                    Globals.soundResources[asset.alias] = sound;
                    console.log(`Loaded audio file: ${asset.alias}`);
                }
                
                this.loadedBundles.add(bundleName);
                return bundle;
            }

            // Handle other bundles with PixiJS Assets
            const bundle = await Assets.loadBundle(bundleName, (progress) => {
                console.log(`Loading progress for ${bundleName}: ${(progress * 100).toFixed(2)}%`);
                if (onProgress) {
                    onProgress(progress);
                }
                Globals.app?.stage.emit('loadingProgress', progress);

                if (progress === 1) {
                    Globals.app?.stage.emit('loadingComplete');
                }
            });
            
            console.log(`Bundle ${bundleName} loaded successfully`);
            
            if (bundle && typeof bundle === 'object') {
                for (const [key, asset] of Object.entries(bundle)) {
                    const loadedAsset = asset as LoadedAsset;
                    if (loadedAsset.data?.frames) {
                        const texture = Texture.from(loadedAsset.src);
                        const spritesheet = new Spritesheet(texture, loadedAsset.data);
                        await spritesheet.parse();
                        this.spriteSheets.set(key, spritesheet);
                        Globals.resources[key] = spritesheet;
                    } else {
                        Globals.resources[key] = asset;
                    }
                    console.log(`Stored asset "${key}" in Globals.resources`);
                }
                this.loadedBundles.add(bundleName);
            } else {
                console.warn(`Bundle ${bundleName} is empty or invalid`);
            }
            
            return bundle;
        } catch (error) {
            console.error(`Error loading bundle ${bundleName}:`, error);
            throw error;
        }
    }

    public async unload(bundleName: string): Promise<void> {
        try {
            console.log(`Unloading bundle: ${bundleName}`);
            // Unload assets
            await Assets.unloadBundle(bundleName);
            const bundleAssets = manifest.bundles.find(b => b.name === bundleName)?.assets || [];
            
            // Clean up sprite sheets and resources
            for (const [key, spritesheet] of this.spriteSheets.entries()) {
                if (key.startsWith(bundleName)) {
                    spritesheet.destroy(true);
                    this.spriteSheets.delete(key);
                }
            }
            
            for (const asset of bundleAssets) {
                delete Globals.resources[asset.alias];
                console.log(`Removed asset "${asset.alias}" from Globals.resources`);
            }
            
            console.log(`Bundle ${bundleName} unloaded successfully`);
        } catch (error) {
            console.error(`Error unloading bundle ${bundleName}:`, error);
            throw error;
        }
    }

    public async backgroundLoad(bundleName: string): Promise<void> {
        try {
            console.log(`Starting background load for bundle: ${bundleName}`);
            await Assets.backgroundLoadBundle(bundleName);
            console.log(`Background loading complete for bundle: ${bundleName}`);
        } catch (error) {
            console.error(`Error background loading bundle ${bundleName}:`, error);
            throw error;
        }
    }

    public getAsset(key: string): any {
        return Assets.get(key);
    }

    public getSpriteSheet(key: string): Spritesheet | undefined {
        return this.spriteSheets.get(key);
    }

    public getSpriteFrame(spriteSheetKey: string, frameName: string): Texture | undefined {
        const spritesheet = this.spriteSheets.get(spriteSheetKey);
        return spritesheet?.textures[frameName];
    }
}

export const loader = Loader.getInstance();
