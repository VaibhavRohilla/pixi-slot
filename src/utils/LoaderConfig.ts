import { Assets } from 'pixi.js';
import { Globals } from '../Global';
import { Howl } from 'howler';

type ProgressCallback = (progress: number) => void;

export const manifest = {
    bundles: [
        {
            name: 'preload',
            assets: [
                {
                    alias: 'background',
                    src: '/assets/images/background.png',
                },
                {
                    alias: 'avatar',
                    src: '/assets/images/avatar.png',
                },
                {
                    alias: 'leaderboardbg',
                    src: '/assets/images/leaderboardbg.png',
                }
            ]
        },
        {
            name: 'ui',
            assets: [
                {
                    alias: 'ui-close-button',
                    src: '/assets/images/ui/close_button.png',
                },
                {
                    alias: 'ui-leaderboard',
                    src: '/assets/images/ui/leaderboard.png',
                },
                {
                    alias: 'ui-shop-button',
                    src: '/assets/images/ui/shopbutton.png',
                },
                {
                    alias: 'ui-cancel-button',
                    src: '/assets/images/ui/cancelbutton.png',
                }
            ]
        },
        {
            name: 'table',
            assets: [
                {
                    alias: 'table-background',
                    src: '/assets/images/table/table.png',
                },
                {
                    alias: 'table-text',
                    src: '/assets/images/table/table_text.png',
                },
                {
                    alias: 'table-chips-zone',
                    src: '/assets/images/table/chips_zone.png',
                }
            ]
        },
        {
            name: 'popups',
            assets: [
                {
                    alias: 'popup-banner',
                    src: '/assets/images/popups/banner.png',
                },
                {
                    alias: 'popup-blackjack',
                    src: '/assets/images/popups/blackjackpopup.png',
                },
                {
                    alias: 'popup-burst',
                    src: '/assets/images/popups/burstpopup.png',
                },
                {
                    alias: 'popup-lose',
                    src: '/assets/images/popups/loosepopup.png',
                },
                {
                    alias: 'popup-push',
                    src: '/assets/images/popups/pushpopup.png',
                },
                {
                    alias: 'popup-surrender',
                    src: '/assets/images/popups/surrenderpopup.png',
                },
                {
                    alias: 'popup-won',
                    src: '/assets/images/popups/wonpopup.png',
                }
            ]
        },
        {
            name: 'buttons',
            assets: [
                {
                    alias: 'button-hit',
                    src: '/assets/images/ui/hit.png',
                },
                {
                    alias: 'button-stand',
                    src: '/assets/images/ui/stand.png',
                },
                {
                    alias: 'button-double',
                    src: '/assets/images/ui/playon.png',
                },
                {
                    alias: 'button-surrender',
                    src: '/assets/images/ui/surrender.png',
                },
                {
                    alias: 'button-rebet',
                    src: '/assets/images/ui/rebet.png',
                },
                {
                    alias: 'button-clear',
                    src: '/assets/images/ui/clear.png',
                }
            ]
        }
    ]
};

export async function initAssets(): Promise<void> {
    console.log('Initializing assets...');
    try {
        await Assets.init({ manifest });
        console.log('Assets initialization complete');
    } catch (error) {
        console.error('Error initializing assets:', error);
        throw error;
    }
}

export async function loadBundle(bundleName: string, onProgress?: ProgressCallback): Promise<any> {
    console.log(`Starting to load bundle: ${bundleName}`);
    try {
        const bundle = await Assets.loadBundle(bundleName, (progress) => {
            console.log(`Loading progress for ${bundleName}: ${(progress * 100).toFixed(2)}%`);
            if (onProgress) {
                onProgress(progress);
            }
        });
        
        // Store assets in appropriate resource objects
        console.log(`Bundle ${bundleName} loaded successfully`);
        
        for (const [key, asset] of Object.entries(bundle)) {
            // Check if the asset is from the sounds bundle
            if (bundleName === 'sounds') {
                Globals.soundResources[key] = asset as Howl;
                console.log(`Stored sound "${key}" in Globals.soundResources`);
            } else {
                Globals.resources[key] = asset;
                console.log(`Stored asset "${key}" in Globals.resources`);
            }
        }
        
        return bundle;
    } catch (error) {
        console.error(`Error loading bundle ${bundleName}:`, error);
        throw error;
    }
}

export async function unloadBundle(bundleName: string): Promise<void> {
    console.log(`Unloading bundle: ${bundleName}`);
    try {
        await Assets.unloadBundle(bundleName);
        
        // Remove assets from appropriate resource objects
        const bundleAssets = manifest.bundles.find(b => b.name === bundleName)?.assets || [];
        for (const asset of bundleAssets) {
            if (bundleName === 'sounds') {
                delete Globals.soundResources[asset.alias];
                console.log(`Removed sound "${asset.alias}" from Globals.soundResources`);
            } else {
                delete Globals.resources[asset.alias];
                console.log(`Removed asset "${asset.alias}" from Globals.resources`);
            }
        }
        
        console.log(`Bundle ${bundleName} unloaded successfully`);
    } catch (error) {
        console.error(`Error unloading bundle ${bundleName}:`, error);
        throw error;
    }
}

export async function backgroundLoadBundle(bundleName: string): Promise<void> {
    console.log(`Starting background load for bundle: ${bundleName}`);
    try {
        await Assets.backgroundLoadBundle(bundleName);
        console.log(`Background loading complete for bundle: ${bundleName}`);
    } catch (error) {
        console.error(`Error background loading bundle ${bundleName}:`, error);
        throw error;
    }
}
