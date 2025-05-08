export class PreBootLogo {
    private logo: Phaser.GameObjects.Image;
    private bg: Phaser.GameObjects.Image;
    showTween: Phaser.Tweens.Tween;
    private _myDepth = 101;
    loadingBarOff: Phaser.GameObjects.Image;
    loadingBarOn: Phaser.GameObjects.Image;

    constructor(protected scene: Phaser.Scene) {
        this.logo = this.scene.add.image(500, 500, 'preBootLogo'); //'preBootLogo');
        // scene.cameras.main.setBackgroundColor('#FFFFFF');
        console.log(this.scene.scene.key);
        this.logo.setScale(0.15);
        this.logo.setDepth(this._myDepth);

        this.bg = this.scene.add.image(500, 500, 'whiteBoard'); //'preBootLogo');
        this.bg.setDepth(this._myDepth - 1);
        this.bg.setActive(false).setVisible(false)

        this.loadingBarOff = this.scene.add.image(0, 0, 'gradient2');
        this.loadingBarOff.setDepth(1000);

        this.loadingBarOn = this.scene.add.image(0, 0, 'gradient');
        this.loadingBarOn.setDepth(1000);

        this.scene.game.events.on(
            'event-preload-complete',
            this.fadeOutAndDestroy,
            this
        );
    }

    resize(gameSize: Phaser.Structs.Size): void {
        if (this.logo) {
            this.logo.x = gameSize.width / 2;
            this.logo.y = gameSize.height / 2;
        }
        if (this.bg) {
            this.bg.x = gameSize.width / 2;
            this.bg.y = gameSize.height / 2;
        }
        this.bg.setScale(30);
    }

    private fadeOutAndDestroy(): void {
        this.logo.setAlpha(1);
        this.bg.setAlpha(1);
        this.loadingBarOff.setAlpha(1).setActive(false).setVisible(false);
        this.loadingBarOn.setAlpha(1).setActive(false).setVisible(false);
        this.showTween && this.showTween.stop();
        this.showTween = this.scene.add.tween({
            targets: [
                this.logo,
                this.bg
            ],
            duration: 600,
            alpha: 0,
            ease: 'Linear',
            onComplete: () => {
                this.logo.destroy();
                this.bg.destroy();
                this.loadingBarOn.destroy();
                this.loadingBarOff.destroy();
            },
        });
    }

    get myDepth(): number {
        return this._myDepth;
    }
}
