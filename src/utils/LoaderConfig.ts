import { Assets } from 'pixi.js';
import { Globals } from '../Global';
import { Howl } from 'howler';

type ProgressCallback = (progress: number) => void;

export const manifest = {
    "bundles": [
        {
            "name": "game",
            "assets": [
                {
                    "alias": "game-autospinpanel",
                    "src": "/assets/images/game/autospinPanel.png"
                },
                {
                    "alias": "game-backgroundanim",
                    "src": "/assets/images/game/backgroundAnim.png",
                    "data": "/assets/data/backgroundAnim.json"
                },
                {
                    "alias": "game-backgroundanimation",
                    "src": "/assets/images/game/backgroundAnimation.png",
                    "data": "/assets/data/backgroundAnimation.json"
                },
                {
                    "alias": "game-backlight",
                    "src": "/assets/images/game/backLight.png",
                    "data": "/assets/data/backLight.json"
                },
                {
                    "alias": "game-coin",
                    "src": "/assets/images/game/coin.png",
                    "data": "/assets/data/coin.json"
                },
                {
                    "alias": "game-freespins",
                    "src": "/assets/images/game/freeSpins.png",
                    "data": "/assets/data/freeSpins.json"
                },
                {
                    "alias": "game-freespinsintrocards",
                    "src": "/assets/images/game/freeSpinsIntroCards.png",
                    "data": "/assets/data/freeSpinsIntroCards.json"
                },
                {
                    "alias": "game-freespinsnumber",
                    "src": "/assets/images/game/freeSpinsNumber.png",
                    "data": "/assets/data/freeSpinsNumber.json"
                },
                {
                    "alias": "game-freespinstitleanim",
                    "src": "/assets/images/game/freeSpinsTitleAnim.png",
                    "data": "/assets/data/freeSpinsTitleAnim.json"
                },
                {
                    "alias": "game-jackpoint-portrait",
                    "src": "/assets/images/game/jackPoint-portrait.png",
                    "data": "/assets/data/jackPoint-portrait.json"
                },
                {
                    "alias": "game-jackpoint",
                    "src": "/assets/images/game/jackPoint.png",
                    "data": "/assets/data/jackPoint.json"
                },
                {
                    "alias": "game-led-tile",
                    "src": "/assets/images/game/led-tile.png"
                },
                {
                    "alias": "game-lightforframe",
                    "src": "/assets/images/game/lightForFrame.png"
                },
                {
                    "alias": "game-lion",
                    "src": "/assets/images/game/lion.png",
                    "data": "/assets/data/lion.json"
                },
                {
                    "alias": "game-lionanim",
                    "src": "/assets/images/game/lionAnim.png",
                    "data": "/assets/data/lionAnim.json"
                },
                {
                    "alias": "game-loadingbar-off",
                    "src": "/assets/images/game/loadingbar-off.png"
                },
                {
                    "alias": "game-loadingbar-on",
                    "src": "/assets/images/game/loadingbar-on.png"
                },
                {
                    "alias": "game-logo-bg",
                    "src": "/assets/images/game/logo-bg.png"
                },
                {
                    "alias": "game-logo",
                    "src": "/assets/images/game/logo.png"
                },
                {
                    "alias": "game-logoanim",
                    "src": "/assets/images/game/logoAnim.png",
                    "data": "/assets/data/logoAnim.json"
                },
                {
                    "alias": "game-logopreload",
                    "src": "/assets/images/game/logoPreload.png"
                },
                {
                    "alias": "game-main-bg-portrait",
                    "src": "/assets/images/game/main-bg-portrait.png"
                },
                {
                    "alias": "game-main-bg",
                    "src": "/assets/images/game/main-bg.png"
                },
                {
                    "alias": "game-mainthick",
                    "src": "/assets/images/game/mainThick.png",
                    "data": "/assets/data/mainThick.fnt"
                },
                {
                    "alias": "game-mainthin",
                    "src": "/assets/images/game/mainThin.png",
                    "data": "/assets/data/mainThin.fnt"
                },
                {
                    "alias": "game-menubg",
                    "src": "/assets/images/game/menuBG.png"
                },
                {
                    "alias": "game-midwinanim",
                    "src": "/assets/images/game/midWinAnim.png",
                    "data": "/assets/data/midWinAnim.json"
                },
                {
                    "alias": "game-mist",
                    "src": "/assets/images/game/mist.png"
                },
                {
                    "alias": "game-music",
                    "src": "/assets/images/game/Music.png",
                    "data": "/assets/data/Music.json"
                },
                {
                    "alias": "game-nearwinframe",
                    "src": "/assets/images/game/nearWinFrame.png",
                    "data": "/assets/data/nearWinFrame.json"
                },
                {
                    "alias": "game-point",
                    "src": "/assets/images/game/point.png"
                },
                {
                    "alias": "game-pointred",
                    "src": "/assets/images/game/pointRed.png"
                },
                {
                    "alias": "game-pointyellow",
                    "src": "/assets/images/game/pointYellow.png"
                },
                {
                    "alias": "game-preload-bg-portrait",
                    "src": "/assets/images/game/preload-bg-portrait.png"
                },
                {
                    "alias": "game-preload-bg",
                    "src": "/assets/images/game/preload-bg.png"
                },
                {
                    "alias": "game-prize-table-bg",
                    "src": "/assets/images/game/prize-table-bg.png"
                },
                {
                    "alias": "game-prizefont",
                    "src": "/assets/images/game/prizeFont.png",
                    "data": "/assets/data/prizeFont.fnt"
                },
                {
                    "alias": "game-prizefontactive",
                    "src": "/assets/images/game/prizeFontActive.png",
                    "data": "/assets/data/prizeFontActive.fnt"
                },
                {
                    "alias": "game-reelbehind",
                    "src": "/assets/images/game/reelBehind.png"
                },
                {
                    "alias": "game-reelfront",
                    "src": "/assets/images/game/reelFront.png"
                },
                {
                    "alias": "game-reels-portrait",
                    "src": "/assets/images/game/reels-portrait.png"
                },
                {
                    "alias": "game-reels",
                    "src": "/assets/images/game/reels.png"
                },
                {
                    "alias": "game-sidepanelnums",
                    "src": "/assets/images/game/sidePanelNums.png",
                    "data": "/assets/data/sidePanelNums.json"
                },
                {
                    "alias": "game-statuspanel",
                    "src": "/assets/images/game/statusPanel.png",
                    "data": "/assets/data/statusPanel.json"
                },
                {
                    "alias": "game-symbolsdefault",
                    "src": "/assets/images/game/symbolsDefault.png",
                    "data": "/assets/data/symbolsDefault.json"
                },
                {
                    "alias": "game-table---nogcb",
                    "src": "/assets/images/game/Table - noGCB.png"
                },
                {
                    "alias": "game-totalfreespinswin",
                    "src": "/assets/images/game/totalFreespinsWin.png"
                },
                {
                    "alias": "game-uipanel",
                    "src": "/assets/images/game/uiPanel.png",
                    "data": "/assets/data/uiPanel.json"
                },
                {
                    "alias": "game-wheel",
                    "src": "/assets/images/game/wheel.png"
                },
                {
                    "alias": "game-wheelpointer",
                    "src": "/assets/images/game/wheelPointer.png"
                },
                {
                    "alias": "game-wheelrotatingpart",
                    "src": "/assets/images/game/wheelRotatingPart.png"
                },
                {
                    "alias": "game-winframeanim",
                    "src": "/assets/images/game/winFrameAnim.png",
                    "data": "/assets/data/winFrameAnim.json"
                },
                {
                    "alias": "game-winpopupfont",
                    "src": "/assets/images/game/winPopupFont.png",
                    "data": "/assets/data/winPopupFont.fnt"
                }
            ]
        },
        {
            "name": "winlines",
            "assets": [
                {
                    "alias": "winlines-winlines-0",
                    "src": "/assets/images/winlines/winlines-0.png"
                }
            ]
        },
        {
            "name": "symbols",
            "assets": [
                {
                    "alias": "symbols-symbols-0",
                    "src": "/assets/images/symbols/symbols-0.png"
                },
                {
                    "alias": "symbols-symbols-1",
                    "src": "/assets/images/symbols/symbols-1.png"
                }
            ]
        },
        {
            "name": "freeSpinsIntro",
            "assets": [
                {
                    "alias": "freespinsintro-freespinsintro-0",
                    "src": "/assets/images/freeSpinsIntro/freeSpinsIntro-0.png"
                },
                {
                    "alias": "freespinsintro-freespinsintro-1",
                    "src": "/assets/images/freeSpinsIntro/freeSpinsIntro-1.png"
                }
            ]
        },
        {
            "name": "audio",
            "assets": [
                {
                    "alias": "audio-buttonpressed",
                    "src": "/assets/audio/buttonPressed.mp3"
                },
                {
                    "alias": "audio-coinbigwin",
                    "src": "/assets/audio/coinbigwin.mp3"
                },
                {
                    "alias": "audio-coinlinewin",
                    "src": "/assets/audio/coinlinewin.mp3"
                },
                {
                    "alias": "audio-coinmegawin",
                    "src": "/assets/audio/coinmegawin.mp3"
                },
                {
                    "alias": "audio-coinmidwin",
                    "src": "/assets/audio/coinmidwin.mp3"
                },
                {
                    "alias": "audio-countuploop",
                    "src": "/assets/audio/CountUpLoop.mp3"
                },
                {
                    "alias": "audio-countupstop",
                    "src": "/assets/audio/CountUpStop.mp3"
                },
                {
                    "alias": "audio-endfs",
                    "src": "/assets/audio/EndFS.mp3"
                },
                {
                    "alias": "audio-freespins",
                    "src": "/assets/audio/freeSpins.mp3",
                    "data": "/assets/data/freeSpins.json"
                },
                {
                    "alias": "audio-jackpotwin",
                    "src": "/assets/audio/jackpotWin.mp3"
                },
                {
                    "alias": "audio-music",
                    "src": "/assets/audio/Music.mp3",
                    "data": "/assets/data/Music.json"
                },
                {
                    "alias": "audio-prolong",
                    "src": "/assets/audio/prolong.mp3"
                },
                {
                    "alias": "audio-reelrotation1",
                    "src": "/assets/audio/ReelRotation1.mp3"
                },
                {
                    "alias": "audio-reelstop1",
                    "src": "/assets/audio/ReelStop1.mp3"
                },
                {
                    "alias": "audio-reelstop2",
                    "src": "/assets/audio/ReelStop2.mp3"
                },
                {
                    "alias": "audio-reelstop3",
                    "src": "/assets/audio/ReelStop3.mp3"
                },
                {
                    "alias": "audio-reelstop4",
                    "src": "/assets/audio/ReelStop4.mp3"
                },
                {
                    "alias": "audio-reelstop5",
                    "src": "/assets/audio/ReelStop5.mp3"
                },
                {
                    "alias": "audio-reelstopfast",
                    "src": "/assets/audio/ReelStopFast.mp3"
                },
                {
                    "alias": "audio-win",
                    "src": "/assets/audio/win.mp3"
                },
                {
                    "alias": "audio-winhigher",
                    "src": "/assets/audio/winHigher.mp3"
                }
            ]
        }
    ]
};

