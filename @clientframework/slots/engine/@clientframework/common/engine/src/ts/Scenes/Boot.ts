import Game from '../Game';
import _forEach from 'lodash-es/forEach';
import _find from 'lodash-es/find';
import ComponentLayer from './ComponentLayer';
import { getPreloadStartBackgroundAnimations } from '@clientframework/slots/engine/src/ts/dataPresenter/defaultConfigSlot';
import { PreBootLogo } from '../GameObjects/preBootLogo';

export default class Boot extends ComponentLayer {
    constructor() {
        super({
            key: 'Boot',
        });
    }

    preBootLogo: PreBootLogo;
    preload(): void {
        this.preBootLogo = new PreBootLogo(this);

        this.resize();

        this.load.on('complete', () => {
            console.log('boot preload complete');

            this.scene.start('Background');
            if (getPreloadStartBackgroundAnimations()) {
                this.scene.start('BackgroundAnimations');
            }
            this.scene.start('Preload');
        });

        _forEach((this.game as Game).preloadConfig.boot.image, (i) => {
            this.load.image(i.key, i.url, i.xhrSettings);
        });

        _forEach((this.game as Game).preloadConfig.boot.atlas, (a) => {
            this.load.atlas(
                a.key,
                a.textureURL,
                a.atlasURL,
                a.textureXhrSettings,
                a.atlasXhrSettings
            );
        });
        // _forEach((this.game as Game).preloadConfig.boot.multiatlas, (a) => {
        //     this.load.multiatlas(
        //         a.key,
        //         a.textureURL,
        //         a.atlasURL,
        //         a.textureXhrSettings,
        //         a.atlasXhrSettings
        //     );
        // });
        _forEach((this.game as Game).preloadConfig.boot.multiatlas, (m) => {
            m &&
                this.load.json(
                    `${m.key}-temp`,
                    m.atlasURL,
                    null,
                    m.atlasXhrSettings
                );
        });

        this.load.on('filecomplete', (key: string, type: string, data: any) => {
            if (type === 'json' && key.includes('-temp')) {
                const multiatlasConfig = _find(
                    (this.game as Game).preloadConfig.boot.multiatlas,
                    ['key', key.replace('-temp', '')]
                );

                if (!multiatlasConfig) {
                    return;
                }

                this.cache.json.remove(key);

                _forEach(data.textures, (texture: any) => {
                    texture.image = (<any>multiatlasConfig).path(
                        `./${texture.image}`
                    );
                });

                this.load.multiatlas(multiatlasConfig.key, data);
                this.load.start();
            }
        });
    }

    resize(gameSize: Phaser.Structs.Size = this.scale.gameSize): void {
        this.preBootLogo.resize(gameSize);
    }
}
