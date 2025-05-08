import { ComplexAnimation } from '../complexAnimation';
import { ISlotDataPresenter } from '../../../dataPresenter/interfaces';
import { animationShowLineWin } from './animationShowLineWin';
import { animationShowLineWinStop } from './animationShowLineWinStop';
import { animationShowAllLineWins } from './animationShowAllLineWins';
import { IReelCoordinatesData } from '../../../dataPresenterVisual/iReelCoordinatesData';

export interface IConfigAnimationWin {
    allLinesDuration: number;
    lineByLineDuration: number;
    backgroundWinDuration: number;
    winStaysConstantlyInFreeSpins: boolean;
    showNearLineAmounts: boolean;
    winTextForcedY?: (data: IReelCoordinatesData) => number;
    winTextHasBackLight: boolean;
    lineWinTextScaleFactor?: number;
}

export class AnimationWin extends ComplexAnimation {
    protected dataPresenter: ISlotDataPresenter = null;
    protected currentLineWinIndex = 0;
    private timedEvent: Phaser.Time.TimerEvent;
    backgroundWinEmitted = false;
    lineAndScatterWins = [];

    constructor(
        protected scene: Phaser.Scene,
        private configAnimationWin: IConfigAnimationWin
    ) {
        super(scene, 'win');

        scene.game.events.on(
            'event-state-StatePresentWin-onEnter',
            this.start,
            this
        );
        scene.game.events.on(
            'event-state-StateAskServerBeforeSpin-onEnter',
            this.end,
            this
        );
    }

    protected onStart(data: ISlotDataPresenter): void {
        console.log('animation-win onStart. data = ', data);
        this.dataPresenter = JSON.parse(JSON.stringify(data));

        this.currentLineWinIndex = 0;

        this.lineAndScatterWins = [
            ...this.dataPresenter.winDescription.lineWins,
            ...this.dataPresenter.winDescription.scatterWins,
        ];
        console.log(
            'animation-win onStart. this.lineAndScatterWins = ',
            this.lineAndScatterWins
        );

        if (this.lineAndScatterWins.length > 0) {
            console.log('WWWWIIIIINNNN!!!!!!!');
            animationShowAllLineWins(
                this.scene.game.events,
                this.dataPresenter,
                this.configAnimationWin.backgroundWinDuration
            );
            if (
                this.dataPresenter.betAndAutospin.currentAutospin == 0 &&
                this.lineAndScatterWins.length > 1
            ) {
                this.timedEvent = this.scene.time.addEvent({
                    delay: this.configAnimationWin.allLinesDuration,
                    callback: () => {
                        this.timedEvent && this.timedEvent.remove(false); //If true, the function of the Timer Event will be called before its removal.
                        this.animateLineWin();
                        this.timedEvent = this.scene.time.addEvent({
                            delay: this.configAnimationWin.lineByLineDuration,
                            callback: this.animateLineWin,
                            callbackScope: this,
                            loop: true,
                        });
                    },
                    callbackScope: this,
                    loop: false,
                });
            } else {
                setTimeout(() => {
                    this.scene.game.events.emit('event-stop-bigwin-win');
                }, this.configAnimationWin.lineByLineDuration);
            }
        } else {
            this.end();
        }

        this.backgroundWinEmitted = true;
        this.scene.game.events.emit('event-animate-background-win');
    }

    protected animateLineWin(): void {
        const lineWin = this.lineAndScatterWins[this.currentLineWinIndex];
        console.log('animateLineWin', lineWin);
        animationShowLineWin(this.scene.game.events, lineWin);

        this.currentLineWinIndex++;
        if (this.currentLineWinIndex >= this.lineAndScatterWins.length) {
            this.currentLineWinIndex = 0;
        }
    }

    protected onEnd(): void {
        console.log('Win anim end');
        this.timedEvent && this.timedEvent.remove(false); //If true, the function of the Timer Event will be called before its removal.
        this.timedEvent = null;
        animationShowLineWinStop(this.scene.game.events);
        if (this.backgroundWinEmitted) {
            this.backgroundWinEmitted = false;
            this.scene.game.events.emit('event-animate-background-idle');
        }
    }
}
