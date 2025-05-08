export default class AnimatedParticle extends Phaser.GameObjects.Particles
    .Particle {
    static anim: Phaser.Animations.Animation[] = [];
    t: number;
    currentFrame: number;
    animationIndex: number;
    direction: boolean;

    constructor(emitter: any) {
        super(emitter);

        this.t = 0;
        // Randomize animation to play
        this.animationIndex = Phaser.Math.Between(
            0,
            AnimatedParticle.anim.length - 1
        );
        // Randomize starting frame of animation
        this.currentFrame = Phaser.Math.Between(
            0,
            AnimatedParticle.anim[this.animationIndex].frames.length - 1
        );
        // Randomize direction of animation
        this.direction = Phaser.Math.Between(0, 1) === 1 ? true : false;
    }

    update(delta: number, step: number, processors: any[]): boolean {
        const result = super.update(delta, step, processors);

        this.t += delta;

        if (this.t >= AnimatedParticle.anim[this.animationIndex].msPerFrame) {
            if (this.direction) {
                this.currentFrame++;
            } else {
                this.currentFrame--;
            }

            if (
                this.currentFrame >=
                AnimatedParticle.anim[this.animationIndex].frames.length
            ) {
                this.currentFrame = 0;
            }
            if (this.currentFrame < 0) {
                this.currentFrame =
                    AnimatedParticle.anim[this.animationIndex].frames.length -
                    1;
            }

            this.frame =
                AnimatedParticle.anim[this.animationIndex].frames[
                    this.currentFrame
                ].frame;

            this.t -= AnimatedParticle.anim[this.animationIndex].msPerFrame;
        }

        return result;
    }
}
