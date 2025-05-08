import _forEach from 'lodash-es/forEach';
import ComponentLayer from '../ComponentLayer';
import Game from '../../Game';

let preloadComplete = false;
let clientConnected = false;

function allowStartIfPossible(scene: Phaser.Scene): void {
    console.log('allow start');
    if (preloadComplete && clientConnected) {
        scene.scene.launch('LoadingCompleteScene');
    }
}

export function setIntroScenesEvents(
    scene: Phaser.Scene,
    ignoreConnectionCondition = false
): void {
    scene.game.events.once(
        'event-loading-intro-loaded',
        () => {
            scene.scene.launch('PreloadScene');
        },
        scene
    );

    if (ignoreConnectionCondition) {
        clientConnected = true;
    }

    scene.game.events.once(
        'event-preload-complete',
        () => {
            preloadComplete = true;
            allowStartIfPossible(scene);
        },
        scene
    );

    scene.game.events.once(
        'event-init-msg-handled',
        () => {
            clientConnected = true;
            allowStartIfPossible(scene);
        },
        scene
    );

    scene.game.events.once(
        'event-loading-complete-scene-clicked',
        () => {
            console.log('ON event-loading-complete-scene-clicked');

            //let lastScene: string = scene.scene.key;
            _forEach(scene.scene.manager.scenes, (scene: Phaser.Scene) => {
                const key = scene.scene.key;
                console.log(key);

                if (
                    key === 'LoadingCompleteScene' ||
                    key === 'LoadingIntroScene' ||
                    key === 'PreloadScene'
                ) {
                    scene.scene.stop(key);
                } else if (
                    scene instanceof ComponentLayer &&
                    !scene.scene.manager.isActive(key)
                ) {
                    console.log('started', key);
                    scene.scene.start(key);
                    //lastScene = key;
                }
            });

            scene.game.events.once('event-background-init', () => {
                console.log('preload-complete');
                scene.game.events.emit('preload-complete');
                //console.log("AAaAAAAaAAAaAAAAAAAAA")
                //scene.scene.manager.bringToTop(scene.scene.key)
            });

            const gameSpecificCreate = (this.game as Game).gameSpecificCreate;
            gameSpecificCreate(this);
        },
        scene
    );
}
