import AnimatedParticle from './AnimatedParticle';
import { IPointData } from '../../dataPresenterVisual/iPointData';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';
import _sortBy from 'lodash-es/sortBy';

type inputCoordinate = number | { min: number; max: number };

export enum BigWinAnimationType {
    lineWin = 'lineWin',
    midWin = 'midWin',
    bigWin = 'bigWin',
    megaWin = 'megaWin',
}

export interface IConfigParticleWinAnimation {
    generateParticleNames: (
        scene: Phaser.Scene,
        animTextureKey: string
    ) => Phaser.Types.Animations.AnimationFrame[][];
    frameRate: number;
}

export class ParticleWinAnimation {
    protected emitter: Phaser.GameObjects.Particles.ParticleEmitter = null;
    protected emitterConfiguration: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = null;
    protected particles: Phaser.GameObjects.Particles.ParticleEmitterManager = null;
    protected winType: BigWinAnimationType = null;
    protected position: IPointData;

    get nameKey(): string {
        return this._nameKey;
    }

    setEmitterPosition(x: number, y: number): void {
        this.position = { x, y };
        // if(this.emitter) {
        //     this.emitter.setPosition(this.position.x, this.position.y);
        // }
    }

    getEmitterPosition(): {
        x: number;
        y: number;
    } {
        if (this.emitter && this.emitter.y && this.emitter.x) {
            return {
                x: this.emitter.x.propertyValue,
                y: this.emitter.y.propertyValue,
            };
        }
        return { x: null, y: null };
    }

    constructor(
        protected scene: Phaser.Scene,
        private _nameKey: string,
        animTextureKey: string,
        config: IConfigParticleWinAnimation
    ) {
        if (AnimatedParticle.anim.length == 0) {
            const frames = config.generateParticleNames(
                this.scene,
                animTextureKey
            );
            if (frames) {
                for (let i = 0; i < frames.length; i++) {
                    AnimatedParticle.anim.push(
                        <Phaser.Animations.Animation>this.scene.anims.create({
                            key: `animateParticle${i}`,
                            repeat: -1,
                            frames: frames[i],
                            frameRate: config.frameRate,
                        })
                    );
                }
            } else {
                const frames = this.scene.anims.generateFrameNames(
                    animTextureKey
                );
                _sortBy(frames, ['frame']);

                AnimatedParticle.anim.push(
                    <Phaser.Animations.Animation>this.scene.anims.create({
                        key: 'animateParticle',
                        repeat: -1,
                        frames: frames,
                        frameRate: config.frameRate,
                    })
                );
            }
        }

        this.particles = this.scene.add.particles(animTextureKey);
        this.particles.setDepth(101);
        this.position = { x: null, y: null };

        this.scene.game.events.on(
            `event-start-bigwin-${this._nameKey}`,
            this.startAnim,
            this
        );
        this.scene.game.events.on(
            `event-stop-bigwin-${this._nameKey}`,
            this.stopAnim,
            this
        );
    }

    startAnim(winType: BigWinAnimationType, duration = -1): void {
        this.winType = winType;
        this.emitter = this.getOrSetEmitter(
            this.emitter,
            this.scene,
            this.winType,
            this.position.x,
            this.position.y
        );

        this.emitter.start();
        // this.emitter.on = true;

        if (winType === BigWinAnimationType.lineWin) {
            duration = 333;
        }

        if (duration != -1) {
            setTimeout(() => {
                this.stopAnim(winType);
            }, duration);
        }
    }

    stopAnim(winType?: BigWinAnimationType): void {
        winType;

        if (this.emitter) {
            this.emitter.stop();
        }
        // this.emitter.on = false;
    }

    /*protected*/ resizeIntern(gameSize: Phaser.Structs.Size): void {
        gameSize;
        if (this.emitter !== null && this.emitter.active) {
            //console.log('isactive');
            this.getOrSetEmitter(this.emitter, this.scene, this.winType);
        }
    }

    protected getOrSetEmitter(
        emitter: Phaser.GameObjects.Particles.ParticleEmitter,
        scene: Phaser.Scene,
        winType: BigWinAnimationType,
        x: number = this.position.x,
        y: number = this.position.y
    ): Phaser.GameObjects.Particles.ParticleEmitter {
        const config = this.emitterConfigurationByWinTypeKey(
            scene,
            winType,
            x,
            y
        );

        if (emitter === null) {
            return this.particles.createEmitter(config);
        }

        emitter.maxParticles = config.maxParticles;
        emitter.setPosition(config.x, config.y);
        emitter.setFrequency(config.frequency, config.quantity);
        emitter.setAngle(config.angle);
        emitter.setSpeed(config.speed);
        emitter.setGravityY(config.gravityY);
        emitter.setScale(config.scale);
        emitter.setLifespan(config.lifespan);
        emitter.particleBringToTop = config.particleBringToTop;
        emitter.particleClass = config.particleClass;

        return emitter;
    }

