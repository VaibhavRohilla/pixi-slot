import { ISlotDataPresenter } from './interfaces';

export function updateTakeBet(slotData: ISlotDataPresenter): void {
    slotData.status.balance -= slotData.futureStatus.bet;
}
