import { getGameLanguage } from '@clientframework/common/backend-service/src/client-remote-data/src/launchParams/gameLanguage';
import { getLanguageTextGameMsg } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';
import { getUrlDenomination } from '@clientframework/common/backend-service/src/launchParams/denomination';
import GameButton from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/gameButton';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';
import { basePopupStyle } from '@specific/config';
import { CURRENCY } from '@specific/dataConfig';
import {
    getHistoryPopupStyle,
    getHistoryFeaturesTriggeredKey,
    getHistoryFeaturesKey,
} from '../dataPresenter/defaultConfigSlot';
import { slotDataPresenter } from '../dataPresenter/instances';
import { ISlotDataPresenter } from '../dataPresenter/interfaces';
import BackgroundSettings from '../scenes/BackgroundSettings';
import { getCurrencyFormat } from '@clientframework/common/backend-service/src/launchParams/currency';
const moment = require('moment');

export function getHistoryTextStyle(
    size = 25,
    align = 'left'
): Phaser.Types.GameObjects.Text.TextStyle {
    const languagesToUseAlternateFont = ['sv', 'fr'];
    const textStyle_: Phaser.Types.GameObjects.Text.TextStyle = {
        fontSize: `${size}px`,
        fontFamily: languagesToUseAlternateFont.includes(getGameLanguage())
            ? 'Arial Narrow'
            : 'myriadForJack',
        align,
        rtl: false,
        color: '#fff',
        // stroke: '#000',
        // strokeThickness: 5,
    };
    return textStyle_;
}

export interface IHistoryPopupStyle {
    bgOn: boolean;
    bgScale: number;
    symbolsScale: number;
    additionalSymAlpha?: number;
}

export class HistoryPopup {
    screenSymbols: Phaser.GameObjects.Sprite[] = [];
    screenSymbolsAdditional: Phaser.GameObjects.Sprite[] = [];

    textField: Phaser.GameObjects.Text;
    titleText: Phaser.GameObjects.Text;
    text = '';
    depth = 4;
    historyNext: GameButton;
    historyPrev: GameButton;

    xOffsetFactor = 0;
    yOffsetFactor = 0;

    bgReels: Phaser.GameObjects.Sprite;

    constructor(
        protected scene: Phaser.Scene,
        protected scaleFactor = 1,
        protected autoResize = false,
        protected style: Phaser.Types.GameObjects.Text.TextStyle = getHistoryTextStyle(
            35
        ),
        protected historyPopupConfig: IHistoryPopupStyle = getHistoryPopupStyle()
    ) {
        if (this.historyPopupConfig && this.historyPopupConfig.bgOn) {
            this.bgReels = this.scene.add.sprite(0, 0, 'reels');
            this.bgReels.setDepth(this.depth);
            this.bgReels.setActive(false).setVisible(false);
            this.bgReels.setScale(this.historyPopupConfig.bgScale);
        }

        this.textField = this.scene.add.text(0, 0, this.text, this.style);
        this.titleText = this.scene.add.text(
            0,
            0,
            this.text,
            getHistoryTextStyle(50, 'center')
        );
        this.titleText.setDepth(this.depth);
        this.titleText.setOrigin(0.5, 0.5);
        this.textField.setDepth(this.depth);
        this.textField.setActive(false).setVisible(false);
        if (this.autoResize) {
            this.xOffsetFactor = -0.5;
            this.yOffsetFactor = -0.5;
            this.scene.scale.on(
                Phaser.Scale.Events.RESIZE,
                () => this.resize(globalGetIsPortrait(this.scene)),
                this
            );
        }

        this.scene.game.events.on(
            'event-current-data-updated',
            this.refreshFromModel,
            this
        );

        this.scene.game.events.on(
            'event-state-StateAskServerForHistory-onExit',
            () => {
                this.titleText.setActive(false).setVisible(false);
                this.textField.setActive(false).setVisible(false);
                this.bgReels && this.bgReels.setActive(false).setVisible(false);
                this.screenSymbols.forEach((element) => {
                    element.setActive(false).setVisible(false);
                });
                this.screenSymbolsAdditional.forEach((element) => {
                    element.setActive(false).setVisible(false);
                });
                this.historyNext.kill();
                this.historyPrev.kill();
                if (this.autoResize) {
                    this.scene.scene.get('Reels').cameras.main.resetFX();
                    this.scene.scene.get('ink4ReelWall') &&
                        this.scene.scene
                            .get('ink4ReelWall')
                            .cameras.main.resetFX();
                    this.scene.scene.get('StatusPanel') &&
                        this.scene.scene
                            .get('StatusPanel')
                            .cameras.main.setAlpha(1);
                }
            },
            this
        );

        if (this.autoResize) {
            this.scene.game.events.on(
                'event-state-StateAskServerForHistory-onEnter',
                () => {
                    this.scene.scene.get('Reels').cameras.main.fade(1000);
                    this.scene.scene.get('ink4ReelWall') &&
                        this.scene.scene
                            .get('ink4ReelWall')
                            .cameras.main.fade(1000, 6, 5, 22);
                    this.scene.scene.get('StatusPanel') &&
                        this.scene.scene
                            .get('StatusPanel')
                            .cameras.main.setAlpha(0);
                },
                this
            );
        }

        this.historyPrev = new GameButton(
            'historyPrev',
            null,
            this.scene,
            0,
            0,
            'arrow-left',
            'arrow-left',
            'arrow-left',
            'historyButtons'
        );
        this.historyPrev.background.setDepth(this.depth);
        this.historyPrev.kill();

        this.historyNext = new GameButton(
            'historyNext',
            null,
            this.scene,
            0,
            0,
            'arrow-right',
            'arrow-right',
            'arrow-right',
            'historyButtons'
        );
        this.historyNext.background.setDepth(this.depth);
        this.historyNext.kill();
    }

