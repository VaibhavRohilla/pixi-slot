import Interactor from '..';
import DUMMYRNG from '../../rngExamples/dummyRNG';

class FakeOfflineServer {
    gameLogic;

    onConnect(): void {
        this.gameLogic = Interactor.createGameLogicAndWallet(new DUMMYRNG());
        this.clientOnMessage(JSON.stringify(this.gameLogic.initialMsg));
    }

    async onMessage(message): Promise<string> {
        console.log('offline server, onMessage', message);
        const { path, input, meta } = JSON.parse(JSON.stringify(message));
        // if (!path) {
        // 	socket.send("ERROR NO PATH");
        // 	socket.close();
        // }
        console.log('extracted', path, input, meta);
        if (
            path === 'action' &&
            input &&
            input.hasOwnProperty('gameInput') &&
            input.gameInput.hasOwnProperty('actionType') &&
            (input.gameInput.actionType === 'play' ||
                input.gameInput.actionType === 'bet')
        ) {
            if (input.gameInput.actionType === 'play') {
                console.log('input = ', input);
                const msg = JSON.stringify(
                    await Interactor.play(
                        this.gameLogic.specificGame,
                        this.gameLogic.wallet,
                        meta,
                        input.gameInput.hasOwnProperty('actionInput')
                            ? input.gameInput.actionInput
                            : null
                    )
                );

                console.log('sending play', msg);
                this.clientOnMessage(msg); //socket.send(msg);
            } else if (
                input.gameInput.actionType === 'bet' &&
                input.gameInput.hasOwnProperty('actionInput') &&
                input.gameInput.actionInput.hasOwnProperty('direction')
            ) {
                const msg = JSON.stringify(
                    await Interactor.bet(
                        this.gameLogic.specificGame,
                        input.gameInput.actionInput.direction,
                        this.gameLogic.wallet,
                        meta
                    )
                );

                console.log('sending bet', msg);
                this.clientOnMessage(msg); //socket.send(msg);
            }
        }

        return 'ERROR';
    }

    clientOnMessage: (m: string) => void = null;
}

export default new FakeOfflineServer();
