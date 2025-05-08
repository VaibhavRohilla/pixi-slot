/**
 * CSS
 */
import '@clientframework/common/htmlOverlays/css/main.css';
import '@clientframework/common/htmlOverlays/css/infoPageSymbols.css';
import 'nprogress/nprogress.css';
import '../css/style.css';

/**
 * Polyfills
 */
import '@commonEngine/polyfills/ScreenOrientation';

/**
 * Engine
 */
import 'phaser';
import * as ClientFramework from '@slotsEngine/index';
import Boot from '@commonEngine/Scenes/Boot';
import DeviceManager from '@commonEngine/Scenes/DeviceManager';
import Background from '@commonEngine/Scenes/Background';
import Preload from '@commonEngine//Scenes/Preload';
import BackgroundAnimations from './scenes/BackgroundAnimations';
//import Reels from '@slotsEngine/scenes/Reels';
import WinLines from '@slotsEngine/scenes/WinLines';
//import Buttons from '@slotsEngine/scenes/Buttons';
//import StatusPanel from '@slotsEngine/scenes/StatusPanel';
import WinAnimations from '@slotsEngine/scenes/WinAnimations';
import Overlays from '@slotsEngine/scenes/Overlays';
// import LoadingIntroScene from '@commonEngine/Scenes/testScenes/loadingIntroScene';
// import PreloadScene from '@commonEngine/Scenes/testScenes/preloadScene';
//import LoadingCompleteScene from '@commonEngine/Scenes/testScenes/loadingCompleteScene';

//import StateMachineLayer from '@commonEngine/stateMachine/stateMachineLayer';
import StateMachineLayerSlot from '@slotsEngine/gameFlow/stateMachineLayerSlot';
import { gameSpecificCreate } from './gameSpecificCreate';
import BackgroundSettings from '../../@clientframework/slots/engine/src/ts/scenes/BackgroundSettings';
import ReelsSpecific from './scenes/ReelsSpecific';
import { SYMBOLS_FPS } from './config';
import { PreloadSpecific } from '@specific/scenes/PreloadSpecific';
//import StatusPanel from '@clientframework/slots/engine/src/ts/scenes/StatusPanel';
import PreBoot from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/Scenes/PreBoot';
import BackgroundSpecificSettings from './scenes/BackgroundSpecificSettings';

let pressToStartImg;
let pressToStartUrl;
if (navigator.userAgent.includes('Mobile')) {
    pressToStartImg = require('ASSETS_DIR_COMMON/tapToStart.png');
    pressToStartUrl = require('ASSETS_DIR_COMMON/tapToStart.json');
} else {
    pressToStartImg = require('ASSETS_DIR_COMMON/clickToStart.png');
    pressToStartUrl = require('ASSETS_DIR_COMMON/clickToStart.json');
}

let musicUrl;
if (navigator.vendor.includes('Apple')) {
    musicUrl = require('../assets/audio/Music.mp3');
} else {
    musicUrl = require('../assets/audio/Music.ogg');
}

