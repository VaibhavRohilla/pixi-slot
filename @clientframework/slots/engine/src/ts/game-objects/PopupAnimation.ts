import _sortBy from 'lodash-es/sortBy';

export class PopupAnimation {
    protected _sprite: Phaser.GameObjects.Sprite = null;

    protected currentScale = 1;

    protected showingTween;
    protected hasAnims = false;
    protected started = false;
    protected delayAfterAnim = 0;
    isScalingUp = true;

    protected scaleFactorX = 1.5;
    protected scaleFactorY = 1.5;

    constructor(
        protected scene: Phaser.Scene,
        protected _nameKey: string,
        protected texture: string,
        frameRate = 25,
        frames?: Phaser.Types.Animations.AnimationFrame[],
        scaleFactor = 1.5,
        scaleFactorY?: number
    ) {
        this.scaleFactorX = this.scaleFactorY = scaleFactor;
        if (scaleFactorY != undefined) {
            this.scaleFactorY = scaleFactorY;
        }

        if (frameRate > 0) {
            if (!frames) {
                frames = scene.anims.generateFrameNames(this.texture);
                frames = _sortBy(frames, ['frame']);
            }

            scene.anims.create({
                key: `${this.texture}-${this._nameKey}`,
                repeat: 0,
                frames,
                frameRate,
            });
            this.hasAnims = true;
        }

        this._sprite = scene.add.sprite(0, 0, this.texture);

        this._sprite.setDepth(100);
        this.setScale(1);
        this._sprite.setActive(false).setVisible(false).setAlpha(1);

        this._sprite.on(
            'animationcomplete',
            () => {
                if (this.started) {
                    this.scene.game.events.emit(
                        `event-animationcomplete-popup-${this._nameKey}`
                    );
                }
                if (this.delayAfterAnim > 0 && this.started) {
                    this.scene.time.addEvent({
                        delay: this.delayAfterAnim,
                        callback: () => {
                            this.fadeOutAndStop();
                        },
                        callbackScope: this,
                        loop: false,
                    });
                } else {
                    this.stopAnim();
                }
            },
            this
        );

        scene.game.events.on(
            `event-start-popup-${this._nameKey}`,
            this.startAnim,
            this
        );
        scene.game.events.on(
            `event-stop-popup-${this._nameKey}`,
            this.fadeOutAndStop,
            this
        );
    }

    get sprite(): Phaser.GameObjects.Sprite {
        return this._sprite;
    }

    private stopAnim(): void {
        this._sprite.setActive(false).setVisible(false).setAlpha(1);
        if (this.started) {
            this.started = false;
            this.scene.game.events.emit(`event-stopped-popup-${this._nameKey}`);
        }
    }

    startAnim(animDuration = -1, multiplier = 1): void {
        multiplier;

        this.scene.game.events.emit(`event-started-popup-${this._nameKey}`);
        this.started = true;
        console.log('on start anim', this._nameKey);
        this._sprite.setActive(true).setVisible(true).setAlpha(0).setScale(1);

        if (this.hasAnims) {
            if (animDuration > -1) {
                this.scene.anims.get(
                    `${this.texture}-${this._nameKey}`
                ).repeat = -1;
                this.scene.anims.play(
                    `${this.texture}-${this._nameKey}`,
                    this._sprite
                );

                if (animDuration > 0) {
                    this.scene.time.addEvent({
                        delay: animDuration,
                        callback: () => {
                            this.fadeOutAndStop();
                        },
                        callbackScope: this,
                        loop: false,
                    });
                }
            } else {
                this.scene.anims.get(
                    `${this.texture}-${this._nameKey}`
                ).repeat = 0;
                this.scene.anims.play(
                    `${this.texture}-${this._nameKey}`,
                    this._sprite
                );
            }
        } else {
            if (animDuration > 0) {
                this.scene.time.addEvent({
                    delay: animDuration,
                    callback: () => {
                        this.fadeOutAndStop();
                    },
                    callbackScope: this,
                    loop: false,
                });
            }
        }

        this.showingTween && this.showingTween.stop();
        if (this.shouldPulsing) {
            this.startPulsing(-1, this.pulseDuration);
        } else {
            this.showingTween = this.scene.add.tween({
                targets: this._sprite,
                duration: 100,
                alpha: '1',
                ease: 'Linear',
            });
        }

        if (this.isScalingUp) {
            this._sprite.setScale(0.05);
            this.scene.add.tween({
                targets: this._sprite,
                duration: 300,
                scaleX: this.currentScale * this.scaleFactorX,
                scaleY: this.currentScale * this.scaleFactorY,
                ease: 'Linear',
                onComplete: () => {
                    this.isScalingUp = false;
                    this.setScale(this.currentScale);
                },
            });
        } else {
            this.setScale(this.currentScale);
        }
    }

