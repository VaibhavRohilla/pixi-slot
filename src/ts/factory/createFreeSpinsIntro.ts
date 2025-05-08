import { PopupAnimation } from '@clientframework/slots/engine/src/ts/game-objects/PopupAnimation';
import BackgroundSettings from '@clientframework/slots/engine/src/ts/scenes/BackgroundSettings';
import { BorderLights } from '@specific/gameObjects/borderLights/borderLights';
import { BONUS_POPUP_DURATION, configBorderLights } from '@specific/config';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';
import { TextPopup } from '@clientframework/slots/engine/src/ts/game-objects/textPopup';
import { getGameLanguage } from '@clientframework/common/backend-service/src/client-remote-data/src/launchParams/gameLanguage';
import { IReelCoordinatesData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iReelCoordinatesData';

let scene: Phaser.Scene;

export function createFreeSpinsIntro(scene_: Phaser.Scene): void {

    const freeSpinsTriggerAmounts = [
        {
            freeSpins: 30,
            multiplier: 3,
        },
        {
            freeSpins: 10,
            multiplier: 2,
        },
        {
            freeSpins: 25,
            multiplier: 3,
        },
        {
            freeSpins: 12,
            multiplier: 2,
        },
        {
            freeSpins: 20,
            multiplier: 2,
        },
        {
            freeSpins: 10,
            multiplier: 2,
        },
        {
            freeSpins: 15,
            multiplier: 2,
        },
        {
            freeSpins: 20,
            multiplier: 2,
        },
        {
            freeSpins: 10,
            multiplier: 2,
        },
        {
            freeSpins: 12,
            multiplier: 2,
        },
    ];

    let freeSpinsTriggerindex = 0;

    const getFreeSpinsTriggerindex = (
        triggeredFreeSpinsNumber: number
    ): number => {
        for (let safeIndex = 0; safeIndex < 1000; safeIndex++) {
            const freeSpinsRnd = Math.floor(
                Math.random() * freeSpinsTriggerAmounts.length
            );
            const triggeredData = freeSpinsTriggerAmounts[freeSpinsRnd];
            console.log(triggeredData.freeSpins, triggeredFreeSpinsNumber);
            if (triggeredData.freeSpins == triggeredFreeSpinsNumber) {
                return freeSpinsRnd;
            }
        }
    };

    scene = scene_;

    const cardAngle = 6;

    const wheel = new PopupAnimation(scene, 'wheel', 'wheel', 0, null, 1);
    //wheel.setFrame("Table - noGCB");
    const wheelRotatingPart = new PopupAnimation(
        scene,
        'wheelRotatingPart',
        'wheelRotatingPart',
        0,
        null,
        1
    );
    //wheelRotatingPart.setDelayAfterAnim(0);
    const wheelPointer = new PopupAnimation(
        scene,
        'wheelPointer',
        'wheelPointer',
        0,
        null,
        1
    );

    const freeSpinsTitleAnim = new TextPopup(
        scene,
        'freeSpinsTitleAnim',
        0,
        0,
        true,
        null,
        'mainThick'
    );
    if (getGameLanguage() === 'sv') {
        freeSpinsTitleAnim.setText('GRATISSNURR');
    } else {
        freeSpinsTitleAnim.setText(' FREE\nSPINS');
    }

    const winningCard = new PopupAnimation(
        scene,
        'winningCard',
        'freeSpinsIntroCards',
        0,
        null,
        1.5
    );
    winningCard.setFrame('10');
    winningCard.setIsScalingUp(false);
    winningCard.sprite.angle = cardAngle;

    const winningCardBorder = new BorderLights(
        scene,
        configBorderLights,
        'winningCardBorder',
        false
    );
    winningCardBorder.attachReferentObject(winningCard.sprite, 10, 0, 15, 0);

    const multiplierText = 'Multiplier'.toLocaleUpperCase();
    let freeSpinsText;
    if (getGameLanguage() === 'sv') {
        freeSpinsText = 'GRATISSNURR';
    } else {
        freeSpinsText = 'Free Spins'.toUpperCase();
    }
    const fsWinTextPopup = new TextPopup(
        scene,
        'fsWinTextPopup',
        0,
        0,
        true,
        null,
        'mainThick'
    );

    scene.game.events.on('event-started-popup-winningCard', () => {
        scene.game.events.emit('event-start-winningCardBorder', 0, 500);
    });

    scene.game.events.on('event-stopping-popup-winningCard', () => {
        scene.game.events.emit('event-stop-winningCardBorder', 500);
    });

    const shineFrames: Phaser.Types.Animations.AnimationFrame[] = [];
    for (let i = 0; i < 2; i++) {
        const frms = scene.anims.generateFrameNames('freeSpinsIntro', {
            start: 128,
            end: 138,
            zeroPad: 5,
            prefix: 'Near Win Frame_',
        });
        shineFrames.push(...frms);
    }

    const winningCardShine = new PopupAnimation(
        scene,
        'winningCardShine',
        'freeSpinsIntro',
        15,
        shineFrames,
        2
    );
    //winningCard.setFrame("10");
    winningCardShine.setIsScalingUp(false);
    winningCardShine.sprite.angle = cardAngle;

    let referentBg: Phaser.GameObjects.Image = null;
    let blackField: Phaser.GameObjects.Image = null;
    const BLACKFIELD_SCALE = 12;

    scene.game.events.on(
        'event-start-popup-bonusPopup',
        (
            duration = -1,
            multiplier?: number,
            triggeredFreeSpinsNumber?: number,
            isRetriggered?: boolean
        ) => {
            //scene.game.events.emit(`event-start-popup-bonusPopup${multiplier}`, duration, multiplier);
            freeSpinsTriggerindex = getFreeSpinsTriggerindex(
                triggeredFreeSpinsNumber
            );
            // freeSpinsTriggerindex = 0
            console.log('freespin in dex = ', freeSpinsTriggerindex);
            const finalAngle =
                (freeSpinsTriggerindex * 360) / freeSpinsTriggerAmounts.length;
            if (triggeredFreeSpinsNumber) {
                winningCard.setFrame(triggeredFreeSpinsNumber.toString());
            }
            // isRetriggered = true;
            if (!isRetriggered) {
                wheelRotatingPart.sprite.angle = 0;
                wheelRotatingPart.startAnim(duration);
                wheelPointer.startAnim(duration);
                wheel.startAnim(duration);
                scene.game.events.emit(
                    'event-start-textPopup-freeSpinsTitleAnim'
                );
                console.log('WIN NUMBER!!!', triggeredFreeSpinsNumber);
            } else {
                wheelRotatingPart.sprite.angle = finalAngle;
                wheelRotatingPart.startAnim(duration);
                wheelPointer.startAnim(duration);
                wheel.startAnim(duration);
                scene.game.events.emit(
                    'event-start-textPopup-freeSpinsTitleAnim'
                );
                scene.game.events.emit(
                    'event-animationcomplete-popup-wheelRotatingPart'
                );
            }
            scene.cameras.main.flash(1000);
            blackField = (scene.scene.get(
                'BackgroundSettings'
            ) as BackgroundSettings).menuBG;
            referentBg = (scene.scene.get(
                'BackgroundSettings'
            ) as BackgroundSettings).bgImage;
            blackField &&
                blackField
                    .setTexture('blackField')
                    .setActive(true)
                    .setVisible(true)
                    .setScale(
                        (referentBg ? referentBg.scale : 1) * BLACKFIELD_SCALE
                    )
                    .setDepth(2)
                    .setAlpha(0.5);

            fsWinTextPopup.setText(
                `X${freeSpinsTriggerAmounts[freeSpinsTriggerindex].multiplier} ${multiplierText}` +
                    '\n' +
                    `${freeSpinsTriggerAmounts[freeSpinsTriggerindex].freeSpins} ${freeSpinsText}`
            );

            if (!isRetriggered) {
                scene.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        //this.timeline && this.timeline.stop();
                        scene.tweens.timeline({
                            targets: wheelRotatingPart.sprite,
                            onUpdateScope: scene,
                            ease: 'Cubic.InOut',
                            tweens: [
                                {
                                    angle: {
                                        from: 0,
                                        to: 4 * 360 + finalAngle,
                                    },
                                    duration: 5000,
                                    onComplete: (): void => {
                                        scene.game.events.emit(
                                            'event-animationcomplete-popup-wheelRotatingPart'
                                        );
                                    },
                                },
                            ],
                        });
                        //scene.game.events.emit("event-animationcomplete-popup-wheelRotatingPart");
                    },
                    callbackScope: scene,
                    loop: false,
                });
            }
        },
        this
    );

    scene.game.events.on(
        'event-animationcomplete-popup-wheelRotatingPart',
        () => {
            scene.cameras.main.flash(1000);

            scene.game.events.emit('event-start-textPopup-fsWinTextPopup');
            scene.game.events.emit('event-stop-textPopup-freeSpinsTitleAnim');

            scene.time.addEvent({
                delay: 1500,
                callback: () => {
                    scene.game.events.emit('event-stopped-popup-bonusPopup');
                    blackField &&
                        blackField
                            .setTexture('menu-bg')
                            .setActive(false)
                            .setVisible(false)
                            .setScale(referentBg ? referentBg.scale : 1)
                            .setDepth(0)
                            .setAlpha(1);
                    blackField = null;
                    referentBg = null;
                    scene.game.events.emit('refreshBlackField');
                    winningCard.fadeOutAndStop();
                    winningCardShine.fadeOutAndStop();

                    wheel.fadeOutAndStop();
                    wheelRotatingPart.fadeOutAndStop();
                    wheelPointer.fadeOutAndStop();
                    scene.game.events.emit(
                        'event-stop-textPopup-freeSpinsTitleAnim'
                    );
                    scene.time.addEvent({
                        delay: 500,
                        callback: () =>
                            scene.game.events.emit(
                                'event-stop-textPopup-fsWinTextPopup'
                            ),
                        callbackScope: scene,
                        loop: false,
                    });
                },
                callbackScope: scene,
                loop: false,
            });
        },
        this
    );

    scene.game.events.on("event-reels-scene-coords-data", (data: IReelCoordinatesData) => {
        console.log('FSINTRO RESIZE');

        const screenW = scene.scale.gameSize.width / scene.cameras.main.zoom;
        const screenH = scene.scale.gameSize.height / scene.cameras.main.zoom;

        const middleY = scene.cameras.main.scrollY + 0.5 * screenH;
        let middleX = scene.cameras.main.scrollX + 0.5 * screenW;
        if (!globalGetIsPortrait(scene)) {
            // CLUDGE TODO center of reels X without hardcoding
            middleX = 175 / 2;
        }
        const dataScale = 0.7 * data.reelsScale;

        wheelRotatingPart.setPosition(middleX, middleY);
        wheelRotatingPart.setScale(dataScale);

        const jackPos = wheelRotatingPart.getPosition();

        wheel.setScale(dataScale);
        wheel.setPosition(middleX, middleY);

        freeSpinsTitleAnim.setScale(dataScale);
        freeSpinsTitleAnim.setTextPosition(middleX, middleY - 85, dataScale);
        fsWinTextPopup.setTextPosition(middleX, middleY - 70, dataScale);

        wheelPointer.setScale(dataScale);
        wheelPointer.setOrigin(0.5, 3.2);
        wheelPointer.setPosition(middleX, middleY);

        winningCard.setScale(dataScale);
        winningCard.setPosition(middleX, jackPos.y);
        winningCardBorder.resize();

        winningCardShine.setScale(dataScale);
        winningCardShine.setPosition(middleX, jackPos.y);

        blackField &&
            blackField.setScale(
                (referentBg ? referentBg.scale : 1) * BLACKFIELD_SCALE
            );
    });
}
