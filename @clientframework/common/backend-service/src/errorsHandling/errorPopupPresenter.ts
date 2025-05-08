import { getLanguageTextErrorMsg } from '../client-remote-data/src/multilanguage/errorMsgData';
import { ErrorMsgKeys } from '../client-remote-data/src/multilanguage/errorMsgKeys';
import { getLobbyUrl } from '../launchParams/lobbyUrl';
import { getEventEmitter } from '../eventEmitter';
import { CURRENCY } from '@specific/dataConfig';
import { getLanguageTextGameMsg } from '../client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '../client-remote-data/src/multilanguage/gameMsgKeys';
import { createErrorButtons } from './errorPopupPresenterDom';
import { globalAdjustElementScale } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';
import { eUserInputCommands } from '@clientframework/slots/engine/src/ts/gameFlow/userInput/userInputCommands';
import { hasHistoryUrl } from '../launchParams/historyUrl';
import { hasHistory } from '../launchParams/hasHistory';
class ErrorPresenter {
    private errorPopup_: Phaser.GameObjects.Sprite = null;
    private errorPopupResponsible_: Phaser.GameObjects.Sprite = null;
    private errorPopupText_: Phaser.GameObjects.Text = null;
    private errorPopupActive_ = false;
    get errorPopupActive(): boolean {
        return this.errorPopupActive_;
    }

    private errorPopupIsResponsible = false;
    private isPreliminaryPopup = false;
    private popupScene: Phaser.Scene;

    private wasNetworkNotrespondingPopup = false;

    preloadAndAddErrorPopups(scene: Phaser.Scene): void {
        this.popupScene = scene;

        // first create preliminary popup
        this.addErrorPopupsToSpecificScene(scene, true);

        if (scene) {
            scene.load.image(
                'errorPopup',
                require('ASSETS_DIR_COMMON/errorPopup.png')
            );
            scene.load.image(
                'responsiblePopup',
                require('ASSETS_DIR_COMMON/responsiblePopup.png')
            );

            scene.load.on('complete', () => {
                console.log('error popups loaded');
                this.addErrorPopupsToSpecificScene(scene);
            });

            scene.load.on(
                'loaderror',
                (value, value2, value3) => {
                    value;
                    value2;
                    value3;
                    //delcons console.log("loaderror value", value, value2, value3)
                    this.showErrorPopup(ErrorMsgKeys.connectionError);
                },
                this
            );
        }
    }

    private addErrorPopupsToSpecificScene(
        scene: Phaser.Scene,
        _isPreliminaryPopup = false
    ): void {
        console.log(
            'addErrorPopupsToSpecificScene. _isPreliminaryPopup',
            _isPreliminaryPopup
        );
        this.isPreliminaryPopup = _isPreliminaryPopup;
        if (!this.isPreliminaryPopup) {
            this.popupScene = scene;
            if (this.errorPopup_) {
                this.errorPopup_.destroy();
            }
            if (this.errorPopupResponsible_) {
                this.errorPopupResponsible_.destroy();
            }
            if (this.errorPopupText_) {
                this.errorPopupText_.destroy();
            }

            const xx = 0; //Number(scene.game.config.width) / 2;
            const yy = 0; //Number(scene.game.config.height) / 2;

            this.errorPopup_ = scene.add.sprite(xx, yy, 'errorPopup');
            this.errorPopup_.setScale(2, 2);
            this.errorPopupResponsible_ = scene.add.sprite(
                xx,
                yy,
                'responsiblePopup'
            );
            this.errorPopup_
                .setActive(
                    this.errorPopupActive_ && !this.errorPopupIsResponsible
                )
                .setVisible(
                    this.errorPopupActive_ && !this.errorPopupIsResponsible
                )
                .setInteractive();
            this.errorPopupResponsible_
                .setActive(
                    this.errorPopupActive_ && this.errorPopupIsResponsible
                )
                .setVisible(
                    this.errorPopupActive_ && this.errorPopupIsResponsible
                )
                .setInteractive();
            this.errorPopup_.setDepth(10000);
            this.errorPopupResponsible_.setDepth(10000);
            this.errorPopup_.setInteractive();
            this.errorPopupResponsible_.setInteractive();

            this.errorPopup_.on('pointerdown', () => {
                //delcons console.log("errorPopupPointerDown")
                this.errorPopupClicked();
            });

            this.popupScene.input.on('pointerdown', () => {
                //delcons console.log("errorPopupResponsiblePointerDown")
                if (this.errorPopupActive_ && this.errorPopupIsResponsible) {
                    this.responsiblePopupClicked();
                }
            });

            this.errorPopupText_ = scene.add.text(xx, yy, 'CONNECTION ERROR', {
                font: 'bold 40px Arial',
                align: 'center',
            });
            this.errorPopupText_
                .setActive(this.errorPopupActive_)
                .setVisible(this.errorPopupActive_);
            this.errorPopupText_.setOrigin(0.5);
            this.errorPopupText_.setDepth(10000);
        }
    }

