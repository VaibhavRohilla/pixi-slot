export interface LoadingBarConfig {
    width: number;
    height: number;
    backgroundColor: number;
    progressColor: number;
}

export interface LoadingTextConfig {
    text: string;
    fontFamily: string;
    fontSize: number;
    fill: number;
}

export const loadingConfig = {
    bar: {
        width: 400,
        height: 20,
        backgroundColor: 0x000000,
        progressColor: 0x00ff00
    } as LoadingBarConfig,
    
    text: {
        text: 'Loading...',
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff
    } as LoadingTextConfig
}; 