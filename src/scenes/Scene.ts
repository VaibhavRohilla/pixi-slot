import { Container, DisplayObject } from 'pixi.js';

export abstract class Scene extends Container {
    constructor() {
        super();
    }

    public abstract onResize(): void;

    public update(delta: number): void {
        // Optional update method that can be overridden by child classes
    }

    public addChild<T extends DisplayObject>(...children: T[]): T {
        return super.addChild(...children);
    }

    public removeChild<T extends DisplayObject>(...children: T[]): T {
        return super.removeChild(...children);
    }
} 