export async function initAssets(): Promise<void> {
    console.log('Initializing assets...');
    try {
        // Initialize PixiJS assets
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
        if (bundleName === 'audio') {
            // Handle audio bundle separately using Howler.js
            const bundle = manifest.bundles.find(b => b.name === bundleName);
            if (!bundle) {
                throw new Error('Audio bundle not found in manifest');
            }

            const totalAssets = bundle.assets.length;
            let loadedAssets = 0;
            const audioAssets: { [key: string]: Howl } = {};

            for (const asset of bundle.assets) {
                const howl = new Howl({
                    src: [asset.src],
                    onload: () => {
                        loadedAssets++;
                        const progress = loadedAssets / totalAssets;
                        if (onProgress) {
                            onProgress(progress);
                        }
                        console.log(`Loading progress for ${bundleName}: ${(progress * 100).toFixed(2)}%`);
                    },
                    onloaderror: (id, error) => {
                        console.error(`Error loading audio asset ${asset.alias}:`, error);
                    }
                });

                audioAssets[asset.alias] = howl;
                Globals.soundResources[asset.alias] = howl;
                console.log(`Stored sound "${asset.alias}" in Globals.soundResources`);
            }

            return audioAssets;
        } else {
            // Handle other bundles with PixiJS Assets
        const bundle = await Assets.loadBundle(bundleName, (progress) => {
            console.log(`Loading progress for ${bundleName}: ${(progress * 100).toFixed(2)}%`);
            if (onProgress) {
                onProgress(progress);
            }
        });
        
        console.log(`Bundle ${bundleName} loaded successfully`);
        
        for (const [key, asset] of Object.entries(bundle)) {
                Globals.resources[key] = asset;
                console.log(`Stored asset "${key}" in Globals.resources`);
            }
            
            return bundle;
        }
    } catch (error) {
        console.error(`Error loading bundle ${bundleName}:`, error);
        throw error;
    }
}

export async function unloadBundle(bundleName: string): Promise<void> {
    console.log(`Unloading bundle: ${bundleName}`);
    try {
        if (bundleName === 'audio') {
            // Unload audio assets
        const bundleAssets = manifest.bundles.find(b => b.name === bundleName)?.assets || [];
        for (const asset of bundleAssets) {
                const howl = Globals.soundResources[asset.alias] as Howl;
                if (howl) {
                    howl.unload();
                delete Globals.soundResources[asset.alias];
                console.log(`Removed sound "${asset.alias}" from Globals.soundResources`);
                }
            }
            } else {
            // Unload other assets
            await Assets.unloadBundle(bundleName);
            const bundleAssets = manifest.bundles.find(b => b.name === bundleName)?.assets || [];
            for (const asset of bundleAssets) {
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
        if (bundleName === 'audio') {
            // Background loading for audio is handled by Howler.js automatically
            console.log('Audio bundle background loading is handled by Howler.js');
        } else {
        await Assets.backgroundLoadBundle(bundleName);
        }
        console.log(`Background loading complete for bundle: ${bundleName}`);
    } catch (error) {
        console.error(`Error background loading bundle ${bundleName}:`, error);
        throw error;
    }
}