import { AnimationWin } from './animationWin/animationWin';
import { AnimationPrewin } from './animationPrewin/animationPrewin';
import { AnimationBonusEnd } from './animationBonusEnd/animationBonusEnd';
import { configAnimationWin } from '@specific/config';

export default function initComplexAnimationsEvents(scene: Phaser.Scene): any {
    const complexAnimations = {
        AnimationWin: new AnimationWin(scene, configAnimationWin),
        AnimationPrewin: new AnimationPrewin(scene.scene.get('WinLines')),
        AnimationBonusEnd: new AnimationBonusEnd(scene),
    };
    return complexAnimations;

    // initKeyboardInputEvents(scene);
    // initButtonInputEvents(scene);

    // scene.game.events.on(`event-user-input-${eUserInputCommands.spinPressed}`, () => `event-user-input-${eUserInputCommands.spinPressed}`);
    // scene.game.events.on(`event-user-input-${eUserInputCommands.betPopup}`, () => `event-user-input-${eUserInputCommands.betPopup}`);
    // scene.game.events.on(`event-user-input-${eUserInputCommands.betRequest}`, () => `event-user-input-${eUserInputCommands.betRequest}`);
}
