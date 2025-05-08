export function generateRoundedRectTexture(
    scene: Phaser.Scene,
    textureKey: string,
    w = 150,
    h = 50,
    radius = 10,
    color = 0x000000,
    borderColor = 0xffffff,
    alpha = 1
): string {
    if (!scene.textures.exists(textureKey)) {
        console.log('generating...key, color', textureKey, color);
        const graphics = scene.add.graphics();

        graphics.clear();
        graphics.fillStyle(color, 0.95);
        graphics.fillRoundedRect(radius, radius, w, h, radius);
        graphics.lineStyle(3, borderColor, alpha);
        graphics.strokeRoundedRect(radius, radius, w, h, radius);
        graphics.generateTexture(textureKey, w + 2 * radius, h + 2 * radius);
        graphics.destroy();
    }

    return textureKey;
}
