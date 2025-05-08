import { IReelCoordinatesData } from '../../dataPresenterVisual/iReelCoordinatesData';
import { ISlotDataPresenter } from '../../dataPresenter/interfaces';
import {
    getLanguageGameMsgField,
    getLanguageTextGameMsg,
} from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';
import { getGameLanguage } from '@clientframework/common/backend-service/src/client-remote-data/src/launchParams/gameLanguage';


//import _sortBy from 'lodash-es/sortBy';

let freeSpinsLeftFieldText:
    | Phaser.GameObjects.BitmapText
    | Phaser.GameObjects.Text;
let numberOfLinesText: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
// let totalWinText: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
// let totalWinNumber: number = 0;
let multiplierText: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
//let isBitmapFont: boolean;

let fsTexts: (Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text)[];
let currentFS = 0;
let totalFS = 0;
let multiplier = 0;

let scene: Phaser.Scene;

function killFSGraphics(): void {
    fsTexts.forEach((element) => {
        element.setVisible(false).setActive(false).setAlpha(1);
    });
    numberOfLinesText &&
        numberOfLinesText.setVisible(true).setActive(true).setAlpha(1);
}

function fadeOutFSGraphics(): void {
    scene.tweens.add({
        targets: fsTexts,
        duration: 500,
        alpha: 0,
        onComplete: () => {
            scene.game.events.emit('event-freespins-fade-graphics');
            // totalWinNumber = 0;
            // totalWinText.setText(totalWinNumber.toLocaleString('en-US', {minimumFractionDigits: 2}));
            currentFS = 0;
            totalFS = 0;
            killFSGraphics();
        },
    });
}

export function resizeElementsGameObjectFreeSpinsJacks(
    data: IReelCoordinatesData,
    fieldY: number,
    reelsW: number,
    middleReelsX: number,
    reelsBottom: number
): void {
    reelsBottom;

    const aboveReels = data.reelsCoords[0].y - 25;

    const reelW = data.reelsCoords[1].x - data.reelsCoords[0].x;
    if (freeSpinsLeftFieldText) {
        const textX = middleReelsX - reelW * 2.5;
        freeSpinsLeftFieldText.setOrigin(0, 1);
        freeSpinsLeftFieldText.setPosition(textX, aboveReels);
    }
    if (numberOfLinesText) {
        const textX = middleReelsX + reelW * 2.5;
        numberOfLinesText.setOrigin(1, 1);
        numberOfLinesText.setPosition(textX, aboveReels + 10);
    }
    // if(totalWinText) {
    //     let textX = middleReelsX + reelW * 2.5;
    //     totalWinText.setOrigin(1, 1);
    //     totalWinText.setPosition(textX, data.reelsCoords[0].y);
    // }
    if (multiplierText) {
        const textX = middleReelsX;
        const deltaYSymbol =
            data.reelsScale *
            (data.symbolsCoords[1][1].y - data.symbolsCoords[1][0].y);
        const reelsH = 3 * deltaYSymbol;
        multiplierText.setOrigin(0.5, 0);
        multiplierText.setPosition(textX, -30 + data.reelsCoords[0].y + reelsH + 25);
        multiplierText.setScale(0.6)
    }
}

function refreshFromModel(
    slotData: ISlotDataPresenter,
    isFutureData = false
): void {
    multiplier = slotData.winDescription.multiplier;
    if (slotData.status.freeSpins.totalSpins > 0) {
        if (freeSpinsLeftFieldText && isFutureData) {
            numberOfLinesText &&
                numberOfLinesText
                    .setVisible(false)
                    .setActive(false)
                    .setAlpha(1);
            fsTexts.forEach((element) => {
                element.setVisible(true).setActive(true).setAlpha(1);
            });
            currentFS = slotData.status.freeSpins.currentSpin;

            // atest-kp-should be in npm languages
            if (getGameLanguage() === 'sv') {
                freeSpinsLeftFieldText.setText(
                    `gratissnurr ${currentFS} / ${slotData.status.freeSpins.totalSpins}`.toUpperCase()
                );
            } else {
                freeSpinsLeftFieldText.setText(
                    `free spins ${currentFS} / ${slotData.status.freeSpins.totalSpins}`.toUpperCase()
                );
            }
        }
        // else if (slotData.status.freeSpins.currentSpin > 0 && !isFutureData){
        //     totalWinNumber = slotData.status.freeSpins.totalWin;
        //     totalWinText.setText(totalWinNumber.toLocaleString('en-US', {minimumFractionDigits: 2}));
        // }
    } else {
        killFSGraphics();
    }
}

