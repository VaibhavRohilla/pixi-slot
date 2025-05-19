import { Application } from 'pixi.js';
import { SceneManager } from './scenemanager/SceneManager';
import { Texture } from 'pixi.js';
import { Howl } from 'howler';

export class Globals {
    public static app: Application | null = null;
    public static sceneManager: SceneManager | null = null;
    public static isMobile: boolean = false;
    public static screenWidth: number = 0;
    public static screenHeight: number = 0;
    public static gameWidth: number = 0;
    public static gameHeight: number = 0;
    public static scale: number = 1;
    public static width: number = 0;
    public static height: number = 0;
    public static resources: { [key: string]: Texture | any } = {};
    public static soundResources: { [key: string]: Howl } = {};
    public static language: string = 'en';

    public static init(app: Application): void {
        this.app = app;
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.width = this.screenWidth;
        this.height = this.screenHeight;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Calculate game dimensions and scale
        const targetWidth = 1920;
        const targetHeight = 1080;
        const scaleX = this.screenWidth / targetWidth;
        const scaleY = this.screenHeight / targetHeight;
        this.scale = Math.min(scaleX, scaleY);
        
        this.gameWidth = targetWidth;
        this.gameHeight = targetHeight;
    }

    public static destroy(): void {
        this.app = null;
        this.sceneManager = null;
        this.resources = {};
        this.soundResources = {};
    }
}