    private errorPopupClicked(): void {
        //delcons console.log("errorPopupClicked");
        if (!this.errorPopupActive_ && !this.isPreliminaryPopup) {
            return;
        }

        if (this.errorPopupIsResponsible) {
            this.closePopups();
        }

        if (
            !this.errorPopupIsResponsible &&
            getLobbyUrl() != '' &&
            !this.wasNetworkNotrespondingPopup &&
            !this.errorButtons
        ) {
            //delcons console.log("usao u lobby")
            getEventEmitter().emit('event-lobby-command');
        }
    }

    private responsiblePopupClicked(): void {
        //delcons console.log("responsiblePopupClicked");
        if (!this.errorPopupActive_) {
            return;
        }
        this.errorPopupActive_ = false;
        this.errorPopupResponsible_.alpha = 1;

        //this.scene.tweens.add({
        //    targets: [this.errorPopupResponsible_, this.errorPopupText_],
        //    duration: 500,
        //    alpha: "0",
        //    ease: "Linear",
        //    delay: 500,
        //    onComplete: () => {
        this.closePopups();
        /*if (!this.errorPopupIsResponsible && ClientConnection.lobbyUrl != "") {
                    console.log("usao u lobby")
                    ClientConnection.lobbyCommand();
                }*/
        //    }
        //});
    }

    closePopups(): void {
        console.log(
            'close popups, this.isPreliminaryPopup',
            this.isPreliminaryPopup
        );
        if (this.isPreliminaryPopup) {
            return;
        }

        this.errorPopupActive_ = false;

        this.errorPopupResponsible_
            .setActive(this.errorPopupActive_ && this.errorPopupIsResponsible)
            .setVisible(this.errorPopupActive_ && this.errorPopupIsResponsible);
        this.errorPopup_
            .setActive(this.errorPopupActive_ && this.errorPopupIsResponsible)
            .setVisible(this.errorPopupActive_ && this.errorPopupIsResponsible);
        this.errorPopupText_
            .setActive(this.errorPopupActive_)
            .setVisible(this.errorPopupActive_);

        console.log('event-error-popup-closed');
        this.popupScene.game.events.emit(
            'event-error-popup-closed',
            this.errorPopupIsResponsible
        );
    }

    quitGame(): void {
        this.closePopups();
        if (getLobbyUrl() !== '') {
            getEventEmitter().emit('event-lobby-command');
        } else {
            this.popupScene.game.destroy(true, true);
        }
    }

    showHistory(): void {
        this.closePopups();
        if (hasHistoryUrl()) {
            getEventEmitter().emit('event-history-command');
        } else {
            if (hasHistory()) {
                setTimeout(() => {
                    this.popupScene.game.events.emit(
                        `event-user-input-${eUserInputCommands.historyRequest}`
                    );    
                }, 100);
            }
        }
    }

