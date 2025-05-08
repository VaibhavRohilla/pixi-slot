import ComponentLayer from '@commonEngine/Scenes/ComponentLayer';
import Background from '@commonEngine/Scenes/Background';
import Reels from '../../../@clientframework/slots/engine/src/ts/scenes/Reels';
export default class BackgroundAnimations extends ComponentLayer {
    bgImage: Phaser.GameObjects.Image;

    sprites: Phaser.GameObjects.Sprite[] = [];

    timeline: Phaser.Tweens.Timeline = null;
    reels: Reels;
    graphics: Phaser.GameObjects.Graphics;
    graphicsRed: Phaser.GameObjects.Graphics;
    graphicsYellow: Phaser.GameObjects.Graphics;
    // curves for landscape and portrait clouds
    curve: Phaser.Curves.Spline;
    curvePortrait: Phaser.Curves.Spline;
    curveRed: Phaser.Curves.Spline;
    curveRedPortrait: Phaser.Curves.Spline;
    curveYellow: Phaser.Curves.Spline;
    curveYellowPortrait: Phaser.Curves.Spline;
    points: Phaser.Math.Vector2[] = [];
    pointsRed: Phaser.Math.Vector2[] = [];
    // arrays of sprite images for debugging
    pointsYellow: Phaser.Math.Vector2[] = [];
    handles: Phaser.GameObjects.Image[] = [];
    redHandles: Phaser.GameObjects.Image[] = [];
    yellowHandles: Phaser.GameObjects.Image[] = [];
    // initial cloud point coordinates hardcoded into animations
    originPointsCurve: Phaser.Math.Vector2[];
    originPortrait: Phaser.Math.Vector2[];
    originPointsRed: Phaser.Math.Vector2[];
    originRedPortrait: Phaser.Math.Vector2[];
    originPointsYellow: Phaser.Math.Vector2[];
    originYellowPortrait: Phaser.Math.Vector2[];

    HD_WIDTH = 1920;
    HD_HEIGHT = 1080;

    debugging: boolean;

    constructor() {
        super({
            key: 'BackgroundAnimations',
        });
    }

    init(data: object): void {
        super.init(data);
        // stwitch this boolean to hide/see/edit movement splines
        this.debugging = false;
    }

