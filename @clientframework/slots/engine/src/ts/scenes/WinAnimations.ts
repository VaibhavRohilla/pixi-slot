import ComponentLayer from '@commonEngine/Scenes/ComponentLayer';
import {
    ParticleWinAnimation,
    BigWinAnimationType,
} from '../game-objects/particles/particleWinAnimation';
import { configParticleWinAnimation } from '@specific/config';

export default class WinAnimations extends ComponentLayer {
    originalSize = new Phaser.Structs.Size(1920, 1080);

    winAnimation: ParticleWinAnimation;
    constructor() {
        super({
            key: 'WinAnimations',
        });
    }

    init(data: object): void {
        super.init(data);

        console.log('WinAnimations init');

        // this.game.events.once('preload-complete', this.preloadComplete, this);

        // this.bgImage = this.add.image(0, 0, 'preload-bg');

        this.orientationChange();
    }

    create(): void {
        this.winAnimation = new ParticleWinAnimation(
            this,
            'win',
            'coin',
            configParticleWinAnimation
        );

        this.orientationResizeRefresh();

        // this.testAllWinAnimations();
    }

    private orientationResizeRefresh(): void {
        this.orientationChange();
        this.resizeIntern();
    }

    orientationChange(): void {
        if (!this.scene.manager.isActive(this.scene.key)) {
            return;
        }

        this.resizeIntern();
    }

    protected resizeIntern(gameSize = this.scale.gameSize): void {
        //const zoomY = 1;
        let zoom = 1;

        const aspectRatio =
            document.documentElement.clientWidth /
            document.documentElement.clientHeight;
        let isIphone = false;
        // temporary fix for pixelisation issue. old system only left on iphone
        if (navigator.userAgent.includes('iPhone')) {
            isIphone = true;
        }

        if (isIphone) {
            const isPortrait = aspectRatio < 1;
            if (!isPortrait) {
                zoom = Math.max(
                    document.documentElement.clientWidth /
                        this.originalSize.width,
                    document.documentElement.clientHeight /
                        this.originalSize.height
                );
            } else {
                zoom = Math.max(
                    document.documentElement.clientWidth /
                        this.originalSize.height,
                    document.documentElement.clientHeight /
                        this.originalSize.width
                );
            }

            this.cameras.main.setZoom(zoom);
            this.cameras.main.scrollX = 0; //-gameSize.width / 2;
            this.cameras.main.scrollY = (-1.25 * gameSize.height) / zoom;
        } else {
            zoom = 0.8;
            this.cameras.main.setZoom(zoom);
            this.cameras.main.scrollX = 0; //-gameSize.width / 2;
            this.cameras.main.scrollY = (-1.45 * gameSize.height) / zoom;
        }

        //zoomY = document.documentElement.clientHeight / this.originalSize.height;

        this.winAnimation.resizeIntern(gameSize); //this.cameras.main.setOrigin(0, 1);
    }

    resize(gameSize = this.scale.gameSize): void {
        if (!this.scene.manager.isActive(this.scene.key)) {
            return;
        }

        this.resizeIntern(gameSize);
    }

    testAllWinAnimations(): void {
        // setTimeout(() => {
        //     this.game.events.emit("event-start-bigwin-win", BigWinAnimationType.lineWin, 7000);
        // }, 1000);

        // setTimeout(() => {
        //     this.game.events.emit("event-start-bigwin-win", WinAnimationType.winx2, 5000);
        // }, 10000);

        this.game.events.emit(
            'event-start-bigwin-lineWinCoins',
            BigWinAnimationType.lineWin
        );

        setTimeout(() => {
            this.game.events.emit(
                'event-start-bigwin-win',
                BigWinAnimationType.midWin,
                5000
            );
        }, 1000);

        setTimeout(() => {
            this.game.events.emit(
                'event-start-bigwin-win',
                BigWinAnimationType.bigWin,
                5000
            );
        }, 7000);

        setTimeout(() => {
            this.game.events.emit(
                'event-start-bigwin-win',
                BigWinAnimationType.megaWin,
                10000
            );
        }, 15000);
    }
}
