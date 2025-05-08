import {
    reelSymbolConfig,
    SYMBOLS_SCALE_ANIM,
    SYMBOLS_SCALE_DEFAULT,
    SYMBOLS_FPS,
} from '@specific/config';
import { PopupAnimation } from './PopupAnimation';
import { IWinFramesConfig } from './WinPopupAnimation';
import {
    getAnimateSymbolsWinframeInFreeSpins,
    getSymbolsAnimReverseOrder,
} from '../dataPresenter/defaultConfigSlot';
import Reel from './Reel';

export enum ReelSymbolStates {
    idle = 'idle',
    animation = 'animation',
    dropAnimation = 'dropAnimation',
}

export default class ReelSymbol extends Phaser.GameObjects.Sprite {
    static SIZE = { x: reelSymbolConfig.x, y: reelSymbolConfig.y };
    static DROP_ANIM_INDEXES = [];

    private _symbolIndex = 0;

    private _currentState: ReelSymbolStates = ReelSymbolStates.idle;

    winFrameAnim: PopupAnimation = null;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        frame: string | number,
        protected winFrameConfig?: IWinFramesConfig
    ) {
        super(scene, x, y, 'symbols', frame);

        this.setScale(1); //ReelSymbol.SIZE.x/this.width);

        if (winFrameConfig) {
            this.winFrameAnim = new PopupAnimation(
                scene,
                'winFrameAnim',
                'winFrameAnim',
                winFrameConfig.frameRate,
                winFrameConfig.animationFrames,
                winFrameConfig.scaleFactor
            );
            this.winFrameAnim.sprite.setDepth(0);
        }

        scene.add.existing(this);

        this.on(
            'animationcomplete',
            () => {
                this.setStateDefault();
            },
            this
        );
    }

    // set symbolIndex(value: number) {
    //     this.setSymbolIndex(value);
    // }

    protected setSymbolIndex(value: number): void {
        this._symbolIndex = value;
        this.setFrame(`symbols/sym_${this.symbolIndex}`);
    }

    get symbolIndex(): number {
        return this._symbolIndex;
    }

    get currentState(): ReelSymbolStates {
        return this._currentState;
    }

    protected setCurrentState(newState: ReelSymbolStates): void {
        if (this.currentState != newState) {
            const oldState = this.currentState;
            this._currentState = newState;

            if (oldState == ReelSymbolStates.dropAnimation) {
                this.scene.game.events.emit(
                    'event-symbol-dropAnimation-ended',
                    this
                );
            }
            if (newState == ReelSymbolStates.dropAnimation) {
                this.scene.game.events.emit(
                    'event-symbol-dropAnimation-started',
                    this
                );
            }
        }
    }

    setStateDefault(symbolIndex?: number): void {
        //console.log("!!!!!STATIC!!!")

        if (this.texture.key != 'symbolsDefault') {
            this.setTexture('symbolsDefault');
        }

        if (symbolIndex != undefined) {
            this._symbolIndex = symbolIndex;
        }
        this.setSymbolIndex(this.symbolIndex);

        if (SYMBOLS_SCALE_DEFAULT.length > 1) {
            this.setScale(
                SYMBOLS_SCALE_DEFAULT[this.symbolIndex].x,
                SYMBOLS_SCALE_DEFAULT[this.symbolIndex].y
            );
        } else {
            this.setScale(
                SYMBOLS_SCALE_DEFAULT[0].x,
                SYMBOLS_SCALE_DEFAULT[0].y
            );
        }

        const oldState = this.currentState;
        this.setCurrentState(ReelSymbolStates.idle);

        if (this.winFrameAnim && oldState != this.currentState) {
            this.winFrameAnim.setPosition(this.x, this.y);
            if (
                this.winFrameConfig &&
                this.winFrameConfig.hasOwnProperty('scaleAnim')
            ) {
                this.winFrameAnim.setScale(this.winFrameConfig.scaleAnim);
            }
            this.winFrameAnim.fadeOutAndStop(0);
        }
    }

    setStateAnimation(
        symbolIndex?: number,
        isFreeSpins?: boolean,
        winGreaterThanBet?: boolean
    ): void {
        winGreaterThanBet;
        if (SYMBOLS_FPS > 0) {

            //console.log("!!!!!ANIM!!!")
            if (this.texture.key != 'symbols') {
                this.setTexture('symbols');
            }

            if (symbolIndex != undefined) {
                this._symbolIndex = symbolIndex;
            }
            this.setSymbolIndex(this.symbolIndex);

            if (getSymbolsAnimReverseOrder()) {
                this.play(`sym_${this.symbolIndex}`);
            }

            if (SYMBOLS_SCALE_ANIM.length > 1) {
                this.setScale(
                    SYMBOLS_SCALE_ANIM[this.symbolIndex].x,
                    SYMBOLS_SCALE_ANIM[this.symbolIndex].y
                );
            } else {
                this.setScale(SYMBOLS_SCALE_ANIM[0].x, SYMBOLS_SCALE_ANIM[0].y);
            }

            if (!getSymbolsAnimReverseOrder()) {
                this.play(`sym_${this.symbolIndex}`);
            }
        }

        const oldState = this.currentState;
        this.setCurrentState(ReelSymbolStates.animation);

        if (
            (getAnimateSymbolsWinframeInFreeSpins() || !isFreeSpins) &&
            this.winFrameAnim &&
            oldState != this.currentState
        ) {
            const offsetX =
                this.winFrameConfig && this.winFrameConfig.offsetAnim
                    ? this.winFrameConfig.offsetAnim.x
                    : 0;
            const offsetY =
                this.winFrameConfig && this.winFrameConfig.offsetAnim
                    ? this.winFrameConfig.offsetAnim.y
                    : 0;
            this.winFrameAnim.setPosition(this.x + offsetX, this.y + offsetY);
            if (
                this.winFrameConfig &&
                this.winFrameConfig.hasOwnProperty('scaleAnim')
            ) {
                this.winFrameAnim.setScale(this.winFrameConfig.scaleAnim);
            }
            this.winFrameAnim.startAnim(0);
        }
    }

    setStateAnimationDrop(symbolIndex?: number): boolean {
        let sym = this._symbolIndex;
        if (symbolIndex != undefined) {
            sym = symbolIndex;
        }

        if (ReelSymbol.DROP_ANIM_INDEXES.includes(sym)) {
            //console.log("!!!!!ANIM!!!")
            if (this.texture.key != 'symbols') {
                this.setTexture('symbols');
            }

            if (symbolIndex != undefined) {
                this._symbolIndex = symbolIndex;
            }

            this.setSymbolIndex(this.symbolIndex);

            if (SYMBOLS_SCALE_ANIM.length > 1) {
                this.setScale(
                    SYMBOLS_SCALE_ANIM[this.symbolIndex].x,
                    SYMBOLS_SCALE_ANIM[this.symbolIndex].y
                );
            } else {
                this.setScale(SYMBOLS_SCALE_ANIM[0].x, SYMBOLS_SCALE_ANIM[0].y);
            }

            this.play(`sym_${this.symbolIndex}_drop`);

            this.setCurrentState(ReelSymbolStates.dropAnimation);

            return true;
        }

        return false;
    }

    deactivateSymbol(): void {
        this.setActive(false).setVisible(false).setAlpha(1);
    }

    activateSymbol(): void {
        this.setActive(true).setVisible(true).setAlpha(1);
    }

    setSymbolsMask() {
        this.setMask(this.mask);
    }

    addtoReel(reel: Reel) {
        reel.add(this);
    }

    resize(): void {
        //
    }
}
