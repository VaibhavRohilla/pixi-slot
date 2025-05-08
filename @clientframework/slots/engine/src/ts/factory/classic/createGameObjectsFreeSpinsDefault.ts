import { IReelCoordinatesData } from '../../dataPresenterVisual/iReelCoordinatesData';
import { ISlotDataPresenter } from '../../dataPresenter/interfaces';
import _sortBy from 'lodash-es/sortBy';

let diamondLeft: Phaser.GameObjects.Sprite;
let diamondRight: Phaser.GameObjects.Sprite;
let multiplierLeft: Phaser.GameObjects.Sprite;
let multiplierRight: Phaser.GameObjects.Sprite;

let freeSpinsLeftFieldText: Phaser.GameObjects.Sprite;

let scene: Phaser.Scene;

export function resizeElementsGameObjectFreeSpinsDefault(
    data: IReelCoordinatesData,
    fieldY: number,
    reelsW: number,
    middleReelsX: number,
    reelsBottom: number
): void {
    if (freeSpinsLeftFieldText) {
        const textX = middleReelsX - reelsW / 2.25;
        const textY = (reelsBottom + fieldY) / 2.1;
        freeSpinsLeftFieldText.setPosition(textX, textY);
    }

    if (diamondLeft) {
        diamondLeft.setScale(0.6);
        multiplierLeft.setScale(0.6);
        const diamondX =
            data.logo.x -
            (0.85 * data.logo.w * data.logo.scale) / 2 -
            (diamondLeft.width * diamondLeft.scale) / 2;
        const diamondY = data.logo.y + (data.logo.h * data.logo.scale) / 3;
        diamondLeft.setPosition(diamondX, diamondY);
        const multiplierY = diamondY + (data.logo.h * data.logo.scale) / 10;
        multiplierLeft.setPosition(diamondX, multiplierY);
    }

    if (diamondRight) {
        diamondRight.setScale(0.6);
        multiplierRight.setScale(0.6);
        const diamondX =
            data.logo.x +
            (0.85 * data.logo.w * data.logo.scale) / 2 +
            (diamondRight.width * diamondRight.scale) / 2;
        const diamondY = data.logo.y + (data.logo.h * data.logo.scale) / 3;
        diamondRight.setPosition(diamondX, diamondY);
        const multiplierY = diamondY + (data.logo.h * data.logo.scale) / 10;
        multiplierRight.setPosition(diamondX, multiplierY);
    }
}

function killFSGraphics(): void {
    freeSpinsLeftFieldText &&
        freeSpinsLeftFieldText.setVisible(false).setActive(false).setAlpha(1);
    diamondLeft.setVisible(false).setActive(false).setAlpha(1);
    diamondRight.setVisible(false).setActive(false).setAlpha(1);
    multiplierLeft.setVisible(false).setActive(false).setAlpha(1);
    multiplierRight.setVisible(false).setActive(false).setAlpha(1);
}

function refreshFromModel(
    slotData: ISlotDataPresenter,
    isFutureData = false
): void {
    if (slotData.status.freeSpins.totalSpins > 0) {
        if (freeSpinsLeftFieldText && isFutureData) {
            console.log('has FS field');
            const num =
                slotData.status.freeSpins.totalSpins -
                slotData.status.freeSpins.currentSpin -
                1;
            freeSpinsLeftFieldText.setVisible(true).setActive(true).setAlpha(1);
            if (num > -1) {
                freeSpinsLeftFieldText.setFrame(
                    `n_${num < 10 ? '0' : ''}${num}`
                );
            } else {
                scene.tweens.add({
                    targets: freeSpinsLeftFieldText,
                    duration: 500,
                    alpha: 0,
                    onComplete: () => {
                        freeSpinsLeftFieldText
                            .setVisible(false)
                            .setActive(false)
                            .setAlpha(1);
                    },
                });
            }
        }
        if (diamondLeft) {
            diamondLeft.setVisible(true).setActive(true).setAlpha(1);
            scene.anims.play('diamondSpin', diamondLeft);
        }
        if (diamondRight) {
            diamondRight.setVisible(true).setActive(true).setAlpha(1);
            scene.anims.play('diamondSpin', diamondRight);
        }
        if (multiplierLeft) {
            multiplierLeft.setVisible(true).setActive(true).setAlpha(1);
            scene.anims.play(
                `multiplier${slotData.winDescription.multiplier}`,
                multiplierLeft
            );
        }
        if (multiplierRight) {
            multiplierRight.setVisible(true).setActive(true).setAlpha(1);
            scene.anims.play(
                `multiplier${slotData.winDescription.multiplier}`,
                multiplierRight
            );
        }
    } else {
        killFSGraphics();
    }
}

function fadeOutFSGraphics(): void {
    const trg = [
        freeSpinsLeftFieldText,
        diamondLeft,
        diamondRight,
        multiplierLeft,
        multiplierRight,
    ];
    scene.tweens.add({
        targets: trg,
        duration: 500,
        alpha: 0,
        onComplete: () => {
            killFSGraphics();
        },
    });
}

export function createGameObjectFreeSpinsDefault(scene_: Phaser.Scene): void {
    scene = scene_;

    freeSpinsLeftFieldText = scene.add.sprite(0, 0, 'fsNum');
    freeSpinsLeftFieldText.setScale(0.85);

    diamondLeft = scene.add.sprite(0, 0, 'diamond');
    diamondRight = scene.add.sprite(0, 0, 'diamond');
    multiplierLeft = scene.add.sprite(0, 0, 'multiply');
    multiplierRight = scene.add.sprite(0, 0, 'multiply');

    for (let i = 3; i <= 5; i++) {
        const frames = scene.anims.generateFrameNames('multiply', {
            start: 0,
            end: 58,
            zeroPad: 2,
            prefix: `x${i}/multiply_`,
        });

        //console.log("darko frames", frames)

        scene.anims.create({
            key: 'multiplier' + i,
            repeat: -1,
            frames: frames,
            frameRate: 30,
        });
    }

    {
        let frames = scene.anims.generateFrameNames('diamond');
        frames = _sortBy(frames, ['frame']);

        scene.anims.create({
            key: 'diamondSpin',
            repeat: -1,
            frames: frames,
            frameRate: 30,
        });
    }

    scene.game.events.on(
        'event-start-popup-bonusPopup',
        (duration, multiplier, triggeredFS) => {
            //freeSpinsLeftFieldText && freeSpinsLeftFieldText.setVisible(true).setActive(true).setAlpha(1);
            freeSpinsLeftFieldText &&
                freeSpinsLeftFieldText.setFrame(`n_${triggeredFS - 1}`);
        }
    );

    scene.game.events.on('event-stopped-popup-bonusPopup', () => {
        freeSpinsLeftFieldText.setVisible(true).setActive(true).setAlpha(0);
        scene.tweens.add({
            targets: freeSpinsLeftFieldText,
            alpha: 1,
            duration: 200,
        });
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