    timeStr(amount: string | number): string {
        // -- Dusan -- locale() translation
        // Since our language keys don't match with moment.js's keys it may be required to alter this code
        // for (Chinese, Spanish/Chillean, and maybe some other languages)
        const gameLanguageString = getGameLanguage();
        return moment
            .unix(Number(amount))
            .locale(gameLanguageString)
            .format('dddd, MMMM Do YYYY, h:mm:ss a');
    }

    refreshFromModel(slotData: ISlotDataPresenter): void {
        if (!slotData.historyData.pageActive) {
            return;
        }
        this.text = `
${getLanguageTextGameMsg(GameMsgKeys.historyPlayerId)}: ${slotData.historyData.playerId
            }
${getLanguageTextGameMsg(GameMsgKeys.historyGameStatus)}: ${slotData.historyData.gameStatus
            }


${getLanguageTextGameMsg(GameMsgKeys.historyBetAmount)}: ${this.formatMoney(
                slotData.historyData.betAmount
            )}
${getLanguageTextGameMsg(GameMsgKeys.historyWinAmount)}: ${this.formatMoney(
                slotData.historyData.winAmount
            )}


${slotData.historyData.triggeredFreeSpins > 0
                ? `${getLanguageTextGameMsg(getHistoryFeaturesTriggeredKey())}: ${slotData.historyData.triggeredFreeSpins
                }`
                : ''
            }
${slotData.historyData.currrentFreeSpin > 0
                ? `${getLanguageTextGameMsg(getHistoryFeaturesKey())}: ${slotData.historyData.currrentFreeSpin
                }/${slotData.historyData.totalFreeSpins}`
                : ''
            }

${getLanguageTextGameMsg(GameMsgKeys.historyStartTime)}: ${this.timeStr(
                slotData.historyData.startTime
            )}
${getLanguageTextGameMsg(GameMsgKeys.historyStartEndTime)}: ${this.timeStr(
                slotData.historyData.endTime
            )}

${slotData.historyData.interruptionReason == ''
                ? ''
                : getLanguageTextGameMsg(GameMsgKeys.historyInterruption) +
                ': ' +
                slotData.historyData.interruptionReason
            }
`;
        this.textField.setActive(true).setVisible(true);
        this.textField.setText(this.text);
        this.bgReels && this.bgReels.setActive(true).setVisible(true);

        let cnt = 0;
        this.screenSymbols.forEach((element) => {
            element.setActive(false).setVisible(false);
        });
        this.screenSymbolsAdditional.forEach((element) => {
            element.setActive(false).setVisible(false);
        });
        if (slotData.historyData.screen.length > 0) {
            for (let j = 0; j < slotData.historyData.screen.length; j++) {
                for (
                    let i = 0;
                    i < slotData.historyData.screen[j].length;
                    i++
                ) {
                    const val = slotData.historyData.screen[j][i];
                    if (cnt >= this.screenSymbols.length) {
                        const sym = this.scene.add.sprite(
                            0,
                            0,
                            'symbolsDefault'
                        );
                        this.screenSymbols.push(sym);
                    }
                    let symAdd = null;
                    if (slotData.historyData.additionalScreen.length > 0) {
                        if (cnt >= this.screenSymbolsAdditional.length) {
                            symAdd = this.scene.add.sprite(
                                0,
                                0,
                                'symbolsDefault'
                            );
                            this.screenSymbolsAdditional.push(symAdd);
                        }
                        const valAdd =
                            slotData.historyData.additionalScreen[j][i];
                        symAdd = this.screenSymbolsAdditional[cnt];
                        symAdd.setDepth(this.depth);
                        symAdd.setActive(true).setVisible(true);
                        symAdd.setFrame(`symbols/sym_${valAdd}`);
                    }
                    const sym = this.screenSymbols[cnt];
                    sym.setDepth(this.depth);
                    sym.setActive(true).setVisible(true);
                    sym.setFrame(`symbols/sym_${val}`);
                    cnt++;
                }
            }
        }
        const txt = `${getLanguageTextGameMsg(
            GameMsgKeys.historyGameHistory
        )} ${slotData.historyData.current}/${slotData.historyData.total} `;
        this.titleText.setText(txt);
        this.titleText.setActive(true).setVisible(true);
        this.historyNext.revive();
        this.historyPrev.revive();

        this.resize(globalGetIsPortrait(this.scene));
    }