    showErrorPopup(
        key: any,
        isResponsible = false,
        code = -1,
        amount = -1,
        limit = -1,
        amountText?: ErrorMsgKeys,
        limitText?: ErrorMsgKeys
    ): void {
        console.log('showErrorPopup');

        this.wasNetworkNotrespondingPopup =
            key == ErrorMsgKeys.networkNotResponding;

        //delcons console.log("errorPopup", isResponsible);
        this.errorPopupIsResponsible = isResponsible;
        this.errorPopupActive_ = true;

        let text;
        if (key in GameMsgKeys) {
            text = getLanguageTextGameMsg(key);
            this.errorPopupResponsible_.setTexture('gamePopup');
            this.errorPopupResponsible_.setScale(2);
        } else if (key in ErrorMsgKeys) {
            text =
                getLanguageTextErrorMsg(key) +
                (code != -1 ? code.toString() : '');
            this.errorPopupResponsible_.setTexture('responsiblePopup');
            this.errorPopupResponsible_.setScale(1);
        }
        //delcons console.log("amount ", amount, "limit ", limit)
        let hasLimits = false;
        if (amount != -1 && limit != -1) {
            text +=
                '\n ' +
                getLanguageTextErrorMsg(limitText) +
                ': ' +
                limit +
                ` ${CURRENCY}`;
            text +=
                '\n ' +
                getLanguageTextErrorMsg(amountText) +
                ': ' +
                amount +
                ` ${CURRENCY}`;
            hasLimits = true;
        }

        if (this.isPreliminaryPopup) {
            if (confirm(text)) {
                this.errorPopupClicked();
            }
            return;
        }

        if (this.errorPopup_) {
            //delcons console.log("errPopup", this.errorPopupActive_ && !this.errorPopupIsResponsible)
            this.errorPopup_
                .setActive(
                    this.errorPopupActive_ && !this.errorPopupIsResponsible
                )
                .setVisible(
                    this.errorPopupActive_ && !this.errorPopupIsResponsible
                );
        }

        if (this.errorPopupResponsible_) {
            this.errorPopupResponsible_
                .setActive(
                    this.errorPopupActive_ && this.errorPopupIsResponsible
                )
                .setVisible(
                    this.errorPopupActive_ && this.errorPopupIsResponsible
                );
        }

        if (this.errorPopupText_) {
            this.errorPopupText_
                .setActive(this.errorPopupActive_)
                .setVisible(this.errorPopupActive_);
            this.errorPopupText_.setOrigin(0.5);

            const xx = 0; //Number(this.popupScene.game.config.width) / 2;
            let yy = 0; //Number(this.popupScene.game.config.height) / 2;
            if (hasLimits) {
                yy -= 40;
            }
            this.errorPopupText_.x = xx;
            this.errorPopupText_.y = yy;
            this.errorPopupText_.setText(text);
        }

        if (this.errorPopup_) {
            if (!isResponsible) {
                this.errorPopup_.alpha = 1;
                this.errorPopupResponsible_.alpha = 1;
                this.errorPopupText_.alpha = 1;
            } else {
                this.errorPopup_.alpha = 0;
                this.errorPopupResponsible_.alpha = 0;
                this.errorPopupText_.alpha = 0;
                this.popupScene.tweens.add({
                    targets: [
                        this.errorPopup_,
                        this.errorPopupResponsible_,
                        this.errorPopupText_,
                    ],
                    duration: 500,
                    alpha: '1',
                    ease: 'Linear',
                    onComplete: (): void => {
                        //hook
                    },
                });
            }
        }

        /*let errorPopup = document.getElementById("errorPopup");
        errorPopup.style.display = "block";
        let popupText = document.getElementById("errorPopupText");
        popupText.innerHTML = this.getLanguageText(key) + (code != -1?code.toString():"");*/

        // TODOkp, disable inputs
        // if (this.popupScene && this.popupScene instanceof GameScene) {
        //     //delcons console.log("isInstance of GameScene");
        //     //(this.popupScene as GameScene).disableButtonsAndFields();
        // }
    }

    errorButtons: Phaser.GameObjects.DOMElement;

