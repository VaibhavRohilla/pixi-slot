import { ComplexAnimation } from '../complexAnimation';
import { ISlotDataPresenter } from '../../../dataPresenter/interfaces';
import {
    animationShowBonusEnd,
    animationStopBonusEnd,
} from './animationShowBonusEnd';

export class AnimationBonusEnd extends ComplexAnimation {
    /*protected*/ animation: Phaser.Animations.Animation = null;

    protected dataPresenter: ISlotDataPresenter = null;
    private timedEvent: Phaser.Time.TimerEvent;

    constructor(
        protected scene: Phaser.Scene,
        public showBonEnd = animationShowBonusEnd,
        public stopBonEnd = animationStopBonusEnd
    ) {
        super(scene, 'bonusEnd');
    }

    protected onStart(data): void {
        console.log('AnimationBonusEnd started');
        // this.timedEvent = this.scene.time.addEvent({delay: 3000, callback: this.animateLineWin, callbackScope: this, loop: false});

        this.showBonEnd(this.scene.game.events, data);

        this.scene.time.addEvent({
            delay: 3000,
            callback: () => this.end(),
            callbackScope: this,
            loop: false,
        });
    }

    protected onEnd(): void {
        this.stopBonEnd(this.scene.game.events);
    }
}
