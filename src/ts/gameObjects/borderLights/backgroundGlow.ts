import ReelsBorderAnimation from '@clientframework/slots/engine/src/ts/game-objects/winLines/segmented/reelsBorderAnimation';
import { IConfigWinlineSegment } from '@clientframework/slots/engine/src/ts/game-objects/winLines/segmented/winLineSegment';

export default class BackgroundGlow extends ReelsBorderAnimation {
    constructor(
        scene: Phaser.Scene,
        configWinlineSegment: IConfigWinlineSegment
    ) {
        super(scene, configWinlineSegment, 'backgroundGlow', false);

        const posUnit = 0.52;
        this.segmentsData = [
            // these coordinates specify the position of border segments

            // left border
            [
                [-posUnit, -posUnit],
                [-posUnit, posUnit],
            ],

            // right border
            [
                [posUnit, -posUnit],
                [posUnit, posUnit],
            ],

            // top border
            [
                [-posUnit, -posUnit],
                [posUnit, -posUnit],
            ],

            // bottom border
            [
                [-posUnit, posUnit],
                [posUnit, posUnit],
            ],
        ];
        this.segmentsScalingFactorW = 1.2;
        this.segmentsScalingFactorH = 4;
        this.segmentOriginX = 0.5;
        this.segmentOriginY = 0.48;
        this.targetingAlpha = 1;
    }

    refreshVisualModel(data: any): void {
        //BackgroundAnimations) {
        console.log('AAAAAAAAAEEEEEEEEEEEE', data);
        this.startingX = data.bgImage.x;
        this.startingY = data.bgImage.y;
        this.dx = data.scale.gameSize.width;
        this.dy = data.scale.gameSize.height;
        this.refreshFromModelAndResize(0);
    }
}
