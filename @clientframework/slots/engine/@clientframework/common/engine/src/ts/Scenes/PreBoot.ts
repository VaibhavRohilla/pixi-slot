export default class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: 'PreBoot',
            active: true,
        });
    }

    preload(): void {
        const a = this.textures.createCanvas('whiteBoard', 100, 100);
        const grd = a.context.createLinearGradient(0, 0, 100, 100);
        grd.addColorStop(0, '#ffffff');
        grd.addColorStop(1, '#ffffff');
        a.context.fillStyle = grd;
        a.context.fillRect(0, 0, 100, 100);

        const a2 = this.textures.createCanvas('gradient', 752, 133);
        const grd2 = a2.context.createLinearGradient(0, 0, 752, 133);
        grd2.addColorStop(0, '#ffffff');
        grd2.addColorStop(1, '#ffffff');
        a2.context.fillStyle = grd2;
        a2.context.fillRect(4, 4, 744, 12);

        const a3 = this.textures.createCanvas('gradient2', 752, 133);
        const grd3 = a3.context.createLinearGradient(0, 0, 752, 133);
        grd3.addColorStop(0, '#000000');
        grd3.addColorStop(1, '#000000');
        a3.context.fillStyle = grd3;
        a3.context.fillRect(0, 0, 752, 20);

        this.load.image(
            'preBootLogo',
            require('ASSETS_DIR_COMMON/game_logo_0000.png')
        );
    }

    create(): void {
        this.scene.start('Boot');
        //this.cameras.main.setBackgroundColor('#FFFFF');
    }
}