    emitterConfigurationByWinTypeKey(
        scene: Phaser.Scene,
        winType: BigWinAnimationType,
        x: number,
        y: number
    ): Phaser.Types.GameObjects.Particles.ParticleEmitterConfig {
        let isIphone = false;
        // temporary fix for pixelisation issue. old system only left on iphone
        if (navigator.userAgent.includes('iPhone')) {
            isIphone = true;
        }

        let isPort = globalGetIsPortrait(scene);
        // if its desktop
        if (!navigator.userAgent.includes('Mobile')) {
            const aspectRatio =
                document.documentElement.clientWidth /
                document.documentElement.clientHeight;
            isPort = aspectRatio <= 1;
        }

        let aspectRatio = 1;
        if (isIphone) {
            aspectRatio =
                document.documentElement.clientWidth /
                document.documentElement.clientHeight;
        } else {
            aspectRatio = isPort ? 1080 / 1920 : 1920 / 1080;
        }

        const isPortrait = aspectRatio < 1;
        let shootFactor = 3.5;
        if (isPortrait) {
            shootFactor /= aspectRatio;
        }

        let angleOffset: number;
        let speedModifier: number;
        let frequency: number;
        let gravityY: number;
        let quantity: inputCoordinate;
        let emitterX: inputCoordinate;

        let scale: number | { start: number; end: number } = 1;
        const particleCount = 0; // emitter.maxParticles = unlimited (0)
        const lifespan = 7000;

        if (x === null) {
            this.position.x = scene.scale.gameSize.width / 2;
        } else {
            this.position.x = x;
        }

        if (!isIphone && winType != BigWinAnimationType.lineWin) {
            this.position.x = (isPort ? 1080 : 1920) / 2; //scene.scale.gameSize.width / 2;
        }

        if (y === null && this.position.y === null) {
            this.position.y = 300; //scene.scale.gameSize.height + 40;
            if (
                this.winType !== BigWinAnimationType.lineWin &&
                !isPortrait &&
                !isIphone
            ) {
                this.position.y = 100;
            }
        } else if (this.position.y === null) {
            this.position.y = y;
        }

        switch (winType) {
            case BigWinAnimationType.megaWin:
                emitterX = this.position.x;
                frequency = 400;
                quantity = 15;
                angleOffset = 10;
                speedModifier = 850;
                gravityY = 2200;
                if (isIphone) {
                    scale = { start: 1, end: 1.75 };
                } else {
                    scale = { start: 2, end: 2.75 };
                }
                break;
            case BigWinAnimationType.bigWin:
                emitterX = {
                    min: this.position.x - scene.scale.gameSize.width / 6,
                    max: this.position.x + scene.scale.gameSize.width / 6,
                }; //{min: x / 3, max: x - x / 3};
                frequency = 120;
                quantity = 3;
                angleOffset = 10;
                speedModifier = 700;
                gravityY = 2000;
                if (isIphone) {
                    scale = { start: 1, end: 1.5 };
                } else {
                    scale = { start: 2, end: 2.5 };
                }
                break;
            case BigWinAnimationType.midWin:
                emitterX = {
                    min: this.position.x - 100,
                    max: this.position.x + 100,
                };
                quantity = 1;
                frequency = 100;
                angleOffset = 15;
                speedModifier = 600;
                gravityY = 2000;
                if (!isPortrait && !isIphone) {
                    speedModifier = 665;
                    gravityY = 2100;
                }
                if (isIphone) {
                    scale = { start: 1, end: 1.15 };
                } else {
                    scale = { start: 2, end: 2.15 };
                }
                break;
            case BigWinAnimationType.lineWin:
            default:
                emitterX = {
                    min: this.position.x - scene.scale.gameSize.width / 6,
                    max: this.position.x + scene.scale.gameSize.width / 6,
                }; //{min: x / 3, max: x - x / 3};
                quantity = 1;
                frequency = 7;
                angleOffset = 15;
                speedModifier = 200;
                gravityY = 2300;
                if (isIphone) {
                    scale = { start: 1, end: 2 };
                } else {
                    scale = { start: 1.55, end: 1.7 };
                }
                //particleCount = 50;
                break;
        }

        const emitterY = this.position.y;
        angleOffset *= aspectRatio <= 1.75 ? aspectRatio : 1.75;
        const angle = { min: -90 - angleOffset, max: -90 + angleOffset };
        const baseLineSpeed = shootFactor * speedModifier;
        const rangeOffset = baseLineSpeed / 17;
        if (isPortrait) {
            gravityY /= aspectRatio;
        }
        const speed = {
            min: baseLineSpeed - rangeOffset,
            max: baseLineSpeed + rangeOffset,
        };
        // console.log("baseLineSpeed", baseLineSpeed);

        if (isIphone) {
            scale.start /= scene.cameras.main.zoom;
            scale.end /= scene.cameras.main.zoom;
        } else {
            scale.start *=
                scene.scene.get('WinAnimations').cameras.main.zoom /
                scene.cameras.main.zoom;
            scale.end *=
                scene.scene.get('WinAnimations').cameras.main.zoom /
                scene.cameras.main.zoom;
        }

        return {
            x: emitterX,
            y: emitterY,
            quantity: quantity,
            maxParticles: particleCount,
            frequency: frequency,
            angle: angle,
            speed: speed,
            gravityY: gravityY,
            scale: scale,
            lifespan: lifespan,
            particleBringToTop: false,
            // @ts-ignore
            particleClass: AnimatedParticle,
        };
    }
}
