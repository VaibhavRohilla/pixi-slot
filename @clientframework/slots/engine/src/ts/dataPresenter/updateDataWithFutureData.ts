import { ISlotDataPresenter } from './interfaces';

export function updateDataPresenterWithFutureData(
    slotData: ISlotDataPresenter
): void {
    slotData.reels = JSON.parse(JSON.stringify(slotData.futureReels));
    slotData.status = JSON.parse(JSON.stringify(slotData.futureStatus));
    console.log('updateDataPresenterWithFutureData', slotData);
}