    create(): void {
        this.bgImage = (this.scene.get('Background') as Background).bgImage;
        this.reels = this.scene.get('Reels') as Reels;

        const frames = this.anims.generateFrameNames('backgroundAnim');

        this.sprites.push(
            this.add
                .sprite(0, 0, 'backgroundAnim', frames[0].frame)
                .setAlpha(0)
                .setScale(0)
        );
        this.sprites.push(
            this.add
                .sprite(0, 0, 'backgroundAnim', frames[1].frame)
                .setAlpha(0)
                .setScale(0)
        );
        this.sprites.push(
            this.add
                .sprite(0, 0, 'backgroundAnim', frames[2].frame)
                .setAlpha(0)
                .setScale(0)
        );

        // landscape cloud 1 points
        this.originPointsCurve = [
            new Phaser.Math.Vector2(1770, 663),
            new Phaser.Math.Vector2(1597, 671),
            new Phaser.Math.Vector2(1416, 725),
            new Phaser.Math.Vector2(1267, 849),
            new Phaser.Math.Vector2(1085, 951),
            new Phaser.Math.Vector2(826, 1024),
            new Phaser.Math.Vector2(541, 1024),
            new Phaser.Math.Vector2(229, 1019),
            new Phaser.Math.Vector2(0, 1010),
            new Phaser.Math.Vector2(-220, 1010),
            new Phaser.Math.Vector2(-439, 1000),
        ];

        // portrait cloud 1 points
        this.originPortrait = [
            new Phaser.Math.Vector2(1593, 650),
            new Phaser.Math.Vector2(1392, 729),
            new Phaser.Math.Vector2(1177, 800),
            new Phaser.Math.Vector2(952, 881),
            new Phaser.Math.Vector2(770, 940),
            new Phaser.Math.Vector2(606, 983),
            new Phaser.Math.Vector2(443, 1005),
            new Phaser.Math.Vector2(235, 1010),
            new Phaser.Math.Vector2(-439, 1001),
        ];

        // landscape cloud 2 points
        this.originPointsRed = [
            new Phaser.Math.Vector2(1900, 663),
            new Phaser.Math.Vector2(1770, 663),
            new Phaser.Math.Vector2(1597, 671),
            new Phaser.Math.Vector2(1416, 725),
            new Phaser.Math.Vector2(1267, 849),
            new Phaser.Math.Vector2(1085, 951),
            new Phaser.Math.Vector2(826, 1024),
            new Phaser.Math.Vector2(541, 1024),
            new Phaser.Math.Vector2(229, 1019),
            new Phaser.Math.Vector2(0, 1010),
            new Phaser.Math.Vector2(-220, 1010),
        ];

        // portrait cloud 2 points
        this.originRedPortrait = [
            new Phaser.Math.Vector2(1933, 570),
            new Phaser.Math.Vector2(1589, 653),
            new Phaser.Math.Vector2(1389, 730),
            new Phaser.Math.Vector2(1176, 799),
            new Phaser.Math.Vector2(954, 881),
            new Phaser.Math.Vector2(764, 951),
            new Phaser.Math.Vector2(587, 997),
            new Phaser.Math.Vector2(352, 1011),
            new Phaser.Math.Vector2(93, 1010),
            new Phaser.Math.Vector2(-360, 980),
        ];

        // landscape cloud 3 points
        this.originPointsYellow = [
            new Phaser.Math.Vector2(1630, 660),
            new Phaser.Math.Vector2(2200, 1080),
        ];

        // portrait cloud 3 points
        this.originYellowPortrait = [
            new Phaser.Math.Vector2(2200, 980),
            new Phaser.Math.Vector2(2500, 980),
        ];

        this.curve = new Phaser.Curves.Spline(this.originPointsCurve);
        this.curvePortrait = new Phaser.Curves.Spline(this.originPortrait);
        this.curveRed = new Phaser.Curves.Spline(this.originPointsRed);
        this.curveRedPortrait = new Phaser.Curves.Spline(
            this.originRedPortrait
        );
        this.curveYellow = new Phaser.Curves.Spline(this.originPointsYellow);
        this.curveYellowPortrait = new Phaser.Curves.Spline(
            this.originYellowPortrait
        );

        if (this.debugging === true) {
            // initialize the debbuging sprite points based on hardcoded curve points values
            for (let i = 0; i < this.originPointsCurve.length; i++) {
                const point = this.originPointsCurve[i];
                const handle = this.add
                    .image(point.x, point.y, 'point', 0)
                    .setInteractive()
                    .setScale(0.5)
                    .setAlpha(0.7);
                handle.setData('index', { color: 'w', index: i });
                this.input.setDraggable(handle);
                this.handles.push(handle);
            }

            for (let i = 0; i < this.originPointsRed.length; i++) {
                const pointRed = this.originPointsRed[i];
                const handle = this.add
                    .image(pointRed.x, pointRed.y, 'pointRed', 0)
                    .setInteractive()
                    .setScale(0.5)
                    .setAlpha(0.7);
                handle.setData('index', { color: 'r', index: i });
                this.input.setDraggable(handle);
                this.redHandles.push(handle);
            }

            for (let i = 0; i < this.originPointsYellow.length; i++) {
                const pointYellow = this.originPointsYellow[i];
                const handle = this.add
                    .image(pointYellow.x, pointYellow.y, 'pointYellow', 0)
                    .setInteractive()
                    .setScale(0.5)
                    .setAlpha(0.7);
                handle.setData('index', { color: 'y', index: i });
                this.input.setDraggable(handle);
                this.yellowHandles.push(handle);
            }

            // move the curve points on dragging of sprite handles, also only for debugging purpose
            this.input.on(
                'drag',
                (
                    pointer: Phaser.Math.Vector2,
                    sprite: Phaser.GameObjects.Image
                ) => {
                    sprite.x = pointer.x;
                    sprite.y = pointer.y;

                    const curveIndex = sprite.data.get('index');

                    const dragPoint = this.pointFullHdToBG(sprite);

                    if (
                        this.scale.orientation ===
                        Phaser.Scale.Orientation.LANDSCAPE
                    ) {
                        if (curveIndex.color === 'w') {
                            this.convertPointBgToFullHD(
                                this.curve.points[curveIndex.index],
                                dragPoint
                            );
                        } else if (curveIndex.color === 'r') {
                            this.convertPointBgToFullHD(
                                this.curveRed.points[curveIndex.index],
                                dragPoint
                            );
                        } else if (curveIndex.color === 'y') {
                            this.convertPointBgToFullHD(
                                this.curveYellow.points[curveIndex.index],
                                dragPoint
                            );
                        }
                    } else if (
                        this.scale.orientation ===
                        Phaser.Scale.Orientation.PORTRAIT
                    ) {
                        if (curveIndex.color === 'w') {
                            this.convertPointBgToFullHD(
                                this.curvePortrait.points[curveIndex.index],
                                dragPoint
                            );
                        } else if (curveIndex.color === 'r') {
                            this.convertPointBgToFullHD(
                                this.curveRedPortrait.points[curveIndex.index],
                                dragPoint
                            );
                        } else if (curveIndex.color === 'y') {
                            this.convertPointBgToFullHD(
                                this.curveYellowPortrait.points[
                                    curveIndex.index
                                ],
                                dragPoint
                            );
                        }
                    }
                    sprite.data.get('vector').set(dragPoint.x, dragPoint.y);
                }
            );

            // uncomment this to log the points based on FULL HD to background

            // this.input.on('dragend', function (pointer: any) {
            //   if(this.scale.orientation === Phaser.Scale.Orientation.LANDSCAPE) {

            //     this.curve.points.map((p: any) => {
            //       const x = 1920 * ((p.x - this.bgImage.x) / this.bgImage.displayWidth + 0.5);
            //       const y = 1080 * ((p.y - this.bgImage.y) / this.bgImage.displayHeight + 0.5);
            //       console.log(`(${Math.ceil(x)}, ${Math.ceil(y)})`);
            //     })

            //   } else if (this.scale.orientation === Phaser.Scale.Orientation.PORTRAIT) {

            //     this.curveYellowPortrait.points.map((p: any) => {
            //       const x = 1920 * ((p.x - this.bgImage.x) / this.bgImage.displayWidth + 0.5);
            //       const y = 1080 * ((p.y - this.bgImage.y) / this.bgImage.displayHeight + 0.5);
            //       console.log(`(${Math.ceil(x)}, ${Math.ceil(y)})`);
            //     })

            //   }
            // }, this);

            this.graphics = this.add.graphics();
            this.graphicsRed = this.add.graphics();
            this.graphicsYellow = this.add.graphics();
        }

        this.resize();

        // this.playAllAnimation(true);

        this.playCloudAnimation();

        // for testing TODO remove
        this.input.keyboard
            .addKey('W')
            .on('down', () => this.playCloudAnimation(), this);
        // this.input.keyboard.addKey('J').on('down', () => this.playAllAnimation(false), this);
        // this.input.keyboard.addKey('I').on('down', () => this.playAllAnimation(true), this);

        // this.game.events.on("event-animate-background-idle", () => this.playAllAnimation(true), this);
        // this.game.events.on("event-animate-background-win", () => this.playWaveAnimation(), this);
        // this.game.events.on("event-start-prize-win", () => this.playAllAnimation(false), this);
    }

