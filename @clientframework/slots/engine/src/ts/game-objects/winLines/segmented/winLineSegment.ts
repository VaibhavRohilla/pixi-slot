import _sortBy from 'lodash-es/sortBy';
import { IPointData } from '../../../dataPresenterVisual/iPointData';

export interface IConfigWinlineSegment {
    x: number;
    y: number;
    textureKey: string;
    textureScale: number;
    ignoreTextureScale?: boolean;
    textureEffectiveWidth: number;
    textureAnchor: IPointData;
    frameTemplate: {
        key: string;
        config?: (number) => Phaser.Types.Animations.GenerateFrameNames;
        frameRate?: number; //30 by default
    };
    animsNum: number;
}

export default class WinLineSegment extends Phaser.GameObjects.Sprite {
    currentPlayingAnimIndex = 0;

    constructor(
        public myScene: Phaser.Scene,
        private config: IConfigWinlineSegment
    ) {
        super(myScene, config.x, config.y, config.textureKey);

        this.setOrigin(
            this.config.textureAnchor.x,
            this.config.textureAnchor.y
        );

        myScene.add.existing(this);

        for (let i = 0; i < this.config.animsNum; i++) {
            let frames;
            if (this.config.frameTemplate.config) {
                frames = this.scene.anims.generateFrameNames(
                    this.config.frameTemplate.key,
                    this.config.frameTemplate.config(i)
                );
            } else {
                frames = this.scene.anims.generateFrameNames(
                    this.config.frameTemplate.key
                );
                frames = _sortBy(frames, ['frame']);
            }

            this.scene.anims.create({
                key: 'loopAnim' + i,
                repeat: -1,
                frames: frames,
                frameRate: this.config.frameTemplate.hasOwnProperty('frameRate')
                    ? this.config.frameTemplate.frameRate
                    : 30,
            });
        }
    }

    setPositionBetweenPoints(
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): void {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const sin = dy / len;
        //let tan = dy / dx;

        this.angle = (360 * Math.asin(sin)) / (2 * Math.PI); //(180 * Math.asin(sin)) / (2 * Math.PI);
        this.x = x1 + 0.5 * dx;
        this.y = y1 + 0.5 * dy;

        const scaleRatio =
            (this.config.textureEffectiveWidth * len) / this.width;

        if (!this.config.ignoreTextureScale) {
            this.setScale(
                scaleRatio * this.config.textureScale,
                this.config.textureScale
            );
        }
    }

    startAnimation(winLineIndex: number): void {
        this.stopAnimation();
        this.play('loopAnim' + (winLineIndex % this.config.animsNum));
        //console.log("start animation", (winLineIndex % this.config.animsNum));
        this.currentPlayingAnimIndex = winLineIndex % this.config.animsNum;
    }

    stopAnimation(): void {
        this.anims.stop();
        //console.log("stop()")
    }

    show(winLineIndex: number): void {
        //console.log("show", winLineIndex)
        this.setActive(true).setVisible(true).setAlpha(1);
        if (
            !this.anims.isPlaying ||
            this.currentPlayingAnimIndex != winLineIndex
        ) {
            this.startAnimation(winLineIndex);
        }
    }

    turnOff(): void {
        this.stopAnimation();
        this.setActive(false).setVisible(false).setAlpha(1);
    }
}
