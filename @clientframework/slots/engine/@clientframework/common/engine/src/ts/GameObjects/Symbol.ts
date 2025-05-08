export default class Symbol extends Phaser.GameObjects.Sprite {
    constructor(
        protected symbolType: string,
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame?: string | integer
    ) {
        super(scene, x, y, texture, frame);
    }
}
