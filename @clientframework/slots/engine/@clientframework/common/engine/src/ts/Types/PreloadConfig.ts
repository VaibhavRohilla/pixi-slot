export default interface IPreloadConfig {
    preboot?: IScenePreloadConfig;
    boot?: IScenePreloadConfig;

    preload?: IScenePreloadConfig;
}

interface IImagePreloadConfig {
    key:
        | string
        | Phaser.Types.Loader.FileTypes.ImageFileConfig
        | Phaser.Types.Loader.FileTypes.ImageFileConfig[];
    url?: string | string[];
    xhrSettings?: Phaser.Types.Loader.XHRSettingsObject;
}

interface IAtlasPreloadConfig {
    key:
        | string
        | Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig
        | Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig[];
    textureURL?: string | string[];
    atlasURL?: string;
    textureXhrSettings?: Phaser.Types.Loader.XHRSettingsObject;
    atlasXhrSettings?: Phaser.Types.Loader.XHRSettingsObject;
}

interface IAudioPreloadConfig {
    key:
        | string
        | Phaser.Types.Loader.FileTypes.ImageFileConfig
        | Phaser.Types.Loader.FileTypes.ImageFileConfig[];
    url?: string | string[];
}

interface IScenePreloadConfig {
    image?: IImagePreloadConfig[];
    atlas?: IAtlasPreloadConfig[];
    bitmapFont?: IAtlasPreloadConfig[];
    multiatlas?: Phaser.Types.Loader.FileTypes.MultiAtlasFileConfig[];
    audio?: IAudioPreloadConfig[];
}
