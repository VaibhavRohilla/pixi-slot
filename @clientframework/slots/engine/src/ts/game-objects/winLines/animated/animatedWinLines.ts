import { IReelCoordinatesData } from '../../../dataPresenterVisual/iReelCoordinatesData';

export interface IConfigAnimatedWinLines {
    generateAnimationFrames: (
        scene: Phaser.Scene,
        animTextureKey: string
    ) => Phaser.Types.Animations.AnimationFrame[][];
    frameRate: number;
    scale: number;
    numberOfWinLines: number;
    gfxData: IWinLinesGfxData[];
    scaleFactorW: number;
    scaleFactorH: number;
}

interface IWinLinesGfxData {
    offsetY: number;
    flipY: boolean;
}

export default class AnimatedWinLines {
    protected animationsInited = false;
    protected winLineSprite: Phaser.GameObjects.Sprite[] = [];

    protected lastReelData: IReelCoordinatesData;

    constructor(
        protected scene: Phaser.Scene,
        protected animTextureKey: string,
        protected config: IConfigAnimatedWinLines
    ) {
        if (!this.animationsInited) {
            const frames = this.config.generateAnimationFrames(
                this.scene,
                this.animTextureKey
            );
            for (let i = 0; i < frames.length; i++) {
                <Phaser.Animations.Animation>this.scene.anims.create({
                    key: `animatedwinline${i}`,
                    frames: frames[i],
                    repeat: -1,
                    frameRate: this.config.frameRate,
                });
                this.winLineSprite[i] = null;
            }
        }

        this.scene.game.events.on(
            'event-reels-scene-coords-data',
            (data: IReelCoordinatesData) => this.refreshVisualModel(data),
            this
        );

        this.scene.game.events.on(
            'event-show-multiple-lines',
            this.animateAllWinLines,
            this
        );
        this.scene.game.events.on(
            'event-stop-winlines-showing',
            this.stopWinlinesShowing,
            this
        );
        this.scene.game.events.on(
            'event-show-single-line',
            this.animateSingleWinLine,
            this
        );
    }

    animateAllWinLines(lineIndexes: number[], fadingTime = 0): void {
        fadingTime;
        for (let i = 0; i < lineIndexes.length; i++) {
            this.animateWinLine(lineIndexes[i]);
        }
    }

    animateWinLine(winLineIndex: number): void {
        if (!this.winLineSprite[winLineIndex]) {
            this.winLineSprite[winLineIndex] = this.scene.add.sprite(
                0,
                0,
                this.animTextureKey
            );
            this.refreshVisualModel(this.lastReelData);
        }
        this.winLineSprite[winLineIndex]
            .setVisible(true)
            .setActive(true)
            .setAlpha(1);
        this.scene.anims.play(
            `animatedwinline${winLineIndex}`,
            this.winLineSprite[winLineIndex]
        );
    }

    animateSingleWinLine(winLineIndex = -1): void {
        this.stopWinlinesShowing();
        this.animateWinLine(winLineIndex);
    }

    stopWinLine(winLineIndex: number): void {
        if (!this.winLineSprite[winLineIndex]) {
            return;
        }
        this.winLineSprite[winLineIndex].anims.stop();
        this.winLineSprite[winLineIndex]
            .setVisible(false)
            .setActive(false)
            .setAlpha(1);
    }

    stopWinlinesShowing(): void {
        for (let i = 0; i < this.config.numberOfWinLines; i++) {
            this.stopWinLine(i);
        }
    }

    refreshVisualModel(data: IReelCoordinatesData): void {
        if (!data) {
            return;
        }
        const deltaYSymbol =
            data.reelsScale *
            (data.symbolsCoords[1][1].y - data.symbolsCoords[1][0].y);
        const middleX: number =
            data.reelsCoords[2].x +
            data.reelsScale * data.symbolsCoords[2][1].x;
        const middleY: number =
            data.reelsCoords[2].y +
            data.reelsScale * data.symbolsCoords[2][1].y;
        const xx = middleX * this.config.scaleFactorW;

        for (let i = 0; i < this.config.numberOfWinLines; i++) {
            const yy =
                middleY +
                deltaYSymbol *
                    this.config.gfxData[i].offsetY *
                    this.config.scaleFactorH;

            if (this.winLineSprite[i]) {
                this.winLineSprite[i].setPosition(xx, yy);
                this.winLineSprite[i].setScale(
                    (1 / this.config.scale) * data.reelsScale
                );
                this.winLineSprite[i].flipY = this.config.gfxData[i].flipY;
            }
        }
        this.lastReelData = data;
    }
}
