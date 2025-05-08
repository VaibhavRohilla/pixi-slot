import { IPointData } from '../dataPresenterVisual/iPointData';

export enum WinAnimationType {
    win = 'win',
    winx2 = 'winx2',
}

export interface IConfigWinPopupAnimation {
    scaleFactor: number;
    generateFrames: (
        scene: Phaser.Scene,
        textureKey: string
    ) => Phaser.Types.Animations.AnimationFrame[];
    frameRate: number;
    shouldDo: boolean;
    levels?: { key: string; multipliedBy: number }[];
}

export interface IWinFramesConfig {
    scaleFactor: number;
    frameRate: number;
    animationFrames: Phaser.Types.Animations.AnimationFrame[];
    scaleAnim?: number;
    offsetAnim?: IPointData;
}

export class WinPopupAnimation {
    protected textureKey = '';
    protected winSprite: Phaser.GameObjects.Sprite = null;
    protected hasAnimation = false;

    showTween: Phaser.Tweens.Tween = null;

    constructor(
        protected scene: Phaser.Scene,
        private _nameKey: string,
        protected winType: string,
        private config: IConfigWinPopupAnimation
    ) {
        this.textureKey = this.winType.toString();

        const winFrames = this.config.generateFrames(
            this.scene,
            this.textureKey
        );

        this.winSprite = scene.add.sprite(
            scene.scale.gameSize.width / 2,
            scene.scale.gameSize.height / -2,
            this.textureKey
        );

        if (winFrames) {
            this.hasAnimation = true;
            scene.anims.create({
                key: this.textureKey,
                repeat: 0,
                frames: winFrames,
                frameRate: this.config.frameRate || 30,
            });

            this.winSprite.on(
                'animationcomplete',
                () => {
                    this.winSprite
                        .setActive(false)
                        .setVisible(false)
                        .setAlpha(1);
                },
                this
            );
        }

        this.winSprite.setDepth(100);
        this.setScale(1);
        this.winSprite.setActive(false).setVisible(false).setAlpha(1);

        scene.game.events.on(
            `event-start-winpopup-${this._nameKey}`,
            this.startAnim,
            this
        );
        scene.game.events.on(
            `event-stop-winpopup-${this._nameKey}`,
            this.stopAnim,
            this
        );

        scene.game.events.on('event-stop-winpopup-any', this.stopAnim, this);
    }

    startAnim(winType: WinAnimationType, duration = -1, delay = 0): void {
        setTimeout(() => {
            this.showTween && this.showTween.stop();
            if (this.hasAnimation) {
                this.winSprite.anims.stop();
                this.winSprite.setActive(true).setVisible(true).setAlpha(1);

                if (duration > -1) {
                    this.scene.anims.get(this.textureKey).repeat = -1;
                    this.scene.anims.play(this.textureKey, this.winSprite);

                    if (duration > 0) {
                        setTimeout(() => {
                            this.stopAnim();
                        }, duration);
                    }
                } else {
                    this.scene.anims.get(this.textureKey).repeat = 0;
                    this.scene.anims.play(this.textureKey, this.winSprite);
                }
            } else {
                this.winSprite.setActive(true).setVisible(true).setAlpha(0);

                this.showTween = this.scene.add.tween({
                    targets: this.winSprite,
                    duration: 500,
                    alpha: 1,
                    ease: 'Linear',
                });
            }
        }, delay);
    }

    stopAnim(): void {
        this.showTween && this.showTween.stop();
        this.showTween = this.scene.add.tween({
            targets: this.winSprite,
            duration: 500,
            alpha: 0,
            ease: 'Linear',
            onComplete: () => {
                this.hasAnimation && this.winSprite.anims.stop();
            },
        });
    }

    setPosition(x: number, y: number): void {
        this.winSprite.x = x;
        this.winSprite.y = y;
    }

    setScale(scale: number): void {
        this.winSprite.setScale(this.config.scaleFactor * scale);
    }
}
