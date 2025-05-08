import { Graphics, Text } from 'pixi.js';
import { Scene } from '../core/Scene';
import { EventManager, GameEvent } from '../utils/EventManager';
import { Loader } from '../utils/Loader';

export class LoadingScene extends Scene {
    private loadingBar: Graphics;
    private loadingText: Text;
    private readonly loadingBarWidth: number = 400;
    private readonly loadingBarHeight: number = 20;
    private eventManager: EventManager;
    private loader: Loader;

    constructor() {
        super('LoadingScene');
        this.eventManager = EventManager.getInstance();
        this.loader = Loader.getInstance();
        this.loadingBar = new Graphics();
        this.loadingText = new Text('Loading...', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff
        });
        this.setup();
    }

    private setup(): void {
        // Setup loading bar
        this.loadingBar.beginFill(0x000000);
        this.loadingBar.drawRect(0, 0, this.loadingBarWidth, this.loadingBarHeight);
        this.loadingBar.endFill();
        this.loadingBar.x = (window.innerWidth - this.loadingBarWidth) / 2;
        this.loadingBar.y = (window.innerHeight - this.loadingBarHeight) / 2;

        // Setup loading text
        this.loadingText.x = (window.innerWidth - this.loadingText.width) / 2;
        this.loadingText.y = this.loadingBar.y - 40;

        this.addChild(this.loadingBar);
        this.addChild(this.loadingText);
    }

    private updateLoadingBar(progress: number): void {
        const progressWidth = this.loadingBarWidth * progress;
        this.loadingBar.clear();
        this.loadingBar.beginFill(0x000000);
        this.loadingBar.drawRect(0, 0, this.loadingBarWidth, this.loadingBarHeight);
        this.loadingBar.endFill();
        this.loadingBar.beginFill(0x00ff00);
        this.loadingBar.drawRect(0, 0, progressWidth, this.loadingBarHeight);
        this.loadingBar.endFill();
    }

    public async init(): Promise<void> {
        await this.startLoading();
    }

    private async startLoading(): Promise<void> {
        try {
            // Initialize assets
            console.log('Initializing assets...');
            await this.loader.init();

            // Load bundles in sequence
            console.log('Loading game bundle...');
            await this.loader.load('game', this.updateLoadingBar.bind(this));

            console.log('Loading winlines bundle...');
            await this.loader.load('winlines', this.updateLoadingBar.bind(this));

            console.log('Loading symbols bundle...');
            await this.loader.load('symbols', this.updateLoadingBar.bind(this));

            console.log('Loading freeSpinsIntro bundle...');
            await this.loader.load('freeSpinsIntro', this.updateLoadingBar.bind(this));

            console.log('Loading audio bundle...');
            await this.loader.load('audio', this.updateLoadingBar.bind(this));

            console.log('All assets loaded successfully');
            this.eventManager.emit(GameEvent.LOADING_COMPLETE);
        } catch (error) {
            console.error('Error during loading:', error);
            this.eventManager.emit(GameEvent.LOADING_ERROR, error);
        }
    }

    protected onUpdate(delta: number): void {
        // No update logic needed for loading scene
    }

    public onResize(): void {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        this.loadingBar.position.set(centerX - this.loadingBarWidth / 2, centerY - this.loadingBarHeight / 2);
        this.loadingText.position.set(centerX, centerY - 40);
    }

    public update(delta: number): void {
        // Optional update logic if needed
    }
} 