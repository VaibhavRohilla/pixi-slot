import StateAbstract from '@commonEngine/gameFlow/stateAbstract';
import { ISlotDataPresenter } from '../../dataPresenter/interfaces';

export default abstract class SlotStateAbstract extends StateAbstract<
    Phaser.Scene
> {
    constructor(key, upperState: SlotStateAbstract = null) {
        super(key, upperState);
    }

    slotData: ISlotDataPresenter;

    _attachDataIntern(data: any): void {
        super._attachDataIntern(data);
        this.slotData = data;
    }
}
