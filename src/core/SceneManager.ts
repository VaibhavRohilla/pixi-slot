import { Container } from 'pixi.js';
import { Scene } from '../scenes/Scene';
import { Globals } from '../Global';

export class SceneManager {
    private static instance: SceneManager;
    private currentScene: Scene | null = null;
    private scenes: Map<string, Scene> = new Map();

    private constructor() {}

    public static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }

    public addScene(name: string, scene: Scene): void {
        this.scenes.set(name, scene);
    }

    public async changeScene(name: string): Promise<void> {
        const scene = this.scenes.get(name);
        if (!scene) {
            throw new Error(`Scene ${name} not found`);
        }

        if (!Globals.app) {
            throw new Error('Application not initialized');
        }

        // Remove current scene if exists
        if (this.currentScene) {
            Globals.app.stage.removeChild(this.currentScene);
        }

        // Add new scene
        this.currentScene = scene;
        Globals.app.stage.addChild(scene);
    }

    public getCurrentScene(): Scene | null {
        return this.currentScene;
    }

    public onResize(): void {
        if (this.currentScene) {
            this.currentScene.onResize();
        }
    }

    public destroy(): void {
        if (this.currentScene && Globals.app) {
            Globals.app.stage.removeChild(this.currentScene);
        }
        this.scenes.clear();
        this.currentScene = null;
    }
}