    formatMoney(aomunt: number): string {
        return getCurrencyFormat(aomunt, CURRENCY);
    }

    resize(isPortrait: boolean): void {
        //super.resize();
        //this.menuBG.setScale(this.bgImage.scale);
        //this.menuBG.setPosition(this.bgImage.x, this.bgImage.y);
        //this.menuBG.angle = globalGetIsPortrait(this) ? 90 : 0;
        const screenWidth =
            this.scene.scale.gameSize.width / this.scene.cameras.main.zoom;
        const screenHeight =
            this.scene.scale.gameSize.height / this.scene.cameras.main.zoom;
        const scale = this.scaleFactor;
        const bottomY = screenHeight;
        const rightX = screenWidth;
        const middleX = screenWidth / 2; //= 0.5 * rightX
        //this.text.setScale(scale)
        this.textField.x = 0.1 * rightX;
        this.textField.y = 0.25 * bottomY;
        this.titleText.setPosition(middleX, 0.15 * bottomY);

        let cnt = 0;
        const rows = slotDataPresenter.historyData.screen.length;
        let reels = 0;
        if (slotDataPresenter.historyData.screen.length > 0) {
            reels = slotDataPresenter.historyData.screen[0].length;
        }
        // let largestSymIndex = 0;
        let largestSymH = 0;
        this.screenSymbols.forEach((element) => {
            if (element.height > largestSymH) {
                largestSymH = element.displayHeight * scale;
                // largestSymIndex = cnt;
            }
            cnt++;
        });
        cnt = 0;
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < reels; i++) {
                if (cnt < this.screenSymbols.length) {
                    const sym = this.screenSymbols[cnt];
                    if (isPortrait) {
                        sym.setPosition(
                            middleX + (i - Math.floor(reels / 2)) * 160,
                            this.textField.y +
                            this.textField.displayHeight +
                            (j + 0.8) * 160
                        );
                    } else {
                        sym.setPosition(
                            50 + middleX + i * 160,
                            this.textField.y + (j + 0.8) * 160
                        );
                    }
                    if (
                        this.bgReels &&
                        i == Math.floor(reels / 2) &&
                        j == Math.floor(rows / 2)
                    ) {
                        this.bgReels.x = sym.x;
                        this.bgReels.y = sym.y;
                    }
                    sym.setScale(
                        this.historyPopupConfig &&
                            this.historyPopupConfig.symbolsScale
                            ? this.historyPopupConfig.symbolsScale
                            : 0.8
                    );
                    if (this.screenSymbolsAdditional.length > 0) {
                        const symAdd = this.screenSymbolsAdditional[cnt];
                        symAdd.setPosition(sym.x, sym.y);
                        symAdd.setScale(sym.scale);
                        symAdd.setAlpha(
                            this.historyPopupConfig.hasOwnProperty(
                                'additionalSymAlpha'
                            )
                                ? this.historyPopupConfig.additionalSymAlpha
                                : 1
                        );
                    }
                }
                cnt++;
            }
        }

        if (isPortrait) {
            this.historyPrev.setX(
                middleX + (1.5 - Math.floor(reels / 2)) * 160
            );
            this.historyPrev.setY(
                this.textField.y +
                this.textField.displayHeight +
                (rows + 1) * 160
            );

            this.historyNext.setX(
                middleX + (2.5 - Math.floor(reels / 2)) * 160
            );
            this.historyNext.setY(
                this.textField.y +
                this.textField.displayHeight +
                (rows + 1) * 160
            );
        } else {
            this.historyPrev.setX(50 + middleX + 1.5 * 160);
            this.historyPrev.setY(this.textField.y + +(rows + 1) * 160);

            this.historyNext.setX(50 + middleX + 2.5 * 160);
            this.historyNext.setY(this.textField.y + +(rows + 1) * 160);
        }

        const xOffset = this.xOffsetFactor * rightX;
        const yOffset = this.yOffsetFactor * bottomY;
        this.screenSymbols.forEach((element) => {
            element.x += xOffset;
            element.y += yOffset;
        });
        this.screenSymbolsAdditional.forEach((element) => {
            element.x += xOffset;
            element.y += yOffset;
        });
        if (this.bgReels) {
            this.bgReels.x += xOffset;
            this.bgReels.y += yOffset;
        }
        this.textField.x += xOffset;
        this.textField.y += yOffset;
        this.titleText.x += xOffset;
        this.titleText.y += yOffset;
        this.historyNext.x += xOffset;
        this.historyNext.y += yOffset;
        this.historyPrev.x += xOffset;
        this.historyPrev.y += yOffset;
    }
}
