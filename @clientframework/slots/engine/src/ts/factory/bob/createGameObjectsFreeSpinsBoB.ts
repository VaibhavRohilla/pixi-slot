import { IReelCoordinatesData } from '../../dataPresenterVisual/iReelCoordinatesData';
import { ISlotDataPresenter } from '../../dataPresenter/interfaces';
import { slotDataPresenter } from '../../dataPresenter/instances';
import { RotatingStarsEffect } from '@clientframework/slots/engine/src/ts/game-objects/rotatingStarsEffect';
import Reels from '../../scenes/Reels';

let freeSpinsLeftFieldText:
    | Phaser.GameObjects.BitmapText
    | Phaser.GameObjects.Text;
let freeTextField: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
let spinsTextFileld: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
let numberOfLinesText: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;

let fsTexts: (Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text)[];
let currentFS = 0;
//let totalFS = 0;

let rotatingStarsEffect: RotatingStarsEffect;
let rotatingStarEffectActive = false;
let bookOpen: Phaser.GameObjects.Sprite;

// let bookBGTween: Phaser.Tweens.Tween;

let scene: Phaser.Scene;

const bookFramesPrefix = 'book_small_0';
const bookFramesBySymbolIndex: ReadonlyArray<number> = [
    93, // J
    85, // Q
    77, // K
    69, // A
    61, // scarab
    53, // horus
    37, // cat
    45, // pharaoh
];
const bookFramesSuffix = '.png';

function killFSGraphics(): void {
    fsTexts.forEach((element) => {
        element.setVisible(false).setActive(false).setAlpha(1);
    });
    numberOfLinesText &&
        numberOfLinesText.setVisible(true).setActive(true).setAlpha(1);
}

function fadeOutFSGraphics(killGraphics = true): void {
    scene.game.events.emit('event-rotatingstar-stop-fsLeft', 500);
    scene.tweens.add({
        targets: [...fsTexts, bookOpen],
        duration: 500,
        alpha: 0,
        ease: 'Linear',
        onComplete: () => {
            // bookBGTween && bookBGTween.stop();
            scene.game.events.emit('event-freespins-fade-graphics');
            // totalWinNumber = 0;
            // totalWinText.setText(totalWinNumber.toLocaleString('en-US', {minimumFractionDigits: 2}));
            currentFS = 0;
            //totalFS = 0;
            killGraphics && killFSGraphics();
        },
    });
}

export function resizeElementsGameObjectFreeSpinsBoB(
    data: IReelCoordinatesData,
    fieldY: number,
    reelsW: number,
    middleReelsX: number,
    reelsBottom: number
): void {
    //console.log('auui resize')
    reelsBottom;
    const deltaYSymbol =
        data.reelsScale *
        (data.symbolsCoords[1][1].y - data.symbolsCoords[1][0].y);
    const aboveReels = data.reelsCoords[0].y - 25;
    const reelsH = 3 * deltaYSymbol; //@BOB free spins position 25/06/2020
    const reelW = data.reelsCoords[1].x - data.reelsCoords[0].x;
    if (freeSpinsLeftFieldText) {
        const reels = scene.scene.get('Reels') as Reels;
        const textX = reels.bg.x + reels.bg.displayWidth / 2; //middleReelsX + reelW * 2.7; //@BOB free spins position 25/06/2020
        const reelsH = reels.bg.y + 0.36 * reels.bg.displayHeight / 2; //middleReelsX + reelW * 2.7; //@BOB free spins position 25/06/2020

        freeSpinsLeftFieldText.setOrigin(0, 1);
        // if (scene.scale.isPortrait) {
        //     freeSpinsLeftFieldText.setPosition(textX - 148, reelsH + 60); //@BOB free spins position 25/06/2020
        //     freeTextField.setPosition(textX - 130, reelsH - 30);
        //     spinsTextFileld.setPosition(textX - 140, reelsH + 10);
        //     bookOpen.setPosition(textX - 150, reelsH);
        //     rotatingStarsEffect.setPosition(textX - 150, reelsH);
        // } else
        {
            freeSpinsLeftFieldText.setPosition(textX + 78, reelsH - 40); //@BOB free spins position 25/06/2020
            freeTextField.setPosition(textX + 95, reelsH - 120);
            spinsTextFileld.setPosition(textX + 90, reelsH - 90);
            bookOpen.setPosition(textX + 80, reelsH - 100);
            rotatingStarsEffect.setPosition(textX + 80, reelsH - 100);
        }
        freeSpinsLeftFieldText.setDepth(100);
        freeTextField.setOrigin(0, 1);
        freeTextField.setDepth(100);
        spinsTextFileld.setOrigin(0, 1);
        spinsTextFileld.setDepth(100);
    }
    if (numberOfLinesText) {
        const textX = middleReelsX + reelW * 2.5;
        numberOfLinesText.setOrigin(1, 1);
        numberOfLinesText.setPosition(textX, aboveReels + 10);
    }
}

