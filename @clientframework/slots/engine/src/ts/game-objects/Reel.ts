import _forEach from 'lodash-es/forEach';
import ReelSymbol, { ReelSymbolStates } from './ReelSymbol';
import { ISlotDataPresenter } from '../dataPresenter/interfaces';
import {
    configSceneReels,
    reelSymbolConfig,
    THREE_SECOND_RULE,
    winFramesConfig,
} from '@specific/config';
import { IWinFramesConfig } from './WinPopupAnimation';
import {
    getBonusReelExcludedSymbols,
    getDefaultReelExcludedSymbols,
    getDisplayEdgeSymbolsInReelSpin,
} from '../dataPresenter/defaultConfigSlot';
import { Factory } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/factory/factory';

export default class Reel<
    SymbolClass extends ReelSymbol = ReelSymbol
> extends Phaser.GameObjects.Container {
    symbols: SymbolClass[] = Array(4);
    reelStrip: number[] = Array(1 + 22 + 1);

    debugGraphics: Phaser.GameObjects.Graphics;
    pos = 4 * ReelSymbol.SIZE.y;

    shouldProlong = 0;
    isProlongInitial = false;
    prolongStarted = false;

    isFastStopping = false;
    timeline: Phaser.Tweens.Timeline = null;
    reelIndex = 0;
    spinStopped = true;
    dropDetecedOnThisReel = false;

    canStopSpin = false;
    spinDelay = 250;
    winFrameConf: IWinFramesConfig;

    prevSymbol = -1;

    constructor(
        scene: Phaser.Scene,
        protected dataPresenter: ISlotDataPresenter,
        winFrameConfig: IWinFramesConfig,
        x?: number,
        y?: number,
        reelIndex?: number,
        protected symbolFactory?: Factory<SymbolClass>,
        private numberOfSymbols = 4
    ) {
        super(scene, x, y);
        if (!this.symbolFactory) {
            this.symbolFactory = new Factory<ReelSymbol>(ReelSymbol) as Factory<
                SymbolClass
            >;
        }

        this.reelIndex = reelIndex;

        for (let i = 0; i < this.reelStrip.length; i++) {
            this.reelStrip[i] = this.getRandomSymbol(dataPresenter);
        }

        this.winFrameConf = winFrameConfig;

        // TODO set three symbols before last to match reels data
        this.reelStrip[1] = 6;
        this.reelStrip[2] = 6;
        this.reelStrip[3] = 6;

        this.setMask(scene.make.graphics({}).createGeometryMask());

        this.createSymbols(x, winFramesConfig);

        this.debugGraphics = scene.add.graphics();
        this.debugGraphics.visible = false;
        this.add(this.debugGraphics);

        // winlines buffer is always creating new segments
        // this is prevention for them to be over reels (in case winlines should be behind reels in same scene)
        this.setDepth(1);

        scene.add.existing(this);

        scene.game.events.on(
            'event-animation-rotation-interrupt',
            this.performFastStop,
            this
        );
        scene.game.events.on(
            'event-symbol-dropAnimation-ended',
            this.checkDroppingSymbols,
            this
        );
        scene.game.events.on(
            'event-start-near-win-prolong',
            () => {
                if (this.shouldProlong > 0) {
                    this.prolongStarted = true;
                    scene.game.events.emit(
                        'event-near-win-prolong-started',
                        this.reelIndex
                    );
                }
            },
            this
        );
        this.turnOffdgeSymbols();
    }

    protected turnOffdgeSymbols(): void {
        this.symbols[0].deactivateSymbol();
    }

    protected createSymbols(x: number, winFrameConfig: IWinFramesConfig): void {
        this._createSymbols(x, winFrameConfig, this.numberOfSymbols);
    }

    private _createSymbols(
        x: number,
        winFrameConfig: IWinFramesConfig,
        cnt: number
    ): void {
        for (let i = 0; i < cnt; i++) {
            const symbol = this.symbolFactory.createInstance(
                this.scene,
                x + ReelSymbol.SIZE.x / 2,
                (1 / 2 + i) * ReelSymbol.SIZE.y,
                this.reelStrip[3 - i],
                winFrameConfig
            );

            symbol.setSymbolsMask();

            symbol.winFrameAnim && this.add(symbol.winFrameAnim.sprite);
            symbol.addtoReel(this);

            this.symbols[i] = symbol;
        }
    }

    positionSymbols(): void {
        // this.debugGraphics.clear();
        // this.debugGraphics.lineStyle(1, 0x00ffff);

        _forEach(this.symbols, (symbol: SymbolClass, i: number) => {
            symbol.y =
                (1 / 2 + i) * ReelSymbol.SIZE.y +
                (this.pos % ReelSymbol.SIZE.y) -
                ReelSymbol.SIZE.y;

            const stripIndex =
                (this.reelStrip.length +
                    Math.floor(this.pos / ReelSymbol.SIZE.y) -
                    i) %
                this.reelStrip.length;

            if (
                this.reelStrip[stripIndex] != symbol.symbolIndex ||
                symbol.currentState != ReelSymbolStates.dropAnimation
            ) {
                symbol.setStateDefault(this.reelStrip[stripIndex]);
            }

            symbol.resize();
            this.positionSymbolsSpecific(symbol, stripIndex);

            this.debugGraphics.strokeRect(1, symbol.y - 119, 238, 238);
        });

        this.debugGraphics.lineStyle(1, 0x00ffff);
        this.debugGraphics.strokeRect(
            0,
            0,
            ReelSymbol.SIZE.x,
            ReelSymbol.SIZE.y * 3
        );
        if (this.timeline) {
            this.timeline.timeScale = this.prolongStarted ? 0.5 : 1;
        }
    }

    protected positionSymbolsSpecific(
        symbol: SymbolClass,
        stripIndex: number
    ): void {
        symbol;
        stripIndex;
    }

    spin(reelIndex: number, delay = 325 * reelIndex, turboOn: boolean): void {
        this.reelIndex = reelIndex;
        // TODO set destination symbols from spin data
        //const frame = `symbols/sym_${this.getRandomSymbol(dataPresenter)}`;
        // this.reelStrip[20] = frame;
        // this.reelStrip[21] = frame;
        // this.reelStrip[22] = frame;

        this.stopAnimationsAndResetPicture();

        this.spinStopped = false;
        this.dropDetecedOnThisReel = false;
        this.canStopSpin = false;
        //this.shouldProlong = false;
        //this.isProlongInitial = false;
        this.prolongStarted = false;

        setTimeout(() => {
            this.canStopSpin = true;
        }, this.spinDelay);

        const startingTween = {
            pos: {
                from: ReelSymbol.SIZE.y * 4,
                to: ReelSymbol.SIZE.y * 3.25,
            },
            onStart: (): void => {
                this.symbols[3].deactivateSymbol();
            },
            duration: 200,
            onComplete: (): void => {
                if (turboOn) {
                    setTimeout(() => {
                        this.performFastStop();
                    }, 325);
                }

                setTimeout(
                    () => this.symbols[3].activateSymbol(),
                    100
                );
            },
        };

        const middleTween = {
            pos: {
                from: ReelSymbol.SIZE.y * 3.25,
                to: ReelSymbol.SIZE.y * 22.5,
            },
            duration: 1000 + delay,
            onComplete: (): void => {
                this.scene.game.events.emit(
                    'event-reel-spin-stopping',
                    this.reelIndex
                );
                if (this.isProlongInitial) {
                    this.scene.game.events.emit(
                        'event-start-near-win-prolong',
                        this.reelIndex
                    );
                }
            },
        };

        const oneSpin = ReelSymbol.SIZE.y * 24;

        const nearWinProlongTweens = [
            {
                pos: {
                    from: ReelSymbol.SIZE.y * 3.25,
                    to: (ReelSymbol.SIZE.y * 22.5) + (this.shouldProlong * oneSpin),
                },
                duration: 2200 + this.shouldProlong * delay,
                onComplete: (): void => {
                    this.scene.game.events.emit(
                        'event-reel-spin-stopping',
                        this.reelIndex,
                    );
                    this.scene.game.events.emit(
                        'event-prolong-reel-stopped',
                        [reelIndex,
                            this.dataPresenter.futureReels.screen]
                    );
                    if (this.prolongStarted) {
                        this.prolongStarted = false;
                        this.scene.game.events.emit(
                            'event-near-win-prolong-stopped',
                            this.reelIndex
                        );
                    }
                },
                onCompleteScope: this,
            },
        ];

        const endingTweens = [
            {
                pos: {
                    from: (ReelSymbol.SIZE.y * 22.5) + (this.shouldProlong * oneSpin),
                    to: (ReelSymbol.SIZE.y * 23.5) + (this.shouldProlong * oneSpin),
                    // from: ReelSymbol.SIZE.y * 22.5,
                    // to: ReelSymbol.SIZE.y * 23.5

                },
                duration: 200,
                onStart: (): void => {
                    this.symbols[0].deactivateSymbol();
                },
                ease: Phaser.Math.Easing.Sine.Out,
            },
            {
                pos: {
                    from: (ReelSymbol.SIZE.y * 23.5) + (this.shouldProlong * oneSpin),
                    to: (ReelSymbol.SIZE.y * 23) + (this.shouldProlong * oneSpin),
                    // from: ReelSymbol.SIZE.y * 23.5,
                    // to: ReelSymbol.SIZE.y * 23
                },
                duration: 300,
                onComplete: this.reelSpinCompleted,
                onCompleteScope: this,
                onStart: (): void => this.startDrop(),
            },
        ];

        const tweens = [];
        if (this.shouldProlong) {
            tweens.push(
                startingTween,
                ...nearWinProlongTweens,
                ...endingTweens
            );
        } else {
            tweens.push(startingTween, middleTween, ...endingTweens);
        }

        this.timeline = this.scene.tweens.timeline({
            targets: this,
            onUpdate: () => {
                // before this was calling an update after last tick
                if (!this.spinStopped) {
                    this.positionSymbols();
                }
            },
            onUpdateScope: this,
            ease: 'Linear',
            tweens,
        });
        this.scene.game.events.emit('event-reel-spin-started', this.reelIndex);
        this.symbols[0].activateSymbol();
    }

    startDrop(): void {
        if (!this.spinStopped) {
            this.positionSymbols();
            for (let i = 1; i < this.symbols.length; i++) {
                const detection = this.symbols[i].setStateAnimationDrop();
                if (detection) {
                    this.onDropDetected();
                }
            }
        }
    }

    protected onDropDetected(): void {
        this.dropDetecedOnThisReel = true;
    }

    private checkDroppingSymbols(symbol: SymbolClass): void {
        if (this.dropDetecedOnThisReel) {
            console.log('checkDroppingSymbolsa');
            this.dropDetecedOnThisReel = false;

            if (this.spinStopped) {
                let wasOnThisReel = false;
                for (let i = 1; i < this.symbols.length; i++) {
                    if (this.symbols[i] == symbol) {
                        wasOnThisReel = true;
                    }
                    if (
                        this.symbols[i].currentState ==
                        ReelSymbolStates.dropAnimation
                    ) {
                        this.dropDetecedOnThisReel = true;
                        break;
                    }
                }
                if (wasOnThisReel && !this.dropDetecedOnThisReel) {
                    this.scene.game.events.emit(
                        'event-reel-spin-completed',
                        this.reelIndex
                    );
                }
            }
        }
    }

    updateSymbolsFromData(
        symbolsArray: number[] = [0, 0, 0],
        areFutureReels = false
    ): void {
        symbolsArray = symbolsArray.reverse();
        for (let i = 0; i < 3; i++) {
            this.reelStrip[i + (areFutureReels ? 20 : 1)] = symbolsArray[i];
        }
    }

    reelSpinCompleted(): void {
        this.reelStrip[1] = this.reelStrip[20];
        this.reelStrip[2] = this.reelStrip[21];
        this.reelStrip[3] = this.reelStrip[22];

        // Randomize invisible part of the stripe

        this.reelStrip[0] = this.getRandomSymbol(this.dataPresenter);

        for (let i = 4; i < this.reelStrip.length; i++) {
            this.reelStrip[i] = this.getRandomSymbol(this.dataPresenter);
        }

        this.pos = ReelSymbol.SIZE.y * 4;

        this.positionSymbols();

        this.emit('spin-ended');

        if (!this.dropDetecedOnThisReel) {
            this.scene.game.events.emit(
                'event-reel-spin-completed',
                this.reelIndex
            );
        }
        this.symbols[0].deactivateSymbol();
        this.timeline = null;

        this.spinStopped = true;
    }

    stopAnimationsAndResetPicture(): void {
        this.isFastStopping = false;
        _forEach(this.symbols, (symbol: ReelSymbol) => {
            symbol.anims.stop();
        });
        this.positionSymbols();
    }

    isWild = false;
    wildReelId = -1;
    startSymbolAnimation(symbolRowIndex: number): void {
        const symbol = this.symbols[symbolRowIndex + 1];
        symbol.setStateAnimation(
            symbol.symbolIndex,
            this.dataPresenter.status.freeSpins.totalSpins > 0,
            this.dataPresenter.futureStatus.win >
                this.dataPresenter.futureStatus.bet
        );

        if (symbol.symbolIndex === configSceneReels.wildIndex) {
            this.isWild = true;
            this.wildReelId = this.reelIndex;
        }
    }

    checkWildSymbol(symbolRowIndex: number): void {
        const symbol = this.symbols[symbolRowIndex + 1];

        if (symbol.symbolIndex === configSceneReels.wildIndex) {
            this.isWild = true;
            this.wildReelId = this.reelIndex;
        }
    }

    reducingAlphaofAllSymbols(symbolRowIndex: number): void {
        const symbol = this.symbols[symbolRowIndex + 1];
        symbol.alpha = 0.5;
    }

    resetingAlphaofSymbols(symbolRowIndex: number): void {
        const symbol = this.symbols[symbolRowIndex + 1];
        symbol.alpha = 1;
    }

    startFrameSymbolAnimation(symbolRowIndex: number): void {
        const frameAnim = this.symbols[symbolRowIndex + 1];
        let symboStr = frameAnim.frame.name;
        symboStr = symboStr.replace('symbols/', '');

        const frameString = 'frame_' + symboStr;
        frameAnim.setActive(true).setVisible(true);
        frameAnim.setScale(2);
        frameAnim.play(frameString);
        // frameAnim.setActive(false);
        //    frameAnim.setScale(0.01);
    }

    stopFrameSymbolAnimation(symbolRowIndex: number): void {
        const frameAnim = this.symbols[symbolRowIndex + 1];
        //let symboStr = frameAnim.frame.name;
        //symboStr = symboStr.replace('symbols/', '');

        //const  frameString = 'frame_'+symboStr;
        // frameAnim.setScale(2);
        // frameAnim.play(frameString);
        // frameAnim.setActive(false);
        frameAnim.setScale(0.01);
        frameAnim.setActive(false).setVisible(false);
    }

    performFastStop(): void {
        if (
            this.isFastStopping ||
            this.spinStopped ||
            !this.canStopSpin ||
            THREE_SECOND_RULE
        ) {
            return;
        }
        this.isFastStopping = true;
        console.log('fast stopping,', this.reelIndex);

        //const finalPath = ReelSymbol.SIZE.y * 23;
        const fastStopPart = ReelSymbol.SIZE.y * (23 - 4);

        if (this.pos < fastStopPart) {
            console.log(
                'fast stopping passed,',
                this.reelIndex,
                this.pos / ReelSymbol.SIZE.y,
                fastStopPart / ReelSymbol.SIZE.y
            );
            this.pos = fastStopPart + (this.pos % ReelSymbol.SIZE.y);
            this.timeline && this.timeline.stop();

            this.timeline = this.scene.tweens.timeline({
                targets: this,
                onUpdate: () => {
                    // before this was calling an update after last tick
                    if (!this.spinStopped) {
                        this.positionSymbols();
                    }
                },
                onUpdateScope: this,
                ease: 'Linear',
                tweens: [
                    {
                        pos: {
                            from: this.pos,
                            to: ReelSymbol.SIZE.y * 22.5,
                        },
                        duration: 200,
                        onComplete: (): void => {
                            this.scene.game.events.emit(
                                'event-reel-spin-stopping-fast',
                                this.reelIndex
                            );
                            if (this.prolongStarted) {
                                this.prolongStarted = false;
                                this.scene.game.events.emit(
                                    'event-near-win-prolong-stopped',
                                    this.reelIndex
                                );
                            }
                        },
                    },
                    {
                        pos: {
                            from: ReelSymbol.SIZE.y * 22.5,
                            to: ReelSymbol.SIZE.y * 23.5,
                        },
                        duration: 50,
                        ease: Phaser.Math.Easing.Sine.Out,
                    },
                    {
                        pos: {
                            from: ReelSymbol.SIZE.y * 23.5,
                            to: ReelSymbol.SIZE.y * 23,
                        },
                        duration: 50,
                        onComplete: this.reelSpinCompleted,
                        onCompleteScope: this,
                        // onStart: () => this.startDrop()
                    },
                ],
            });
        }
    }

    getRandomSymbol(dataPresenter: ISlotDataPresenter): number {
        const reelIndex = this.reelIndex;
        let arr = [];
        if (dataPresenter.futureStatus.freeSpins.totalSpins > 0) {
            if (getBonusReelExcludedSymbols()) {
                const bonusSymbols = getBonusReelExcludedSymbols()[reelIndex];

                arr = dataPresenter.symbolsBonus.map((el) =>
                    dataPresenter.symbolsBonus.indexOf(el)
                );

                arr = arr.filter((el) => !bonusSymbols.includes(el));
                return arr[Phaser.Math.Between(0, arr.length - 1)];
            } else {
                return Phaser.Math.Between(
                    0,
                    dataPresenter.symbolsBonus.length - 1
                );
            }
        } else {
            if (getDefaultReelExcludedSymbols()) {
                const defaultSymbols = getDefaultReelExcludedSymbols()[
                    reelIndex
                ];

                arr = dataPresenter.symbols.map((el) =>
                    dataPresenter.symbols.indexOf(el)
                );
                arr = arr.filter((el) => !defaultSymbols.includes(el));
                return arr[Phaser.Math.Between(0, arr.length - 1)];
            } else {
                let rand = this.prevSymbol;
                while (rand == this.prevSymbol) {
                    rand = Phaser.Math.Between(
                        0,
                        dataPresenter.symbols.length - 1
                    );
                }
                this.prevSymbol = rand;
                return this.prevSymbol;
            }
        }
    }
}
