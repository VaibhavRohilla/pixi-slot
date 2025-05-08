import WinLineSegment, { IConfigWinlineSegment } from './winLineSegment';
import { IReelCoordinatesData } from '../../../dataPresenterVisual/iReelCoordinatesData';
import { IPointData } from '../../../dataPresenterVisual/iPointData';
import _forEach from 'lodash-es/forEach';

export default class ReelsBorderAnimation {
    private segmentsBuffer: WinLineSegment[] = [];

    protected dx = 300;
    protected dy = 300;
    protected startingX = 500;
    protected startingY = 500;
    protected segmentsScalingFactorW = 1;
    protected segmentsScalingFactorH = 2;
    protected segmentOriginX = 0.5;
    protected segmentOriginY = 0.5;
    protected targetingAlpha = 0.05;
    protected showTween: Phaser.Tweens.Tween;

    protected segmentsData: number[][][] = [
        // these coordinates specify the position of border segments
        // all values that are not divisible to 0.5 e.g. 2.6, 0.6, 0.55 - are moved to cover the border of the slot, as opposed to representing the edge of the reel

        // left border
        [
            [-0.45, -0.65],
            [-0.45, 0.42],
        ],
        [
            [-0.45, 0.42],
            [-0.45, 1.42],
        ],
        [
            [-0.45, 1.42],
            [-0.45, 2.52],
        ],

        // right border
        [
            [4.6, -0.65],
            [4.6, 0.42],
        ],
        [
            [4.6, 0.42],
            [4.6, 1.42],
        ],
        [
            [4.6, 1.42],
            [4.6, 2.52],
        ],

        // top border
        [
            [-0.6, -0.67],
            [0.45, -0.67],
        ],
        [
            [0.45, -0.67],
            [1.45, -0.67],
        ],
        [
            [1.45, -0.67],
            [2.45, -0.67],
        ],
        [
            [2.45, -0.67],
            [3.45, -0.67],
        ],
        [
            [3.45, -0.67],
            [4.5, -0.67],
        ],

        // bottom border
        [
            [-0.6, 2.49],
            [0.45, 2.49],
        ],
        [
            [0.45, 2.49],
            [1.45, 2.49],
        ],
        [
            [1.45, 2.49],
            [2.45, 2.49],
        ],
        [
            [2.45, 2.49],
            [3.45, 2.49],
        ],
        [
            [3.45, 2.49],
            [4.5, 2.49],
        ],
    ]; //will be refreshed from outside

    private activeSegmentsCnt = 0;

    private symbolCoords: IPointData[][] = null; //will be refreshed from outside
    private segmentScale = 1;

    constructor(
        protected scene: Phaser.Scene,
        private configWinlineSegment: IConfigWinlineSegment,
        protected id = 'flameframe',
        isAroundReels = true
    ) {
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
                new WinLineSegment(this.scene, this.configWinlineSegment)
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
        const fadingSegments: WinLineSegment[] = [];

        for (let index = 0; index < this.activeSegmentsCnt; index++) {
            if (bufferIndex >= this.segmentsBuffer.length) {
                this.createMoreSegments();
            }

            const currentSegment = this.segmentsData[index];

            let x = this.startingX + currentSegment[0][0] * this.dx;
            let y = this.startingY + currentSegment[0][1] * this.dy;
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
}
