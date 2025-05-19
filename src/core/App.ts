import { Application, Container } from 'pixi.js';
import { SceneManager } from './scenemanager/SceneManager';
import { LoadingScene } from '../scenes/LoadingScene';
import { SlotScene } from '../scenes/SlotScene';
import { EventManager, GameEvent } from './utils/EventManager';
import { Globals } from './Global';
import * as TWEEN from '@tweenjs/tween.js';
import { ServerCommunicationService } from './services/ServerCommunicationService';
import { StatisticsController } from './services/StatisticsController';
import { LocalizationService } from './services/LocalizationService';
import { HistoryController } from '../controller/HistoryController';

const isDevelopment = process.env.NODE_ENV === 'development';

export class App {
    private static instance: App;
    private app: Application;
    private sceneManager: SceneManager;
    private eventManager: EventManager;
    private serverService!: ServerCommunicationService;
    private statisticsController!: StatisticsController;
    private localizationService!: LocalizationService;
    private historyController!: HistoryController;

    private constructor() {
        // Create the PIXI application
        this.app = new Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x000000,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: true,
        });

        // Mount the view to the DOM
        const gameContainer = document.getElementById('game');
        if (gameContainer) {
            gameContainer.appendChild(this.app.view as HTMLCanvasElement);
        } else {
            document.body.appendChild(this.app.view as HTMLCanvasElement);
        }

        // Set canvas style
        const canvas = this.app.view as HTMLCanvasElement;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        // Initialize global app reference and managers
        Globals.init(this.app);
        this.eventManager = EventManager.getInstance();
        this.sceneManager = SceneManager.getInstance();

        // Initialize services
        this.initializeServices();

        this.setupEventListeners();
    }

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    private initializeServices(): void {
        console.log('Initializing services...');
        
        // Server communication service
        this.serverService = ServerCommunicationService.getInstance();
        
        // Statistics controller (for tracking game metrics)
        this.statisticsController = StatisticsController.getInstance({
            saveToLocalStorage: true,
            trackAcrossSessions: true,
            clockFormat: '24h'
        });
        
        // Localization service (for multi-language support)
        this.localizationService = LocalizationService.getInstance({
            defaultLanguage: 'en',
            availableLanguages: ['en', 'es'],
            detectBrowserLanguage: true,
            autoLoadTranslations: true
        });
        
        // History controller (for game history)
        this.historyController = HistoryController.getInstance({
            maxLocalRecords: 50,
            saveToLocalStorage: true,
            fetchFromServer: true
        });
    }

    private setupEventListeners(): void {
        // Window resize
        window.addEventListener('resize', this.onResize.bind(this));

        // Game events
        this.eventManager.on(GameEvent.LOADING_COMPLETE, this.onLoadingComplete.bind(this));
        this.eventManager.on(GameEvent.LOADING_ERROR, this.onLoadingError.bind(this));
    }

    public async init(): Promise<void> {
        try {
            console.log('Initializing application...');

            // Create and add loading scene
            const loadingScene = new LoadingScene();
            this.sceneManager.addScene('loading', loadingScene);

            // Start with loading scene
            await this.sceneManager.changeScene('loading');

            // Initialize loading scene
            await loadingScene.init();

            // Start game loop
            this.app.ticker.add(this.gameLoop.bind(this));

            console.log('Application initialized successfully');
            this.eventManager.emit(GameEvent.GAME_STARTED);
        } catch (error) {
            console.error('Failed to initialize application:', error);
            throw error;
        }
    }

    private async onLoadingComplete(): Promise<void> {
        console.log('Loading complete, transitioning to slot scene');

        try {
            // Create and add slot scene
            const slotScene = new SlotScene();
            this.sceneManager.addScene('slot', slotScene);

            // Switch to slot scene
            await this.sceneManager.changeScene('slot');
        } catch (error) {
            console.error('Error transitioning to slot scene:', error);
        }
    }

    private onLoadingError(error: any): void {
        console.error('Loading error:', error);
        // Handle loading error (e.g., show error screen)
    }

    private gameLoop(delta: number): void {
        // Update TweenJS
        TWEEN.update();

        // Update current scene
        const currentScene = this.sceneManager.getCurrentScene();
        if (currentScene?.update) {
            currentScene.update(delta);
        }
    }

    private onResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.app.renderer.resize(width, height);
        this.sceneManager.onResize();
    }

    public destroy(): void {
        console.log('Destroying application...');

        // Stop game loop
        this.app.ticker.stop();

        // Remove event listeners
        window.removeEventListener('resize', this.onResize.bind(this));

        // Clean up services
        if (this.statisticsController) {
            // Explicit destroy method call if service has one
            this.statisticsController.destroy();
        }

        // Destroy managers
        this.sceneManager.destroy();
        this.eventManager.destroy();

        // Destroy PIXI application
        this.app.destroy(true, { children: true, texture: true, baseTexture: true });
    }
}

// Create and export a singleton instance
export const app = App.getInstance();
