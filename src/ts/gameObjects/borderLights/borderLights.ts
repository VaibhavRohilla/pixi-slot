import _forEach from 'lodash-es/forEach';
import { IConfigWinlineSegment } from '@clientframework/slots/engine/src/ts/game-objects/winLines/segmented/winLineSegment';
import { IPointData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iPointData';
import { IReelCoordinatesData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iReelCoordinatesData';
import { BorderLightSegment } from './borderLightSegment';

export interface IConfigBorderLights {
    configWinlineSegment: IConfigWinlineSegment;
    segmentsData?: number[][][];
}

export class BorderLights {
    private segmentsBuffer: BorderLightSegment[] = [];

    protected dx = 300;
    protected dy = 300;
    protected startingX = 500;
    protected startingY = 500;
    protected referentObjectAngleRad = 0;

    protected segmentsScalingFactorW = 2;
    protected segmentsScalingFactorH = 2;
    protected segmentOriginX = 0.5;
    protected segmentOriginY = 0.5;
    protected targetingAlpha = 1;
    protected showTween: Phaser.Tweens.Tween;

    segmentsData: number[][][] = [];

    private activeSegmentsCnt = 0;

    private symbolCoords: IPointData[][] = null; //will be refreshed from outside
    private segmentScale = 1;

    private refrentObject: Phaser.GameObjects.Sprite;

    constructor(
        protected scene: Phaser.Scene,
        private config: IConfigBorderLights,
        protected id = 'lightsFrame',
        protected isAroundReels = true
    ) {
        if (this.config.segmentsData) {
            this.segmentsData = JSON.parse(
                JSON.stringify(this.config.segmentsData)
            );
        }

        scene.game.events.on(
            `event-start-${this.id}`,
            this.showReelsFrame,
            this
        );
        scene.game.events.on(
            `event-stop-${this.id}`,
            this.stopReelsFrame,
            this
        );
        scene.game.events.on(
            `event-resize-${this.id}`,
            this.refreshVisualModel,
            this
        );
        // this.scene.game.events.on("event-show-reels-frame", this.showReelsFrame, this);
        // this.scene.game.events.on("event-stop-reels-frame", this.stopReelsFrame, this);
        if (isAroundReels) {
            this.scene.game.events.on(
                'event-reels-scene-coords-data',
                (data: IReelCoordinatesData) => this.refreshVisualModel(data),
                this
            );
        }

        this.scene.input.keyboard
            .addKey('L')
            .on(
                'down',
                () =>
                    this.scene.game.events.emit(
                        `event-start-${this.id}`,
                        0,
                        500
                    ),
                this
            );
        this.scene.input.keyboard
            .addKey('K')
            .on(
                'down',
                () => this.scene.game.events.emit(`event-stop-${this.id}`, 500),
                this
            );
    }

    private showReelsFrame(duration = 0, fadingTime = 0): void {
        console.log('event-reels-border-started');
        this.scene.game.events.emit('event-reels-border-started');

        this.activeSegmentsCnt = this.segmentsData.length;

        this.refreshFromModelAndResize(0, fadingTime);

        if (duration > 0) {
            setTimeout(() => {
                this.stopReelsFrame(fadingTime);
            }, Math.min(duration, duration - fadingTime));
        }
    }

    private stopReelsFrame(fadingTime = 0): void {
        console.log('event-reels-border-stopped');
        this.scene.game.events.emit('event-reels-border-stopped');

        this.activeSegmentsCnt = 0;

        this.refreshFromModelAndResize(0, fadingTime, false);
    }

    private createMoreSegments(additionalCnt = 1): void {
        //console.log("createMoreSegments")
        for (let i = 0; i < additionalCnt; i++) {
            this.segmentsBuffer.push(
                new BorderLightSegment(
                    this.scene,
                    this.config.configWinlineSegment,
                    this.isAroundReels
                )
                    .setActive(false)
                    .setVisible(false)
            );
        }
    }

    protected refreshFromModelAndResize(
        oldBits: number,
        fadingTime = 0,
        showingOn = true
    ): void {
        oldBits;
        let bufferIndex = 0;
        const fadingSegments: BorderLightSegment[] = [];

        for (let index = 0; index < this.activeSegmentsCnt; index++) {
            if (bufferIndex >= this.segmentsBuffer.length) {
                this.createMoreSegments();
            }

            const currentSegment = this.segmentsData[index];

            let x = this.startingX + currentSegment[0][0] * this.dx;
            let y = this.startingY + currentSegment[0][1] * this.dy;

            if (this.referentObjectAngleRad != 0) {
                const angle = this.referentObjectAngleRad;
                const newX = x * Math.cos(angle) - y * Math.sin(angle);
                const newY = x * Math.sin(angle) + y * Math.cos(angle);
                // console.log('referentObjectAngleRad',
                //     x,
                //     newX,
                //     y,
                //     newY,
                //     angle,
                //     Phaser.Math.RadToDeg(angle)
                // );
                x = newX;
                y = newY;
            }

            const point1: IPointData = { x, y };

            x = this.startingX + currentSegment[1][0] * this.dx;
            y = this.startingY + currentSegment[1][1] * this.dy;

            const point2: IPointData = { x, y };

            const segment = this.segmentsBuffer[bufferIndex];
            segment.setPositionBetweenPoints(
                point1.x,
                point1.y,
                point2.x,
                point2.y
            );
            segment.setScale(
                segment.scaleX * this.segmentsScalingFactorW,
                segment.scaleY * this.segmentsScalingFactorH
            );
            segment.setOrigin(this.segmentOriginX, this.segmentOriginY);

            // point1 = this.symbolCoords[0][0];
            // point2 = this.symbolCoords[0][1];
            // segment = this.segmentsBuffer[bufferIndex];
            // segment.setPositionBetweenPoints(point1.x, point1.y, point2.x, point2.y, this.segmentScale);

            segment.show(0);

            if (fadingTime > 0) {
                fadingSegments.push(segment);
            }
            bufferIndex++;
        }

        if (fadingSegments.length > 0) {
            _forEach(fadingSegments, (segment) => segment.setAlpha(0));
            this.showTween && this.showTween.stop();
            this.showTween = this.scene.add.tween({
                targets: fadingSegments,
                duration: fadingTime,
                alpha: this.targetingAlpha.toString(),
                ease: 'Linear',
            });
        }

        const isFadingOut = !showingOn && fadingTime > 0 ? fadingTime : 0;
        while (bufferIndex < this.segmentsBuffer.length) {
            if (isFadingOut) {
                fadingSegments.push(this.segmentsBuffer[bufferIndex]);
            } else {
                this.segmentsBuffer[bufferIndex].turnOff();
            }
            bufferIndex++;
            console.log('turning off');
        }
        if (isFadingOut) {
            //_forEach(fadingSegments, segment => segment.setAlpha(this.targetingAlpha));
            this.showTween && this.showTween.stop();
            this.showTween = this.scene.add.tween({
                targets: fadingSegments,
                duration: fadingTime,
                alpha: 0,
                ease: 'Linear',
                onComplete: () => {
                    _forEach(fadingSegments, (segment) => segment.turnOff());
                },
            });
        }
    }

    /////////////////////
    // fill by events
    ////////////////////

    refreshVisualModel(data: IReelCoordinatesData): void {
        if (!this.isAroundReels) {
            return;
        }

        this.segmentScale = data.reelsScale;

        let shouldCreate = false;
        if (!this.symbolCoords) {
            shouldCreate = true;
        }
        if (shouldCreate) {
            this.symbolCoords = [];
        }

        _forEach(data.symbolsCoords, (a, i) => {
            if (shouldCreate) {
                this.symbolCoords.push([]);
            }
            _forEach(a, (b, j) => {
                const elem: IPointData = {
                    x: data.reelsCoords[i].x + this.segmentScale * b.x,
                    y: data.reelsCoords[i].y + this.segmentScale * b.y,
                };
                if (shouldCreate) {
                    this.symbolCoords[i].push(elem);
                } else {
                    this.symbolCoords[i][j].x = elem.x;
                    this.symbolCoords[i][j].y = elem.y;
                }
            });
        });

        this.dx = this.symbolCoords[1][0].x - this.symbolCoords[0][0].x;
        this.dy = this.symbolCoords[0][1].y - this.symbolCoords[0][0].y;

        this.startingX = this.symbolCoords[0][0].x;
        this.startingY = this.symbolCoords[0][0].y;

        this.refreshFromModelAndResize(0); //this.activeWinLineIndexBits);
    }

    resize(): void {
        this.startingX = this.refrentObject.x;
        this.startingY = this.refrentObject.y;
        this.segmentScale = this.refrentObject.scale;
        this.dx = this.refrentObject.width * this.segmentScale;
        this.dy = this.refrentObject.height * this.segmentScale;
        this.referentObjectAngleRad = Phaser.Math.DegToRad(
            this.refrentObject.angle
        );
        this.refreshFromModelAndResize(0); //this.activeWinLineIndexBits);
    }

    attachReferentObject(
        obj: Phaser.GameObjects.Sprite,
        populateX = 0,
        xOffset = 0.05,
        populateY = 0,
        yOffset = 0.05
    ): void {
        this.refrentObject = obj;
        this.isAroundReels = false;
        this.resize();
        this.segmentsData = [];
        for (let i = 0; i < populateX; i++) {
            const item1 = [
                [-0.5 + xOffset + (1.0 * i) / populateX, -0.5 + yOffset],
                [0, 0],
            ];
            const item2 = [
                [-0.5 + xOffset + (1.0 * i) / populateX, 0.5 - yOffset],
                [0, 0],
            ];
            this.segmentsData.push(item1, item2);
        }
        for (let i = 0; i < populateY; i++) {
            const item1 = [
                [-0.5 + xOffset, -0.5 + yOffset + (1.0 * i) / populateY],
                [0, 0],
            ];
            const item2 = [
                [0.5 - xOffset, -0.5 + yOffset + (1.0 * i) / populateY],
                [0, 0],
            ];
            this.segmentsData.push(item1, item2);
        }
        this.resize();
    }
}
