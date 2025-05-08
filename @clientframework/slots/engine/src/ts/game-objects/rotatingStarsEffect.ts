import { PopupAnimation } from './PopupAnimation';

export interface IConfigRotatingStarsEffect {
    stars: IConfigRotatingStar[];
    key: string;
    textureKey: string;
}

export interface IConfigRotatingStar {
    scale: {
        min: number;
        max: number;
        // higher value is faster
        speed: number;
    };
    // lower value is faster
    rotatingSpeed: number;
    rotateClockwise: boolean;
    opacity: {
        min: number;
        max: number;
        // higher value is faster
        speed: number;
    };
}

export class RotatingStarsEffect {
    protected _nameKey: string;
    protected isActive = false;

    protected rotatingStars: PopupAnimation[] = [];

    // delay between pulsing of scale and opacity for more natural look and feel
    protected opacityPulseDelay: number[];
    protected additionalScale = 1;

    constructor(
        private scene: Phaser.Scene,
        private config: IConfigRotatingStarsEffect
    ) {
        this._nameKey = config.key;

        config.stars.forEach((star) => {
            const starPopup = new PopupAnimation(
                this.scene,
                this._nameKey,
                config.textureKey,
                0,
                null,
                1
            );

            this.rotatingStars.push(starPopup);
        });
        this.initEvents();
    }

    private initEvents(): void {
        this.scene.game.events.on(
            `event-rotatingstar-start-${this._nameKey}`,
            (delay) => {
                this.start(delay);
            }
        );
        this.scene.game.events.on(
            `event-rotatingstar-stop-${this._nameKey}`,
            (duration) => {
                this.stop(duration);
            }
        );
    }

    protected start(delay = 0): void {
        // reinitialize delay every time the animation starts
        this.opacityPulseDelay = [];
        this.resetAdditionalScale();
        setTimeout(() => {
            for (let i = 0; i < this.rotatingStars.length; i++) {
                this.opacityPulseDelay[i] = Phaser.Math.Between(
                    0,
                    this.config.stars[i].opacity.speed
                );
                this.rotatingStars[i].setScale(this.config.stars[i].scale.min);
                this.rotatingStars[i].startAnim(0);
            }
            this.isActive = true;
        }, delay);
    }

    protected stop(duration = 500): void {
        this.isActive = false;
        for (let i = 0; i < this.rotatingStars.length; i++) {
            this.rotatingStars[i].fadeOutAndStop(duration);
        }
    }

    update(): void {
        if (
            this.isActive &&
            this.rotatingStars &&
            this.rotatingStars.length > 0
        ) {
            for (let i = 0; i < this.rotatingStars.length; i++) {
                if (!this.rotatingStars[i].isScalingUp) {
                    // takes into account additional scaling and scales in a wave like fashion
                    // from min to max and back using cosine
                    this.rotatingStars[i].setScale(
                        this.additionalScale *
                            (this.config.stars[i].scale.min +
                                (this.config.stars[i].scale.max -
                                    this.config.stars[i].scale.min) /
                                    2 +
                                Math.cos(
                                    (this.scene.time.now / 1000) *
                                        this.config.stars[i].scale.speed
                                ) *
                                    ((this.config.stars[i].scale.max -
                                        this.config.stars[i].scale.min) /
                                        2))
                    );
                }
                // from min to max and back using cosine
                this.rotatingStars[i].setAlpha(
                    this.config.stars[i].opacity.min +
                        (this.config.stars[i].opacity.max -
                            this.config.stars[i].opacity.min) /
                            2 +
                        Math.cos(
                            (this.scene.time.now / 1000) *
                                this.config.stars[i].opacity.speed
                        ) *
                            ((this.config.stars[i].opacity.max -
                                this.config.stars[i].opacity.min) /
                                2)
                );
                const angle =
                    (this.scene.time.now / this.config.stars[i].rotatingSpeed) %
                    360;
                if (this.config.stars[i].rotateClockwise) {
                    this.rotatingStars[i].sprite.setAngle(angle);
                } else {
                    this.rotatingStars[i].sprite.setAngle(360 - angle);
                }
            }
        }
    }

    setTexture(textureKey: string): void {
        this.rotatingStars.forEach((star) => {
            star.sprite.setTexture(textureKey);
        });
    }

    resetTexture(): void {
        this.setTexture(this.config.textureKey);
    }

    setPosition(x: number, y: number): void {
        this.rotatingStars.forEach((star) => {
            star.setPosition(x, y);
        });
    }

    scaleOverTime(scale: number, duration: number): void {
        // additional scale is taken into account in the update() function
        const startingScale = this.additionalScale;
        const tween = this.scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration: duration,
            onUpdate: () => {
                this.additionalScale =
                    startingScale + tween.getValue() * (scale - startingScale);
            },
        });
    }

    resetAdditionalScale(): void {
        this.additionalScale = 1;
    }
}