    orientationChange(): void {
        this.resize();
    }

    resize(): void {
        console.log('AAAAEII');
        super.resize();
        const bgScene = this.scene.get('Background') as Background;
        this.cameras.main.zoom = bgScene.cameras.main.zoom;
        this.cameras.main.scrollX = bgScene.cameras.main.scrollX;
        this.cameras.main.scrollY = bgScene.cameras.main.scrollY;

        // const w = this.bgImage.scale * this.bgImage.width;
        // const h = this.bgImage.scale * this.bgImage.height;

        // go through all the original hardcoded points and move curves and handles based on the landscape/portrait
        // current image position
        switch (this.scale.orientation) {
            case Phaser.Scale.Orientation.LANDSCAPE:
                for (let i = 0; i < this.originPointsCurve.length; i++) {
                    const pointWhite = this.originPointsCurve[i];
                    // 'hadle' sprite images will only be moved if debbuging
                    if (this.debugging === true) {
                        this.convertPointBgToFullHD(
                            this.handles[i],
                            pointWhite
                        );
                        this.handles[i].setData('vector', pointWhite);
                    }
                    this.convertPointBgToFullHD(
                        this.curve.points[i],
                        pointWhite
                    );
                }

                for (let i = 0; i < this.originPointsRed.length; i++) {
                    const pointRed = this.originPointsRed[i];
                    if (this.debugging === true) {
                        this.convertPointBgToFullHD(
                            this.redHandles[i],
                            pointRed
                        );
                        this.redHandles[i].setData('vector', pointRed);
                    }
                    this.convertPointBgToFullHD(
                        this.curveRed.points[i],
                        pointRed
                    );
                }

                for (let i = 0; i < this.originPointsYellow.length; i++) {
                    const pointYellow = this.originPointsYellow[i];
                    if (this.debugging === true) {
                        this.convertPointBgToFullHD(
                            this.yellowHandles[i],
                            pointYellow
                        );
                        this.yellowHandles[i].setData('vector', pointYellow);
                    }
                    this.convertPointBgToFullHD(
                        this.curveYellow.points[i],
                        pointYellow
                    );
                }

                break;

            case Phaser.Scale.Orientation.PORTRAIT:
                for (let i = 0; i < this.originPortrait.length; i++) {
                    const pointWhite = this.originPortrait[i];
                    if (this.debugging === true) {
                        this.convertPointBgToFullHD(
                            this.handles[i],
                            pointWhite
                        );
                        this.handles[i].setData('vector', pointWhite);
                    }
                    this.convertPointBgToFullHD(
                        this.curvePortrait.points[i],
                        pointWhite
                    );
                }

                for (let i = 0; i < this.originRedPortrait.length; i++) {
                    const pointRed = this.originRedPortrait[i];
                    if (this.debugging === true) {
                        this.convertPointBgToFullHD(
                            this.redHandles[i],
                            pointRed
                        );
                        this.redHandles[i].setData('vector', pointRed);
                    }
                    this.convertPointBgToFullHD(
                        this.curveRedPortrait.points[i],
                        pointRed
                    );
                }

                for (let i = 0; i < this.originYellowPortrait.length; i++) {
                    const pointYellow = this.originYellowPortrait[i];
                    if (this.debugging === true) {
                        this.convertPointBgToFullHD(
                            this.yellowHandles[i],
                            pointYellow
                        );
                        this.yellowHandles[i].setData('vector', pointYellow);
                    }
                    this.convertPointBgToFullHD(
                        this.curveYellowPortrait.points[i],
                        pointYellow
                    );
                }

                break;
        }
    }