    showSupplierErrorPopup(
        msg: string,
        supplier: string,
        action: any,
        buttons: any
    ): void {
        console.log('showErrorPopup supplier', msg, supplier, action, buttons);
        //delcons console.log("errorPopup", isResponsible);
        this.errorPopupIsResponsible = false;
        this.errorPopupActive_ = true;

        const text = msg;

        if (this.isPreliminaryPopup) {
            if (confirm(text)) {
                this.errorPopupClicked();
            }
            return;
        }

        if (this.errorPopup_) {
            //delcons console.log("errPopup", this.errorPopupActive_ && !this.errorPopupIsResponsible)
            this.errorPopup_
                .setActive(
                    this.errorPopupActive_ && !this.errorPopupIsResponsible
                )
                .setVisible(
                    this.errorPopupActive_ && !this.errorPopupIsResponsible
                );
        }

        if (this.errorPopupResponsible_) {
            this.errorPopupResponsible_
                .setActive(
                    this.errorPopupActive_ && this.errorPopupIsResponsible
                )
                .setVisible(
                    this.errorPopupActive_ && this.errorPopupIsResponsible
                );
        }

        if (this.errorPopupText_) {
            this.errorPopupText_
                .setActive(this.errorPopupActive_)
                .setVisible(this.errorPopupActive_);
            this.errorPopupText_.setOrigin(0.5);

            const xx = 0; //Number(this.popupScene.game.config.width) / 2;
            const yy = 0; //Number(this.popupScene.game.config.height) / 2;
            this.errorPopupText_.x = xx;
            this.errorPopupText_.y = yy;
            this.errorPopupText_.setText(text);

            this.errorPopupText_.text = this.errorPopupText_.text.replace(
                '. ',
                '.\n'
            );
            this.errorPopupText_.setAlign('center');

            this.errorPopupText_.setScale(
                globalAdjustElementScale(
                    this.errorPopupText_.displayWidth,
                    this.errorPopupText_.scale,
                    0.8,
                    this.errorPopup_.displayWidth
                )
            );
        }

        if (this.errorPopup_) {
            if (!this.errorPopupIsResponsible) {
                this.errorPopup_.alpha = 1;
                this.errorPopupResponsible_.alpha = 1;
                this.errorPopupText_.alpha = 1;
            } else {
                this.errorPopup_.alpha = 0;
                this.errorPopupResponsible_.alpha = 0;
                this.errorPopupText_.alpha = 0;
                this.popupScene.tweens.add({
                    targets: [
                        this.errorPopup_,
                        this.errorPopupResponsible_,
                        this.errorPopupText_,
                    ],
                    duration: 500,
                    alpha: '1',
                    ease: 'Linear',
                    onComplete: (): void => {
                        //hook
                    },
                });
            }
        }

        if (action === 'continue') {
            if (!this.errorButtons) {
                this.errorButtons = createErrorButtons(this.popupScene, [
                    { text: action, action: action },
                ]);
                this.errorButtons.y =
                    this.errorPopup_.y +
                    (0.68 * this.errorPopup_.displayHeight) / 2;
            }
            this.popupScene.game.events.emit(
                `event-show-error-button-${action}`
            );
        } else if (action === 'void') {
            if (!this.errorButtons) {
                this.errorButtons = createErrorButtons(this.popupScene, [
                    { text: 'Quit', action: action },
                ]);
                this.errorButtons.y =
                    this.errorPopup_.y +
                    (0.68 * this.errorPopup_.displayHeight) / 2;
            }
            this.popupScene.game.events.emit(
                `event-show-error-button-${action}`
            );
        } else if (action === 'buttons') {
            if (!this.errorButtons) {
                this.errorButtons = createErrorButtons(
                    this.popupScene,
                    buttons.buttons
                );
                this.errorButtons.y =
                    this.errorPopup_.y +
                    0.68 * this.errorPopup_.displayHeight * 0.5;

                buttons.buttons.forEach((button: any) => {
                    this.popupScene.game.events.emit(
                        `event-show-error-button-${button.action}`
                    );
                });
            } else {
                this.errorButtons.setActive(true).setVisible(true);
            }
        }
    }

    /*let errorPopup = document.getElementById("errorPopup");
        errorPopup.style.display = "block";
        let popupText = document.getElementById("errorPopupText");
        popupText.innerHTML = this.getLanguageText(key) + (code != -1?code.toString():"");*/

    // TODOkp, disable inputs
    // if (this.popupScene && this.popupScene instanceof GameScene) {
    //     //delcons console.log("isInstance of GameScene");
    //     //(this.popupScene as GameScene).disableButtonsAndFields();
    // }
}

export const errorPresenter: ErrorPresenter = new ErrorPresenter();
