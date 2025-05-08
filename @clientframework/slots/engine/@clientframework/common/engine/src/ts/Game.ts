import Boot from './Scenes/Boot';
import Background from './Scenes/Background';
import Preload from './Scenes/Preload';
import PreloadConfig from './Types/PreloadConfig';
import { CHEAT_TOOL } from '@specific/dataConfig';
//import { getAndroidUsesWebGL } from '@clientframework/slots/engine/src/ts/dataPresenter/defaultConfigSlot';

export default class Game extends Phaser.Game {
    preloadConfig: PreloadConfig;
    gameSpecificCreate: (scene: Phaser.Scene) => void;

    constructor(
        config?: Phaser.Types.Core.GameConfig,
        preloadConfig?: PreloadConfig,
        gameSpecificCreate?: (scene: Phaser.Scene) => void
    ) {
        let scale;
        // temporary fix for pixelisation issue. old system only left on iphone
        // if (navigator.userAgent.includes('iPhone')) {
        //     scale = {
        //         parent: 'game-container',
        //         mode: Phaser.Scale.RESIZE,
        //         width: '100%',
        //         height: '100%',
        //         expandParent: true,
        //         fullscreenTarget: 'game-container',
        //     };
        // } else {
        scale = {
            parent: 'game-container',
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1920,
            height: 1080,
            expandParent: true,
            fullscreenTarget: 'game-container',
        };
        // }

        Object.assign(config, {
            dom: {
                createContainer: true,
            },
            /*plugins: {
                scene: [
                    { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
                ]
            }*/
        });

        if (CHEAT_TOOL) {
            document.createElement('button');
        }

        let RENDERER_TYPE = Phaser.AUTO;

        // if (!getAndroidUsesWebGL() && !iOS()) {
        //     console.log('Phaser.CANVAS')
        //     RENDERER_TYPE = Phaser.CANVAS;
        // }
        RENDERER_TYPE = Phaser.WEBGL

        // const contextCreationConfig = {
        //     stencil: true,
        //     alhpa: false,
        //     depth: true,
        //     antialiasGL: false,
        //     clearBeforeRender: false,
        //     premutatedAlpha: false,
        //     preserveDrawingBuffer: false,
        //     powerPreference: 'default',
        //     failIfMajorPerformanceCaveat: false,
        // };

        //  const gameCanvas = document.createElement('canvas');
        // const gameContext = gameCanvas.getContext('webgl', contextCreationConfig);

        config = Phaser.Utils.Objects.Merge(config, {
            type: RENDERER_TYPE,
            scale,
            render: {
                antialiasGL: false,
                clearBeforeRender: false,
            },
            fps: {
                target: 30,
            },
            scene: [Boot, Background, Preload],

        } as Phaser.Types.Core.GameConfig);

        super(config);

        this.preloadConfig = preloadConfig;
        this.gameSpecificCreate = gameSpecificCreate;
    }

}
function iOS() {
    return navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad');
};