    clearCurrentAnimation(): void {
        this.tweens.killAll();
        this.sprites.forEach((s) => {
            s.setScale(0);
            s.setAlpha(0);
        });
    }

    playCloudAnimation(): void {
        console.log('Started cloud animation !!!');

        this.clearCurrentAnimation();

        const tweenObject = {
            val: 0,
        };

        this.timeline = this.tweens.createTimeline();

        // frist tween will move the clouds along the curve points, based on value 0-1 in the 48sec duration
        // other tweens will handle aplha and scale
        // the clouds will rotate towards the next point in the curve.
        this.timeline.add({
            targets: tweenObject,
            val: 1,
            ease: 'Linear',
            duration: 48000,
            callbackScope: this,
            onUpdate: (tween, target) => {
                let positionCloud1: Phaser.Math.Vector2;
                let positionCloud2: Phaser.Math.Vector2;
                let positionCloud3: Phaser.Math.Vector2;

                if (
                    this.scale.orientation ===
                    Phaser.Scale.Orientation.LANDSCAPE
                ) {
                    positionCloud1 = this.curve.getPoint(target.val);
                    positionCloud2 = this.curveRed.getPoint(target.val);
                    positionCloud3 = this.curveYellow.getPoint(target.val);
                } else if (
                    this.scale.orientation === Phaser.Scale.Orientation.PORTRAIT
                ) {
                    positionCloud1 = this.curvePortrait.getPoint(target.val);
                    positionCloud2 = this.curveRedPortrait.getPoint(target.val);
                    positionCloud3 = this.curveYellowPortrait.getPoint(
                        target.val
                    );
                }

                const angle =
                    Phaser.Math.RAD_TO_DEG *
                    Phaser.Math.Angle.Between(
                        this.sprites[1].x,
                        this.sprites[1].y,
                        positionCloud1.x,
                        positionCloud1.y
                    );
                const angleCloud2 =
                    Phaser.Math.RAD_TO_DEG *
                    Phaser.Math.Angle.Between(
                        this.sprites[0].x,
                        this.sprites[0].y,
                        positionCloud2.x,
                        positionCloud2.y
                    );
                const angleCloud3 =
                    Phaser.Math.RAD_TO_DEG *
                    Phaser.Math.Angle.Between(
                        this.sprites[2].x,
                        this.sprites[2].y,
                        positionCloud3.x,
                        positionCloud3.y
                    );

                this.sprites[1].setAngle(angle);
                this.sprites[1].x = positionCloud1.x;
                this.sprites[1].y = positionCloud1.y;
                this.sprites[0].setAngle(angleCloud2);
                this.sprites[0].x = positionCloud2.x;
                this.sprites[0].y = positionCloud2.y;
                this.sprites[2].setAngle(angleCloud3);
                this.sprites[2].x = positionCloud3.x;
                this.sprites[2].y = positionCloud3.y;
            },
        });

        // cloud 1
        // scale 0-37% 0-6s 37-45% 6-16s 45-105% 16-21s
        // alpha  0-70% 0-6s

        this.timeline.add({
            targets: this.sprites[1],
            alpha: 0.7,
            ease: 'Linear',
            duration: 5500,
            offset: 3000,
        });

        this.timeline.add({
            targets: this.sprites[1],
            scale: 0.74,
            ease: 'Linear',
            duration: 6000,
            offset: 0,
        });

        this.timeline.add({
            targets: this.sprites[1],
            scale: 0.9,
            ease: 'Linear',
            duration: 10000,
            offset: 6000,
        });

        this.timeline.add({
            targets: this.sprites[1],
            scale: 2,
            ease: 'Linear',
            duration: 5000,
            offset: 16000,
        });

        // cloud 2
        // scale 0-27% 0-12s, 27-75% 12-21s, 75-80% 21-43s
        // alpha 0-70% 12-16s 70-50% 16-29s

        this.timeline.add({
            targets: this.sprites[0],
            alpha: 0.7,
            ease: 'Linear',
            duration: 4000,
            offset: 12000,
            //onComplete:(() => {console.log('complete cloud 2 opacity 70% at: ' + this.timeline.totalElapsed)})
        });

        this.timeline.add({
            targets: this.sprites[0],
            alpha: 0.5,
            ease: 'Linear',
            duration: 13000,
            offset: 16000,
        });

        this.timeline.add({
            targets: this.sprites[0],
            scale: 0.54,
            ease: 'Linear',
            duration: 12000,
            offset: 0,
        });

        this.timeline.add({
            targets: this.sprites[0],
            scale: 1.5,
            ease: 'Linear',
            duration: 9000,
            offset: 12000,
        });

        this.timeline.add({
            targets: this.sprites[0],
            scale: 1.6,
            ease: 'Linear',
            duration: 22000,
            offset: 21000,
        });

        // cloud no.3
        // scale 0-30% 0-6s  30-100% 6-39s
        // opacity 0-70% 6-12s

        this.timeline.add({
            targets: this.sprites[2],
            scale: 0.6,
            ease: 'Linear',
            duration: 6000,
            offset: 0,
        });

        this.timeline.add({
            targets: this.sprites[2],
            alpha: { from: 0, to: 0.7 },
            ease: 'Linear',
            duration: 6000,
            offset: 6000,
        });

        this.timeline.add({
            targets: this.sprites[2],
            scale: 2,
            ease: 'Linear',
            duration: 33000,
            offset: 6000,
        });

        this.timeline.loop = -1;
        this.timeline.loopDelay = 3000;
        //this.timeline.timeScale = 6;
        this.timeline.on('loop', () => {
            this.sprites.forEach((s) => {
                s.setScale(0);
                s.setAlpha(0);
            });
        });
        this.timeline.play();
    }