function refreshFromModel(
    slotData: ISlotDataPresenter,
    isFutureData = false
): void {
    isFutureData;
    if (slotData.futureStatus.freeSpins.totalSpins > 0) {
        if (freeSpinsLeftFieldText) {
            // console.log(
            //     'refreshFromModel 2 ',
            //     slotData.futureStatus.freeSpins.currentSpin,
            //     slotData.futureStatus.freeSpins.totalSpins
            // );
            currentFS = slotData.status.freeSpins.currentSpin;

            freeSpinsLeftFieldText.setText(
                ` ${currentFS == 0
                    ? slotData.futureStatus.freeSpins.currentSpin
                    : currentFS
                    } / ${slotData.status.freeSpins.totalSpins == 0
                        ? slotData.futureStatus.freeSpins.totalSpins
                        : slotData.status.freeSpins.totalSpins
                    }`.toUpperCase()
            );
            const frameName =
                bookFramesPrefix +
                bookFramesBySymbolIndex[
                slotData.futureStatus.freeSpins.expandingWild
                ] +
                bookFramesSuffix;
            bookOpen.setFrame(frameName);

            if (slotData.status.freeSpins.currentSpin <= 0) {
                freeSpinsLeftFieldText.setAlpha(0);
                freeTextField.setAlpha(0);
                spinsTextFileld.setAlpha(0);
                bookOpen.setAlpha(0);
                if (rotatingStarEffectActive) {
                    rotatingStarEffectActive = false;
                    scene.game.events.emit(
                        'event-rotatingstar-stop-fsLeft',
                        200
                    );
                }
            } else if (
                slotData.winDescription.additional &&
                !slotData.winDescription.additional.goldenChamber
            ) {
                freeSpinsLeftFieldText.setAlpha(1);
                freeTextField.setAlpha(1);
                spinsTextFileld.setAlpha(1);
                bookOpen.setAlpha(1);
                if (!rotatingStarEffectActive) {
                    rotatingStarEffectActive = true;
                    scene.game.events.emit(
                        'event-rotatingstar-start-fsLeft',
                        500
                    );
                }
            }
        }
    }
}

