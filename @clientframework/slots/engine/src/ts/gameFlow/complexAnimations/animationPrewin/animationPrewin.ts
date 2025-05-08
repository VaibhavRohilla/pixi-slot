import { ComplexAnimation } from '../complexAnimation';
import { doPrewinAnimation } from '@specific/specifics/doPrewinAnimation';

export class AnimationPrewin extends ComplexAnimation {
    constructor(protected scene: Phaser.Scene) {
        super(scene, 'prewin');
    }

    protected onStart(data): void {
        doPrewinAnimation(this.scene, this.scene.game.events, data);
    }

    protected onEnd(): void {
        //hook
    }
}
