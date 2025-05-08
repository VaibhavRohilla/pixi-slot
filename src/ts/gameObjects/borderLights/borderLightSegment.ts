import { IConfigWinlineSegment } from '@clientframework/slots/engine/src/ts/game-objects/winLines/segmented/winLineSegment';

export class BorderLightSegment extends Phaser.GameObjects.Sprite {
    currentPlayingAnimIndex = 0;

    hasAnims = false;

    randoms = [Math.random(), Math.random(), Math.random()];

    startTime = 0;

    constructor(
        public myScene: Phaser.Scene,
        private config: IConfigWinlineSegment,
        protected isSyncronizedAnim: boolean = false
    ) {
        super(myScene, config.x, config.y, config.textureKey);

        console.log('config.textureKey', config.textureKey);

        this.setOrigin(
            this.config.textureAnchor.x,
            this.config.textureAnchor.y
        );

        myScene.add.existing(this);

        for (let i = 0; i < this.config.animsNum; i++) {
            this.hasAnims = true;
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
            }

            this.scene.anims.create({
                key: 'loopAnim' + i,
                repeat: -1,
                frames: frames,
                frameRate: 30,
            });
        }
    }

    preUpdate(time, delta): void {
        super.preUpdate(time, delta);
        //console.log("UPDATTE")
        this.angle =
            Phaser.Math.RadToDeg((2 * Math.PI * time) / 2000) +
            Math.floor(90 * this.randoms[0]);

        const a = Math.cos((2 * Math.PI * (time - this.startTime)) / 1000);
        const alphaAmplitude = 0.6;

        this.scale =
            0.8 +
            0.2 *
                0.5 *
                (1 -
                    Math.cos(
                        (2 * Math.PI * time) /
                            (4000 +
                                Math.floor(
                                    (this.isSyncronizedAnim ? 300 : -2000) *
                                        this.randoms[2]
                                ))
                    )) +
            alphaAmplitude * 0.5 * (1 - a);
    }

    setPositionBetweenPoints(
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): void {
        x2;
        y2;
        // let dx = (x2 - x1);
        // let dy = (y2 - y1);
        // let len = Math.sqrt(dx * dx + dy * dy);
        // let sin = (dy / len);
        // //let tan = dy / dx;

        // this.angle = (360 * Math.asin(sin)) / (2 * Math.PI);//(180 * Math.asin(sin)) / (2 * Math.PI);
        this.x = x1; // + 0.5 * dx;
        this.y = y1; // + 0.5 * dy;

        const scaleRatio = 1; //this.config.textureEffectiveWidth * len / this.width;

        this.setScale(
            scaleRatio * this.config.textureScale,
            this.config.textureScale
        );
    }

    protected startAnimation(winLineIndex: number): void {
        this.stopAnimation();
        if (this.hasAnims) {
            this.play('loopAnim' + (winLineIndex % this.config.animsNum));
        }
        //console.log("start animation", (winLineIndex % this.config.animsNum));
        this.currentPlayingAnimIndex = winLineIndex % this.config.animsNum;
    }

    protected stopAnimation(): void {
        if (this.hasAnims) {
            this.anims.stop();
        }
        //console.log("stop()")
    }

    show(winLineIndex: number): void {
        //console.log("show", winLineIndex)
        this.setActive(true).setVisible(true).setAlpha(1);
        this.randoms[1] = Math.random();
        this.startTime =
            this.scene.time.now -
            (this.isSyncronizedAnim ? 0 : Math.floor(1000 * this.randoms[1]));
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
