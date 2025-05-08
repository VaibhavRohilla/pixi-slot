import PhaserStatsGame from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/PhaserStatsGame';
import Preload from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/Scenes/Preload';


export class PreloadSpecific extends Preload {

    constructor() {
        super();
        this.pressToStartFontSize = {
            mobilePort: 170,
            mobileLand: 170,
            desktopPort: 170,
            desktopLand: 170,
            stroke: '#000000',
            strokeThickness: 6,
        }
    }

    resize(gameSize: Phaser.Structs.Size = this.scale.gameSize): void {
        this.preBootLogo.resize(gameSize);
        this.presstoStartOffsetY = gameSize.height * 0.35;
        super.resize();
    }
}
