export abstract class ComplexAnimation {
    protected _startedTime = -1;

    private _isRunning = false;
    private _waitingForPreseterData = false;
    protected get isRunning(): boolean {
        return this._isRunning;
    }

    constructor(protected scene: Phaser.Scene, protected key: string) {
        scene.game.events.on(
            `event-animation-${this.key}-interrupt`,
            this.onInterrupt,
            this
        );
        scene.game.events.on(
            `event-animation-${this.key}-start`,
            this.start,
            this
        );
        scene.game.events.on(`event-animation-${this.key}-end`, this.end, this);
    }

    protected start(data): void {
        this._startedTime = this.scene.time.now;
        console.log(`event-animation-${this.key}-start`);
        this.scene.game.events.emit(`event-animation-${this.key}-started`);
        this._isRunning = true;

        this.onStart(data);
    }

    protected onStart(data): void {
        data;
        //hook
    }

    protected end(): void {
        this.onEnd();
        this._startedTime = this.scene.time.now;
        this.scene.game.events.emit(`event-animation-${this.key}-ended`);
        this._isRunning = false;
    }

    protected onEnd(): void {
        //hook
    }

    protected onInterrupt(): void {
        this.end();
    }
}
