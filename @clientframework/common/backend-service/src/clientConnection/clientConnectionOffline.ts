import LogicFormats from '../logicFormats';
import { getEventEmitter } from '../eventEmitter';
import fakeServer from '@logic/framework/tests/useCaseRGS15/testServers/fakeOfflineServer';
import ClientConnectionAbstract from './clientConnectionAbstract';

export default class ClientConnectionOffline extends ClientConnectionAbstract {
    constructor() {
        super();

        fakeServer.clientOnMessage = this.directClientOnMessageFromServer.bind(
            this
        );
        //fakeServer.clientOnMessage.bind(this);

        this.connect();
    }

    protected connect(): void {
        fakeServer.onConnect();
    }

    protected sendToServer(msg: any): void {
        console.log('offline server, sendToServer');
        fakeServer.onMessage(msg);
    }

    ////////////
    private directClientOnMessageFromServer(m: string): void {
        console.log('directClientOnMessageFromServer');
        const { path, input } = JSON.parse(m); //.data.toString());

        if (path == LogicFormats.ePathCommands.init) {
            console.log('event-init-msg-handled');
            getEventEmitter().emit('event-init-msg-handled', true);
        }

        console.log(
            'will call recieve from server, this, recieveFromServer, message: ',
            this,
            this.recieveFromServer,
            path,
            input
        );
        this.recieveFromServer(input);
    }
}
