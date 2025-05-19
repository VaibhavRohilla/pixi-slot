import { Graphics, Text } from 'pixi.js';
import { Scene } from '../core/scenemanager/Scene';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Loader } from '../core/loader/Loader';
import { Globals } from '../core/Global';
import { loadingConfig } from '../core/utils/loadingConfig';

export class LoadingScene extends Scene {
    private loadingBar: Graphics;
    private loadingText: Text;
    private eventManager: EventManager;
    private loader: Loader;

    constructor() {
        super('LoadingScene');
        this.eventManager = EventManager.getInstance();
        this.loader = Loader.getInstance();
        this.loadingBar = new Graphics();
        this.loadingText = new Text(loadingConfig.text.text, {
            fontFamily: loadingConfig.text.fontFamily,
            fontSize: loadingConfig.text.fontSize,
            fill: loadingConfig.text.fill
        });
        this.setup();
    }

    private setup(): void {
        // Setup loading bar
        this.loadingBar.beginFill(loadingConfig.bar.backgroundColor);
        this.loadingBar.drawRect(0, 0, loadingConfig.bar.width, loadingConfig.bar.height);
        this.loadingBar.endFill();
        this.loadingBar.x = (window.innerWidth - loadingConfig.bar.width) / 2;
        this.loadingBar.y = (window.innerHeight - loadingConfig.bar.height) / 2;

        // Setup loading text
        this.loadingText.x = (window.innerWidth - this.loadingText.width) / 2;
        this.loadingText.y = this.loadingBar.y - 40;

        this.addChild(this.loadingBar);
        this.addChild(this.loadingText);
    }

    private updateLoadingBar(progress: number): void {
        const progressWidth = loadingConfig.bar.width * progress;
        this.loadingBar.clear();
        this.loadingBar.beginFill(loadingConfig.bar.backgroundColor);
        this.loadingBar.drawRect(0, 0, loadingConfig.bar.width, loadingConfig.bar.height);
        this.loadingBar.endFill();
        this.loadingBar.beginFill(loadingConfig.bar.progressColor);
        this.loadingBar.drawRect(0, 0, progressWidth, loadingConfig.bar.height);
        this.loadingBar.endFill();
    }

    public async init(): Promise<void> {
        await this.startLoading();
    }

    private async startLoading(): Promise<void> {
        try {
            await this.loader.init();

            // Load all bundles dynamically
            console.log('Loading all bundles...');
            await this.loader.loadAllBundles(this.updateLoadingBar.bind(this));

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

        this.loadingBar.position.set(centerX - loadingConfig.bar.width / 2, centerY - loadingConfig.bar.height / 2);
        this.loadingText.position.set(centerX, centerY - 40);
    }

    public update(delta: number): void {
        // Optional update logic if needed
    }
} 