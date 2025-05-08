import { preloadAndCreateErrorPopups } from '@backendService/errorsHandling/errorHandler';
import { setEventEmitter } from '@backendService/eventEmitter';
import { startClientConnection } from '@backendService/startClientConnection';
import { setIntroScenesEvents } from '../Scenes/testScenes/setIntroScenesEvents';
import BackgroundBasis from '../Scenes/testScenes/BackgroundBasis';
import StateMachine from './stateMachine';
import { IS_USING_TRUE_RGS, IS_OFFLINE } from '@specific/dataConfig';
import { globalGetIsPortrait } from '../globalGetIsPortrait';

export default abstract class StateMachineLayer extends BackgroundBasis {
    protected stateMachine: StateMachine<Phaser.Scene> = null;

    private isDebug = false;
    private debugText: Phaser.GameObjects.Text;
    protected debugTextList: string[];
    private debugErrorMsg = '';

    constructor() {
        super({
            key: 'StateMachineLayer',
            active: true,
        });

        this.scaleMobile = 1;
        this.scaleDesktopLandscape = 1;
        this.scaleDesktopPortrait = 1.3;
    }

    initSpecific(): void {
        console.log('create emitter, model and connection');
        setEventEmitter(this.game.events);
        if (this.scene.manager.getScene('LoadingIntroScene')) {
            setIntroScenesEvents(this);
        }
    }

    public preload(): void {
        console.log('state machine preload');
        preloadAndCreateErrorPopups(this);
    }

    protected createSpecific(): void {
        this.stateMachine = new StateMachine(this.game.events, this);

        if (this.isDebug) {
            this.createDebug();
        }

        this.initStatesEventsUserInputEtc();

        const isOffline = IS_OFFLINE;
        const usingTrueRGS = IS_USING_TRUE_RGS;
        startClientConnection(usingTrueRGS, isOffline);
    }

    protected initStatesEventsUserInputEtc(): void {
        //hook
    }

    /////////////////////////////////////////////////////////
    // DEBUG

    createDebug(): void {
        this.debugText = this.add.text(10, 10, 'Move the mouse', {
            font: '12px Courier',
            fill: '#00ff00',
            align: 'left',
        });
        this.debugText.setOrigin(0);
        this.debugText.setDepth(10001);
        this.game.events.on(
            'event-error-popup',
            (arg) => (this.debugErrorMsg = arg),
            this
        );
    }

    update(): void {
        if (this.isDebug) {
            this.updateDebug();
        }
    }

    resizeIntern(gameSize = this.scale.gameSize): void {
        super.resizeIntern(gameSize);
        if (this.isDebug) {
            this.cameras.main.setZoom(1);
            this.cameras.main.scrollX = 0;
            this.cameras.main.scrollY = 0;
        }
    }

    updateDebugTextList(): void {
        const pointer = this.input.activePointer;

        this.debugTextList = [
            'currentState: ' + this.stateMachine.currentState &&
                this.stateMachine.currentState.key,
            'errorMsg: ' + this.debugErrorMsg,
            'isPortrait: ' + globalGetIsPortrait(this),
            'x: ' + pointer.x,
            'y: ' + pointer.y,
            // //@ts-ignore
            // //'mid x: ' + pointer.midPoint.x,
            // //@ts-ignore
            // //'mid y: ' + pointer.midPoint.y,
            // 'velocity x: ' + pointer.velocity.x,
            // 'velocity y: ' + pointer.velocity.y,
            // 'movementX: ' + pointer.movementX,
            // 'movementY: ' + pointer.movementY
        ];
    }

    updateDebug(): void {
        this.updateDebugTextList();

        this.debugText.setText(this.debugTextList);

        this.debugText.x = 0; //-(this.scale.isPortrait ?this.originalSize.height : this.originalSize.width) / 2;
        this.debugText.y = 0; //-(this.scale.isPortrait ?this.originalSize.width : this.originalSize.height) / 2;

        //this.cameras.main.scrollX = -gameSize.width / 2;
        //    this.cameras.main.scrollY = -gameSize.height / 2;
    }
}
