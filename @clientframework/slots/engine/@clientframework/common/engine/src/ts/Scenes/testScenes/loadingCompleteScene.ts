import BackgroundBasis from './BackgroundBasis';
import { globalGetIsPortrait } from '../../globalGetIsPortrait';

export default class LoadingCompleteScene extends BackgroundBasis {
    private pressToStart: Phaser.GameObjects.Sprite = null;
    private blackField: Phaser.GameObjects.Image = null;

    constructor() {
        super({
            key: 'LoadingCompleteScene',
        });
    }

    orientationChange(): void {
        super.orientationChange();

        if (this.blackField) {
            this.blackField.rotation = globalGetIsPortrait(this)
                ? Math.PI / 2
                : 0;
        }
    }

    preload(): void {
        console.log('LoadingCompleteScene preload');
        if (navigator.userAgent.includes('Mobile')) {
            this.load.atlas(
                'pressToStart',
                require('ASSETS_DIR_COMMON/tapToStart.png'),
                require('ASSETS_DIR_COMMON/tapToStart.json')
            );
        } else {
            this.load.atlas(
                'pressToStart',
                require('ASSETS_DIR_COMMON/clickToStart.png'),
                require('ASSETS_DIR_COMMON/clickToStart.json')
            );
        }
        this.load.image(
            'blackField',
            require('ASSETS_DIR_COMMON/blackField.png')
        );
    }

    createSpecific(): void {
        console.log('LoadingCompleteScene create');
        const xx = 0; //Number(this.game.config.width) / 2;
        const yy = 0; //Number(this.game.config.height) / 2;

        this.blackField = this.add.image(xx, yy, 'blackField');
        this.blackField.setScale(10, 10);
        this.blackField.setAlpha(0.3);
        this.blackField.setInteractive();

        this.blackField.on('pointerup', () => {
            this.pressedToStartClicked();
        });

        this.pressToStart = this.add.sprite(xx, yy, 'pressToStart');
        this.pressToStart.setScale(1, 1);
        const frameNames = this.anims.generateFrameNames('pressToStart');
        this.anims.create({
            key: 'pressToStartAnim',
            frames: frameNames,
            repeat: -1,
            frameRate: 5,
        });
        this.pressToStart.anims.play('pressToStartAnim');
    }

    pressedToStartClicked(): void {
        console.log('pressedToStartClicked()');
        this.game.events.emit('event-loading-complete-scene-clicked');
    }
}