new ClientFramework.Game(
    {
        scene: [
            PreBoot,
            Boot,
            DeviceManager,
            Background,
            BackgroundAnimations,
            PreloadSpecific,

            // LoadingIntroScene,
            // DeviceManager,
            // Background,
            // PreloadScene,
            // LoadingCompleteScene,

            
            //Reels,
            ReelsSpecific,
            //Buttons,
            //StatusPanel,
            WinLines,
            BackgroundSpecificSettings,
            Overlays,
            StateMachineLayerSlot,
            WinAnimations,
        ],
    },
    {
        boot: {
            image: [
                {
                    key: 'preload-bg',
                    url: require('../assets/images/preload-bg.png'),
                },
                {
                    key: 'preload-bg-portrait',
                    url: require('../assets/images/preload-bg-portrait.png'),
                },
                {
                    key: 'loadingbar-on',
                    url: require('../assets/images/loadingbar-on.png'),
                },
                {
                    key: 'loadingbar-off',
                    url: require('../assets/images/loadingbar-off.png'),
                },
                {
                    key: 'logo-preload',
                    url: require('../assets/images/logoPreload.png'),
                },
            ],
            atlas: [
                {
                    key: 'backLight',
                    textureURL: require('../assets/images/backLight.png'),
                    atlasURL: require('../assets/data/backLight.json'),
                },
                {
                    key: 'backgroundAnim',
                    textureURL: require('../assets/images/backgroundAnimation.png'),
                    atlasURL: require('../assets/data/backgroundAnimation.json'),
                },
            ],
        },
        preload: {
            image: [
                {
                    key: 'bg',
                    url: require('../assets/images/main-bg.png'),
                },
                {
                    key: 'bg-portrait',
                    url: require('../assets/images/main-bg-portrait.png'),
                },
                {
                    key: 'menu-bg',
                    url: require('../assets/images/menuBG.png'),
                },
                {
                    key: 'autospinPanel',
                    url: require('../assets/images/autospinPanel.png'),
                },
                {
                    key: 'logo',
                    url: require('../assets/images/logo.png'),
                },
                {
                    key: 'logo-bg',
                    url: require('../assets/images/logo-bg.png'),
                },
                {
                    key: 'reels',
                    url: require('../assets/images/reels.png'),
                },
                {
                    key: 'reels-portrait',
                    url: require('../assets/images/reels-portrait.png'),
                },
                {
                    key: 'prize-table-bg',
                    url: require('../assets/images/prize-table-bg.png'),
                },
                {
                    key: 'blackField',
                    url: require('ASSETS_DIR_COMMON/blackField.png'),
                },
                {
                    key: 'gamePopup',
                    url: require('ASSETS_DIR_COMMON/popup.png'),
                },
                {
                    key: 'totalFreespinsWin',
                    url: require('../assets/images/totalFreespinsWin.png'),
                },
                {
                    key: 'lightsForFrame',
                    url: require('../assets/images/lightForFrame.png'),
                },
                {
                    key: 'freeSpinsIntroTable',
                    url: require('../assets/images/Table - noGCB.png'),
                },
                {
                    key: 'reelBehind',
                    url: require('../assets/images/reelBehind.png'),
                },
                {
                    key: 'reelFront',
                    url: require('../assets/images/reelFront.png'),
                },
                {
                    key: 'wheel',
                    url: require('../assets/images/wheel.png'),
                },
                {
                    key: 'wheelPointer',
                    url: require('../assets/images/wheelPointer.png'),
                },
                {
                    key: 'wheelRotatingPart',
                    url: require('../assets/images/wheelRotatingPart.png'),
                },
                {
                    key: 'mist',
                    url: require('../assets/images/mist.png'),
                },
                {
                    key: 'point',
                    url: require('../assets/images/point.png'),
                },
                {
                    key: 'pointRed',
                    url: require('../assets/images/pointRed.png'),
                },
                {
                    key: 'pointYellow',
                    url: require('../assets/images/pointYellow.png'),
                },
            ],
            multiatlas: [
                SYMBOLS_FPS > 0
                    ? {
                          key: 'symbols',
                          path: (<any>require).context(
                              '../assets/images/symbols/'
                          ),
                          atlasURL: require('../assets/data/symbols.json'),
                      }
                    : null,
                {
                    key: 'winlines',
                    path: (<any>require).context('../assets/images/winlines/'),
                    atlasURL: require('../assets/data/winlines.json'),
                },
                {
                    key: 'freeSpinsIntro',
                    path: (<any>require).context(
                        '../assets/images/freeSpinsIntro/'
                    ),
                    atlasURL: require('../assets/data/freeSpinsIntro.json'),
                },
            ],
            atlas: [
                // {
                //     key: 'winLineSegment',
                //     textureURL: require('../assets/images/winLineSegment.png'),
                //     atlasURL: require('../assets/data/winLineSegment.json')
                // },
                // {
                //     key: 'lightsForFrame',
                //     textureURL: require('../assets/images/lightsForFrame.png'),
                //     atlasURL: require('../assets/data/lightsForFrame.json')
                // },
                {
                    key: 'coin',
                    textureURL: require('../assets/images/coin.png'),
                    atlasURL: require('../assets/data/coin.json'),
                },
                {
                    key: 'statusPanel',
                    textureURL: require('../assets/images/statusPanel.png'),
                    atlasURL: require('../assets/data/statusPanel.json'),
                },
                // {// for win popup animation
                //     key: 'win',
                //     textureURL: require('../assets/images/win.png'),
                //     atlasURL: require('../assets/data/win.json')
                // },
                {
                    key: 'fsNum',
                    textureURL: require('../assets/images/freeSpinsNumber.png'),
                    atlasURL: require('../assets/data/freeSpinsNumber.json'),
                },
                {
                    key: 'freeSpins',
                    textureURL: require('../assets/images/freeSpins.png'),
                    atlasURL: require('../assets/data/freeSpins.json'),
                },
                {
                    key: 'pressToStart',
                    textureURL: pressToStartImg,
                    atlasURL: pressToStartUrl,
                },
                {
                    key: 'sidePanelNums',
                    textureURL: require('../assets/images/sidePanelNums.png'),
                    atlasURL: require('../assets/data/sidePanelNums.json'),
                },
                {
                    key: 'lion',
                    textureURL: require('../assets/images/lion.png'),
                    atlasURL: require('../assets/data/lion.json'),
                },
                {
                    key: 'lionAnim',
                    textureURL: require('../assets/images/lionAnim.png'),
                    atlasURL: require('../assets/data/lionAnim.json'),
                },
                {
                    key: 'jackPoint',
                    textureURL: require('../assets/images/jackPoint.png'),
                    atlasURL: require('../assets/data/jackPoint.json'),
                },
                {
                    key: 'jackPoint-portrait',
                    textureURL: require('../assets/images/jackPoint-portrait.png'),
                    atlasURL: require('../assets/data/jackPoint-portrait.json'),
                },
                {
                    key: 'symbolsDefault',
                    textureURL: require('../assets/images/symbolsDefault.png'),
                    atlasURL: require('../assets/data/symbolsDefault.json'),
                },
                {
                    key: 'nearWinFrame',
                    textureURL: require('../assets/images/nearWinFrame.png'),
                    atlasURL: require('../assets/data/nearWinFrame.json'),
                },
                {
                    key: 'freeSpinsIntroCards',
                    textureURL: require('../assets/images/freeSpinsIntroCards.png'),
                    atlasURL: require('../assets/data/freeSpinsIntroCards.json'),
                },
                {
                    key: 'midWinAnim',
                    textureURL: require('../assets/images/midWinAnim.png'),
                    atlasURL: require('../assets/data/midWinAnim.json'),
                },
                {
                    key: 'freeSpinsTitleAnim',
                    textureURL: require('../assets/images/freeSpinsTitleAnim.png'),
                    atlasURL: require('../assets/data/freeSpinsTitleAnim.json'),
                },
                {
                    key: 'winFrameAnim',
                    textureURL: require('../assets/images/winFrameAnim.png'),
                    atlasURL: require('../assets/data/winFrameAnim.json'),
                },
                {
                    key: 'logoAnim',
                    textureURL: require('../assets/images/logoAnim.png'),
                    atlasURL: require('../assets/data/logoAnim.json'),
                },
                {
                    key: 'historyButtons',
                    textureURL: require('ASSETS_DIR_COMMON/historyButtons.png'),
                    atlasURL: require('ASSETS_DIR_COMMON/historyButtons.json'),
                },
                {
                    key: 'uiPanel',
                    textureURL: require('../assets/images/uiPanel.png'),
                    atlasURL: require('../assets/data/uiPanel.json'),
                },
                {
                    key: 'musicButton',
                    textureURL: require('../assets/images/Music.png'),
                    atlasURL: require('../assets/data/Music.json'),
                },
            ],
            bitmapFont: [
                {
                    key: 'winPopupFont',
                    textureURL: require('../assets/images/winPopupFont.png'),
                    atlasURL: require('../assets/data/winPopupFont.fnt'),
                },
                {
                    key: 'prizeFont',
                    textureURL: require('../assets/images/prizeFont.png'),
                    atlasURL: require('../assets/data/prizeFont.fnt'),
                },
                {
                    key: 'prizeFontActive',
                    textureURL: require('../assets/images/prizeFontActive.png'),
                    atlasURL: require('../assets/data/prizeFontActive.fnt'),
                },
                {
                    key: 'mainThick',
                    textureURL: require('../assets/images/mainThick.png'),
                    atlasURL: require('../assets/data/mainThick.fnt'),
                },
                {
                    key: 'mainThin',
                    textureURL: require('../assets/images/mainThin.png'),
                    atlasURL: require('../assets/data/mainThin.fnt'),
                },
            ],
            audio: [
                {
                    key: 'music',
                    url: musicUrl,
                },
                {
                    key: 'reelSpin1',
                    url: require('../assets/audio/ReelRotation1.mp3'),
                },
                {
                    key: 'reelStop1',
                    url: require('../assets/audio/ReelStop1.mp3'),
                },
                {
                    key: 'reelStop2',
                    url: require('../assets/audio/ReelStop2.mp3'),
                },
                {
                    key: 'reelStop3',
                    url: require('../assets/audio/ReelStop3.mp3'),
                },
                {
                    key: 'reelStop4',
                    url: require('../assets/audio/ReelStop4.mp3'),
                },
                {
                    key: 'reelStop5',
                    url: require('../assets/audio/ReelStop5.mp3'),
                },
                {
                    key: 'reelStopFast',
                    url: require('../assets/audio/ReelStopFast.mp3'),
                },
                {
                    key: 'prolong',
                    url: require('../assets/audio/prolong.mp3'),
                },
                {
                    key: 'buttonPressed',
                    url: require('../assets/audio/buttonPressed.mp3'),
                },
                {
                    key: 'CountUpStop',
                    url: require('../assets/audio/CountUpStop.mp3'),
                },
                {
                    key: 'CountUpLoop',
                    url: require('../assets/audio/CountUpLoop.mp3'),
                },
                {
                    key: 'win',
                    url: require('../assets/audio/win.mp3'),
                },
                {
                    key: 'winHigher',
                    url: require('../assets/audio/winHigher.mp3'),
                },
                {
                    key: 'jackpotWin',
                    url: require('../assets/audio/jackpotWin.mp3'),
                },
                {
                    key: 'freeSpins',
                    url: require('../assets/audio/freeSpins.mp3'),
                },
                {
                    key: 'endFS',
                    url: require('../assets/audio/EndFS.mp3'),
                },
                {
                    key: 'coinlinewin',
                    url: require('../assets/audio/coinlinewin.mp3'),
                },
                {
                    key: 'coinmidwin',
                    url: require('../assets/audio/coinmidwin.mp3'),
                },
                {
                    key: 'coinbigwin',
                    url: require('../assets/audio/coinbigwin.mp3'),
                },
                {
                    key: 'coinmegawin',
                    url: require('../assets/audio/coinmegawin.mp3'),
                },
            ],
        },
    },
    gameSpecificCreate
);

// TODO explore using Scene config files payload
// https://github.com/photonstorm/phaser3-examples/blob/master/public/src/loader/scene%20payload/scene%20files%20payload.js
