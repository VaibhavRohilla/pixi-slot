import { globalGetIsPortrait } from '../globalGetIsPortrait';

export default abstract class ComponentLayer extends Phaser.Scene {
    oldIsPort: boolean;
    init(data: object): void {
        this.oldIsPort = globalGetIsPortrait(this);
        data;
        this.scale.on(Phaser.Scale.Events.RESIZE, this.resizeWithDelay, this);

        if (!navigator.userAgent.includes('Mobile')) {
            this.scale.on(
                Phaser.Scale.Events.RESIZE,
                (args: any) => {
                    args;
                    const isPort = globalGetIsPortrait(this);
                    if (this.oldIsPort != isPort) {
                        this.oldIsPort = isPort;
                        this.scale.emit(
                            Phaser.Scale.Events.ORIENTATION_CHANGE,
                            isPort ? 'portrait' : 'landscape'
                        );
                    }
                },
                this
            );
        }

        this.scale.on(
            Phaser.Scale.Events.ORIENTATION_CHANGE,
            () => {
                this.orientationChange(this.scale.orientation);
            },
            this
        );

        this.addAnimations();
    }

    resizeWithDelay(
        gameSize: Phaser.Structs.Size = this.scale.gameSize,
        baseSize: Phaser.Structs.Size = this.scale.baseSize,
        displaySize: Phaser.Structs.Size = this.scale.displaySize,
        resolution: number = this.scale.resolution,
        previousWidth: number = this.scale.width,
        previousHeight: number = this.scale.height
    ): void {
        setTimeout(() => {
            this.resize(gameSize, baseSize, displaySize, resolution, previousWidth, previousHeight);
        }, 50); // Adjust the delay (in milliseconds) as needed
    }

// Your existing resize method
    resize(
        gameSize: Phaser.Structs.Size = this.scale.gameSize,
        baseSize: Phaser.Structs.Size = this.scale.baseSize,
        displaySize: Phaser.Structs.Size = this.scale.displaySize,
        resolution: number = this.scale.resolution,
        previousWidth: number = this.scale.width,
        previousHeight: number = this.scale.height
    ): void {
        // Your resize logic here
        const isPort = globalGetIsPortrait(this);
    }

    orientationChange(orientation = this.scale.orientation): void {
        //hook
        orientation;
    }

    addAnimations(): void {
        //hook
    }
}