export function createGameObjectFreeSpinsBoB_(
    scene_: Phaser.Scene,
    style?: any,
    bitmapFontTextureKey?: string,
    bitmapFontTextureKeySuffixThin?: string,
    bitmapFontTextureKeySuffixThick?: string
): void {
    bitmapFontTextureKeySuffixThick;
    bitmapFontTextureKeySuffixThin;

    scene = scene_;

    fsTexts = [];
    rotatingStarsEffect = new RotatingStarsEffect(scene_, {
        stars: [
            {
                scale: {
                    min: 0.7,
                    max: 1,
                    speed: 5,
                },
                rotatingSpeed: 30,
                rotateClockwise: true,
                opacity: { min: 0.65, max: 1, speed: 6 },
            },
            {
                scale: {
                    min: 0.3,
                    max: 0.6,
                    speed: 4,
                },
                rotatingSpeed: 20,
                rotateClockwise: false,
                opacity: { min: 0.85, max: 1, speed: 8 },
            },
        ],
        key: 'fsLeft',
        textureKey: 'RotatingStar',
    });
    bookOpen = scene.add.sprite(0, 0, 'bookSmall');
    bookOpen
        .setAlpha(0)
        .setDepth(100).setScale(1.25);

    //let defaultStyle = false;
    if (!style) {
        //defaultStyle = true;
        style = {
            font: '200px Arial',
            align: 'center',
            color: '#ff0',
            stroke: '#000',
            strokeThickness: 16,
        };
        numberOfLinesText = scene.add.text(0, 200, '', style);
        freeSpinsLeftFieldText = scene.add
            .text(0, 0, '', {
                fontFamily: 'Times',
                fontSize: '65px',
                align: 'center',
                color: '#472f1d',
                fontStyle: 'bold',
            })
            .setScale(0.6, 0.6)
            .setAlpha(0)
            .setDepth(100);
        fsTexts.push(freeSpinsLeftFieldText);
        freeTextField = scene.add
            .text(0, 0, 'Free', {
                fontFamily: 'Times',
                fontSize: navigator.userAgent.includes('Mobile') ? '63px' : '70px',
                align: 'center',
                color: '#472f1d',
                fontStyle: 'bold italic',
            })
            .setScale(0.6, 0.6)
            .setAlpha(0)
            .setDepth(100);
        fsTexts.push(freeTextField);
        spinsTextFileld = scene.add
            .text(0, 0, 'Spins', {
                fontFamily: 'Times',
                fontSize: navigator.userAgent.includes('Mobile') ? '63px' : '70px',
                align: 'center',
                color: '#472f1d',
                fontStyle: 'bold italic',
            })
            .setScale(0.6, 0.6)
            .setAlpha(0)
            .setDepth(100);
        fsTexts.push(spinsTextFileld);
    }

    // scene.game.events.on(
    //     'event-start-popup-bonusPopup',
    //     (
    //         duration,
    //         multiplier,
    //         triggeredFS,
    //         isRetriggered,
    //         triggeredGoldenChamber
    //     ) => {
    //         isRetriggered;
    //         totalFS += triggeredFS;
    //         if (triggeredGoldenChamber) {
    //             fadeOutFSGraphics();
    //         }
    //     }
    // );

    scene.game.events.on(
        'event-start-popup-bonusPopup',
        (
            popupDuration,
            multiplier,
            triggeredFreeSpins,
            isRetriggered,
            triggeredGoldenChamber
        ) => {
            if (triggeredGoldenChamber) {
                fadeOutFSGraphics(false);
            }
        }
    );
    scene.game.events.on('event-stopped-popup-bonusPopup', () => {
        if (slotDataPresenter.winDescription.triggeredAdditionalBonus) {
            return;
        }

        fsTexts.forEach((element) => {
            element.setVisible(true).setActive(true).setAlpha(0);
        });
        freeSpinsLeftFieldText.setText(
            ` ${currentFS == 0
                ? slotDataPresenter.futureStatus.freeSpins.currentSpin
                : currentFS
                } / ${slotDataPresenter.status.freeSpins.totalSpins == 0
                    ? slotDataPresenter.futureStatus.freeSpins.totalSpins
                    : slotDataPresenter.status.freeSpins.totalSpins
                }`.toUpperCase()
        );
        //    multiplierText.setText(`${multiplier}x line pays`.toUpperCase()); //@BOB remove line 24/06/2020
        bookOpen.setAlpha(0);

        const trgs = [bookOpen];
        trgs.forEach((element) => {
            element.setVisible(true).setActive(true).setAlpha(0);
        });
        scene.tweens.add({
            targets: [...fsTexts, ...trgs],
            alpha: 1,
            duration: 500,
            ease: 'Linear',
        });

        if (numberOfLinesText.active) {
            numberOfLinesText &&
                numberOfLinesText
                    .setVisible(false)
                    .setActive(false)
                    .setAlpha(1);
        }
    });

    scene.game.events.on(
        'event-animation-bonusEnd-willStart',
        fadeOutFSGraphics,
        this
    );

    scene.game.events.on('event-current-data-updated', refreshFromModel, this);
    scene.game.events.on('event-data', refreshFromModel, this);
    scene.game.events.on(
        'event-future-data-updated',
        (arg) => refreshFromModel(arg, true),
        this
    );
}

export function updateGameObjectFreeSpinsBoB(): void {
    rotatingStarsEffect.update();
}
