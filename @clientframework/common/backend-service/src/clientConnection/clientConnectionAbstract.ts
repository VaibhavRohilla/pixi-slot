import { getEventEmitter } from '../eventEmitter';

export default abstract class ClientConnectionAbstract {
    constructor() {
        this.setEventListeners();
    }

    protected abstract connect(): void;
    protected abstract sendToServer(msg: any);

    protected recieveFromServer(data: any): void {
        console.log('recieveFromServer');
        getEventEmitter().emit('event-recieve-from-server', data);
    }

    protected setEventListeners(): void {
        getEventEmitter().on('event-send-to-server', this.sendToServer, this);
    }
}
