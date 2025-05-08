import _forEach from 'lodash-es/forEach';
import _find from 'lodash-es/find';
import Game from '../../Game';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PreloadScene',
        });
    }

    public preload(): void {
        this.load.on('progress', (value: number) => {
            console.log('progress', value);
            this.game.events.emit('event-preload-progress', value);
        });

        this.load.on('complete', () => {
            console.log('event-preload-complete');
            this.game.events.emit('event-preload-complete');
        });

        // _forEach((this.game as Game).preloadConfig.boot.image, (i)=>
        // {
        //     this.load.image(i.key, i.url, i.xhrSettings);
        // });
        const preloadConfig = (this.game as Game).preloadConfig.preload;

        // Multiatlases

        _forEach(preloadConfig.multiatlas, (m) => {
            this.load.json(
                `${m.key}-temp`,
                m.atlasURL,
                null,
                m.atlasXhrSettings
            );
        });

        this.load.on('filecomplete', (key: string, type: string, data: any) => {
            if (type === 'json' && key.includes('-temp')) {
                const multiatlasConfig = _find(preloadConfig.multiatlas, [
                    'key',
                    key.replace('-temp', ''),
                ]);

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

        // Images

        _forEach(preloadConfig.image, (i) => {
            this.load.image(i.key, i.url, i.xhrSettings);
        });

        // Atlases

        _forEach(preloadConfig.atlas, (a) => {
            this.load.atlas(
                a.key,
                a.textureURL,
                a.atlasURL,
                a.textureXhrSettings,
                a.atlasXhrSettings
            );
        });

        // BitMapFont

        _forEach(preloadConfig.bitmapFont, (a) => {
            this.load.bitmapFont(
                a.key,
                a.textureURL,
                a.atlasURL,
                a.textureXhrSettings,
                a.atlasXhrSettings
            );
        });

        // Audio
        _forEach(preloadConfig.audio, (a) => {
            this.load.audio(a.key, a.url);
        });
    }
}