    // playAllAnimation(isIdle: boolean): void {
    // }

    update(): void {
        if (this.debugging === true) {
            this.graphics.clear();
            this.graphicsRed.clear();
            this.graphicsYellow.clear();
            this.graphics.lineStyle(2, 0xffffff, 0.5);
            this.graphicsRed.lineStyle(2, 0xff0000, 0.5);
            this.graphicsYellow.lineStyle(2, 0xffff00, 0.5);
            if (this.scale.orientation === Phaser.Scale.Orientation.LANDSCAPE) {
                this.curve.draw(this.graphics, 64);
                this.curveRed.draw(this.graphicsRed, 64);
                this.curveYellow.draw(this.graphicsYellow, 64);
            } else if (
                this.scale.orientation === Phaser.Scale.Orientation.PORTRAIT
            ) {
                this.curvePortrait.draw(this.graphics, 64);
                this.curveRedPortrait.draw(this.graphicsRed, 64);
                this.curveYellowPortrait.draw(this.graphicsYellow, 64);
            }
        }
    }

    // functions for normalizing points might need them in the future

    convertPointBgToFullHD(point: any, refPoint: any): void {
        const w = this.bgImage.displayWidth;
        const h = this.bgImage.displayHeight;

        point.x = this.bgImage.x + (refPoint.x / this.HD_WIDTH - 0.5) * w;
        point.y = this.bgImage.y + (refPoint.y / this.HD_HEIGHT - 0.5) * h;
    }

    pointFullHdToBG(point: any): Phaser.Math.Vector2 {
        const retPoint = new Phaser.Math.Vector2(0, 0);

        const w = this.bgImage.displayWidth;
        const h = this.bgImage.displayHeight;

        retPoint.x = this.HD_WIDTH * ((point.x - this.bgImage.x) / w + 0.5);
        retPoint.y = this.HD_HEIGHT * ((point.y - this.bgImage.y) / h + 0.5);

        return retPoint;
    }
}