export function createGameObjectFreeSpinsJacks(
    scene_: Phaser.Scene,
    style?: any,
    bitmapFontTextureKey?: string,
    bitmapFontTextureKeySuffixThin?: string,
    bitmapFontTextureKeySuffixThick?: string
): void {
    bitmapFontTextureKeySuffixThin;

    scene = scene_;

    const topText = getLanguageTextGameMsg(
        GameMsgKeys.winUpToMLines
    ).toUpperCase();

    fsTexts = [];

    if (bitmapFontTextureKey) {
        // totalWinText = scene.add.bitmapText(0, 0, bitmapFontTextureKey + bitmapFontTextureKeySuffixThick, "", 75);
        const langFied = getLanguageGameMsgField(GameMsgKeys.linePays);
        if (langFied.hasOwnProperty('isBitmapText') && langFied.isBitmapText) {
            multiplierText = scene.add.bitmapText(
                0,
                0,
                bitmapFontTextureKey + bitmapFontTextureKeySuffixThick,
                ''.toUpperCase(),
                75
            );
        } else {
            if (!style) {
                style = {
                    font: '200px Arial',
                    align: 'center',
                    color: '#ff0',
                    stroke: '#000',
                    strokeThickness: 16,
                };
            }
            multiplierText = scene.add.text(0, 200, '', style);
        }
        freeSpinsLeftFieldText = scene.add.bitmapText(
            0,
            0,
            bitmapFontTextureKey + bitmapFontTextureKeySuffixThick,
            '00000',
            35
        );
        numberOfLinesText = scene.add.bitmapText(
            0,
            0,
            bitmapFontTextureKey + bitmapFontTextureKeySuffixThick,
            topText,
            35
        );

        //isBitmapFont = true;
    } else {
        //isBitmapFont = false;
        let defaultStyle = false;
        if (!style) {
            defaultStyle = true;
            style = {
                font: '200px Arial',
                align: 'center',
                color: '#ff0',
                stroke: '#000',
                strokeThickness: 16,
            };
        }
        numberOfLinesText = scene.add.text(0, 200, '', style);
        freeSpinsLeftFieldText = scene.add.text(0, 200, '', style);
        // totalWinText = scene.add.text(0, 200, "", style);
        multiplierText = scene.add.text(0, 200, '', style);

        if (defaultStyle) {
            (<Phaser.GameObjects.Text[]>[fsTexts, numberOfLinesText]).forEach(
                (element) => {
                    element.setShadow(2, 2, '#333333', 2, true, true);
                    element.setTint(0xffff00, 0xffaa00, 0xffaa00, 0xffff00);
                    element.setTint(0xffff00, 0xffaa00, 0xffaa00, 0xffff00);
                }
            );
        }
    }
    fsTexts.push(freeSpinsLeftFieldText, /*totalWinText,*/ multiplierText);

    scene.game.events.on(
        'event-start-popup-bonusPopup',
        (duration, multiplier, triggeredFS, isRetriggered) => {
            isRetriggered;

            // freeSpinsLeftFieldText && freeSpinsLeftFieldText.setVisible(false).setActive(false).setAlpha(1);
            totalFS += triggeredFS;
        }
    );

    scene.game.events.on('event-stopped-popup-bonusPopup', () => {
        if (
            !freeSpinsLeftFieldText.active &&
            /*!totalWinText.active &&*/ !multiplierText.active
        ) {
            // atest-kp-should be in npm languages
            if (getGameLanguage() === 'sv') {
                freeSpinsLeftFieldText.setText(
                    `gratissnurr ${currentFS} / ${totalFS}`.toUpperCase()
                );
            } else {
                freeSpinsLeftFieldText.setText(
                    `free spins ${currentFS} / ${totalFS}`.toUpperCase()
                );
            }
            multiplierText.setText(
                `${multiplier}x ${getLanguageTextGameMsg(
                    GameMsgKeys.linePays
                )}`.toUpperCase()
            );
            fsTexts.forEach((element) => {
                element.setVisible(true).setActive(true).setAlpha(0);
            });

            scene.tweens.add({
                targets: fsTexts,
                alpha: 1,
                duration: 200,
            });
        }
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
