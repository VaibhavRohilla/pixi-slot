import Reels from '@clientframework/slots/engine/src/ts/scenes/Reels';
import { configSceneReels } from '@specific/config';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';

export default class ReelsSpecific extends Reels {
    additionalImgs: Phaser.GameObjects.Image[] = [];
    additionalImgsCnt = 2;

    constructor() {
        super();
    }

    create(/*data: object*/): void {
        super.create();

        for (let i = 0; i < this.additionalImgsCnt; i++) {
            this.additionalImgs.push(this.add.image(0, 0, 'mist'));
            this.additionalImgs[i].setOrigin(0.5, 0);
            this.additionalImgs[i].setDepth(configSceneReels.depth);
        }

        this.createBgAnims();

        this.resize();
    }

    resizeInternal(gameSize = this.scale.gameSize, shouldEmit: boolean): void {
        super.resizeInternal(gameSize, shouldEmit);

        this.specificResize();
    }

    private specificResize(): void {
        const isPort = globalGetIsPortrait(this);
        if (this.additionalImgs.length > 0) {
            for (let i = 0; i < this.additionalImgsCnt; i++) {
                if (i == 0) {
                    this.additionalImgs[i].setScale(
                        2 * this.bg.scale,
                        1 * this.bg.scale
                    );
                    this.additionalImgs[i].y =
                        this.bg.y +
                        (isPort ? 0.7 : 0.5) * this.bg.scale * this.bg.height;
                } else {
                    this.additionalImgs[i].setScale(
                        2 * this.bg.scale,
                        -1 * this.bg.scale
                    );
                    this.additionalImgs[i].y =
                        this.additionalImgs[i - 1].y +
                        2 *
                            this.additionalImgs[i - 1].scaleY *
                            this.additionalImgs[i - 1].height;
                }
                //let yBottom = gameSize.height / retZoom;
            }
        }
    }

    createBgAnims(): void {
        this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 50000,
            loop: -1,
            onUpdate: (tween) => {
                const t = tween.getValue();
                //if(v >= 1) { return; } // clear mask on last update

                if (this.additionalImgs.length > 0) {
                    for (let i = 0; i < this.additionalImgsCnt; i++) {
                        const w =
                            this.additionalImgs[i].scaleX *
                            this.additionalImgs[i].width;
                        this.additionalImgs[i].x =
                            (Math.sin(2 * Math.PI * t) * w) / 8;
                    }
                }
            },
            onUpdateScope: this,
        });
    }
}
