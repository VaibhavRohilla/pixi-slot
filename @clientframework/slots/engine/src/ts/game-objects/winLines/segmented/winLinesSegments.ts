import { IWinLinesDataPresenter } from '../../../dataPresenter/interfaces';
import WinLineSegment, { IConfigWinlineSegment } from './winLineSegment';
import { IReelCoordinatesData } from '../../../dataPresenterVisual/iReelCoordinatesData';
import { IPointData } from '../../../dataPresenterVisual/iPointData';
import _forEach from 'lodash-es/forEach';

export interface IConfigWinLinesSegments {
    winlineSegmentConfig: IConfigWinlineSegment;
}

export default class WinLinesSegments {
    private segmentsBuffer: WinLineSegment[] = [];

    private winLinesData: IWinLinesDataPresenter; //will be refreshed from outside
    private activeWinLineIndexBits = 0;

    private symbolCoords: IPointData[][] = null; //will be refreshed from outside

    constructor(
        protected scene: Phaser.Scene,
        private config: IConfigWinLinesSegments
    ) {
        //this.scene.game.events.on("event-reels-scene-coords-data", this.refreshVisualModel, this);
        this.scene.game.events.on(
            'event-winlines-data',
            this.refreshModel,
            this
        );
        this.scene.game.events.on(
            'event-show-single-line',
            this.showSingleLine,
            this
        );
        this.scene.game.events.on(
            'event-show-additional-line',
            this.showAdditionalLine,
            this
        );
        this.scene.game.events.on(
            'event-show-multiple-lines',
            this.showMultipleLines,
            this
        );
        this.scene.game.events.on(
            'event-stop-winlines-showing',
            this.stopWinlinesShowing,
            this
        );
        this.scene.game.events.on(
            'event-reels-scene-coords-data',
            (data: IReelCoordinatesData) => this.refreshVisualModel(data),
            this
        );

        this.scene.game.events.emit('event-request-winlines-data');
    }

    private showAdditionalLine(lineIndex: number, fadingTime = 0): void {
        const oldBits = this.activeWinLineIndexBits;
        this.activeWinLineIndexBits |= 1 << lineIndex;

        this.refreshFromModelAndResize(oldBits, fadingTime);
    }

    private showSingleLine(lineIndex: number, fadingTime = 0): void {
        console.log('show-single-line', lineIndex);

        this.activeWinLineIndexBits = 1 << lineIndex;

        this.refreshFromModelAndResize(0, fadingTime);
    }

    private showMultipleLines(lineIndexes: number[], fadingTime = 0): void {
        console.log('show-multiple-lines');

        this.activeWinLineIndexBits = 0;
        _forEach(lineIndexes, (lineIndex) => {
            this.activeWinLineIndexBits |= 1 << lineIndex;
        });

        this.refreshFromModelAndResize(0, fadingTime);
    }

    private stopWinlinesShowing(): void {
        console.log('stopWinlinesShowing');

        this.activeWinLineIndexBits = 0;

        this.refreshFromModelAndResize(0);
    }

    private createMoreSegments(additionalCnt = 1): void {
        //console.log("createMoreSegments")
        for (let i = 0; i < additionalCnt; i++) {
            this.segmentsBuffer.push(
                new WinLineSegment(this.scene, this.config.winlineSegmentConfig)
                    .setActive(false)
                    .setVisible(false)
            );
        }
    }

    private refreshFromModelAndResize(oldBits: number, fadingTime = 0): void {
        let bufferIndex = 0;
        const fadingSegments: WinLineSegment[] = [];
        _forEach(this.winLinesData, (winLineData, winLineIndex) => {
            const existsAsOldOne = ((oldBits >> winLineIndex) & 1) == 1;
            if (((this.activeWinLineIndexBits >> winLineIndex) & 1) == 1) {
                for (
                    let reelIndex = 0;
                    reelIndex < winLineData.length - 1;
                    reelIndex++
                ) {
                    //console.log("bufferIndex", bufferIndex);
                    //console.log("this.winLinesData", this.winLinesData);
                    if (bufferIndex >= this.segmentsBuffer.length) {
                        this.createMoreSegments();
                    }

                    let reel = reelIndex;
                    let val = winLineData[reelIndex];
                    const point1: IPointData = this.symbolCoords[reel][val];

                    reel = reelIndex + 1;
                    val = winLineData[reel];
                    const point2: IPointData = this.symbolCoords[reel][val];

                    const segment = this.segmentsBuffer[bufferIndex];
                    segment.setPositionBetweenPoints(
                        point1.x,
                        point1.y,
                        point2.x,
                        point2.y
                    );

                    this.rescaleSegment(segment, point1, point2);

                    segment.show(winLineIndex);

                    if (!existsAsOldOne && fadingTime > 0) {
                        fadingSegments.push(segment);
                    }
                    bufferIndex++;
                }
            }
        });

        if (fadingSegments.length > 0) {
            _forEach(fadingSegments, (segment) => segment.setAlpha(0));
            this.scene.add.tween({
                targets: fadingSegments,
                duration: fadingTime,
                alpha: '1',
                ease: 'Linear',
            });
        }

        while (bufferIndex < this.segmentsBuffer.length) {
            this.segmentsBuffer[bufferIndex].turnOff();
            bufferIndex++;
        }
    }

    /////////////////////
    // fill by events
    ////////////////////

    private refreshModel(winLinesData: IWinLinesDataPresenter): void {
        this.winLinesData = JSON.parse(JSON.stringify(winLinesData));
        //this.refreshFromModel();
    }

    refreshVisualModel(data: IReelCoordinatesData): void {
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
                    x: data.reelsCoords[i].x + data.reelsScale * b.x,
                    y: data.reelsCoords[i].y + data.reelsScale * b.y,
                };
                if (shouldCreate) {
                    this.symbolCoords[i].push(elem);
                } else {
                    this.symbolCoords[i][j].x = elem.x;
                    this.symbolCoords[i][j].y = elem.y;
                }
            });
        });

        this.refreshFromModelAndResize(this.activeWinLineIndexBits);
    }

    rescaleSegment(
        segment: WinLineSegment,
        point1: IPointData,
        point2: IPointData
    ): void {
        segment;
        point1;
        point2;
    }
}