    fadeOutAndStop(duration = 500): void {
        this.scene.game.events.emit(
            `event-stopping-popup-${this._nameKey}`,
            duration
        );
        this.showingTween && this.showingTween.stop();
        if (duration > 0) {
            this.showingTween = this.scene.add.tween({
                targets: this._sprite,
                duration: duration,
                alpha: 0,
                ease: 'Linear',
                onComplete: () => {
                    this.stopAnim();
                    this._sprite.anims.stop();
                },
            });
        } else {
            this.stopAnim();
            this._sprite.anims.stop();
        }
    }

    setPosition(x: number, y: number): void {
        this._sprite.x = x;
        this._sprite.y = y;
    }

    setScale(scale: number, scaleFactor?: number, scaleFactorY?: number): void {
        this.currentScale = scale;
        if (scaleFactor != undefined) {
            this.scaleFactorX = this.scaleFactorY = scaleFactor;
            if (scaleFactorY != undefined) {
                this.scaleFactorY = scaleFactorY;
            }
        }
        this._sprite.setScale(
            this.scaleFactorX * this.currentScale,
            this.scaleFactorY * this.currentScale
        );
    }

    getCurrentScale(): number {
        return this.currentScale;
    }

    setOrigin(x: number, y: number): void {
        this._sprite.setOrigin(x, y);
    }

    getPosition(): {
        x: number;
        y: number;
        width: number;
        height: number;
        scale: number;
    } {
        return {
            x: this._sprite.x,
            y: this._sprite.y,
            width: this._sprite.width,
            height: this._sprite.height,
            scale: this._sprite.scale,
        };
    }

    setFrame(frame: string | number): void {
        this._sprite.setFrame(frame);
    }

    resetFrame(): void {
        this._sprite.setActive(false).setVisible(false).setAlpha(1);
    }

    setDelayAfterAnim(value: number): void {
        this.delayAfterAnim = value;
    }

    setIsScalingUp(value: boolean): void {
        this.isScalingUp = value;
    }

    protected pulseDuration = 1000;
    protected shouldPulsing = false;
    setShouldPulsing(value: boolean, pulseDuration = 1000): void {
        this.pulseDuration = pulseDuration;
        this.shouldPulsing = value;
    }

    startPulsing(repeat = 0, pulseDuration: number): void {
        this.pulseDuration = pulseDuration;
        const fi = Math.PI / 8;
        this.showingTween && this.showingTween.stop();
        this.showingTween = this.scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration: this.pulseDuration,
            onUpdate: () => {
                this.sprite.setAlpha(this.showingTween.getValue());
                const v = this.showingTween.getValue();
                const a = Math.cos(2 * Math.PI * v + fi);
                this.sprite.setAlpha((1 - a) / 2);
            },
            loop: repeat != 0 ? -1 : 0,
            loopDelay: 0,
        });
    }

    protected _shouldEmitRepeatEvents = false;
    shouldEmitRepeatEvents(value: boolean): void {
        if (!this._shouldEmitRepeatEvents && value) {
            this._sprite.on(
                `animationrepeat-${this.texture}-${this._nameKey}`,
                () => {
                    this.scene.game.events.emit(
                        `animationrepeat-${this._nameKey}`
                    );
                },
                this
            );
        }
        this._shouldEmitRepeatEvents = value;
    }

    setAlpha(value: number): void {
        this._sprite.setAlpha(value);
    }
}
