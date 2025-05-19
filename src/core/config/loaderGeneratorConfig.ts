export interface SpriteSheetConfig {
    frameWidth: number;
    frameHeight: number;
    pattern: RegExp;
    frameRate?: number; // Optional frame rate, defaults to 30 if not specified
}

export interface AudioConfig {
    path: string;
    format?: string[]; // Supported audio formats (e.g., ['mp3', 'wav'])
}

export interface BundleConfig {
    name: string;
    path: string;
    spriteSheets?: {
        [key: string]: SpriteSheetConfig;
    };
    audio?: AudioConfig;
}

export const bundleConfigs: BundleConfig[] = [
    {
        name: 'game',
        path: 'src/assets/Images'
    },
    {
        name: 'symbols',
        path: 'src/assets/Images/Symbols'
    },
    {
        name: 'effects',
        path: 'src/assets/Images/Effects'
    },
    {
        name: 'background',
        path: 'src/assets/Images/BG'
    },
    {
        name: 'freeSpins',
        path: 'src/assets/Images/FreeSpins'
    },
    {
        name: 'sidePanel',
        path: 'src/assets/Images/Sidepanel'
    },
    {
        name: 'audio',
        path: 'src/assets/audio',
        audio: {
            path: 'src/assets/audio',
            format: ['mp3', 'ogg']
        }
    }
]; 