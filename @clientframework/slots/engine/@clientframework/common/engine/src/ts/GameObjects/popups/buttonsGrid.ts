import GameButton from '../gameButton';

export class ButtonsGrid {
    protected buttonsLandscape: GameButton[][] = [];
    protected buttonsPortrait: GameButton[][] = [];
    protected additionalOffsetY = 0;
    constructor(
        protected columnsLanscape,
        protected columnsPortrait,
        buttonsArray: GameButton[],
        protected spaceW: number = 1,
        protected spaceH: number = 1,
        protected portraitScale = 1,
        protected landscapeScale = 1,
        protected spaceWFactor?: number,
        protected spaceHFactor?: number
    ) {
        let buttonIndex = 0;
        buttonsArray.forEach((button) => {
            if (buttonIndex % columnsLanscape == 0) {
                this.buttonsLandscape.push([]);
            }
            if (buttonIndex % columnsPortrait == 0) {
                this.buttonsPortrait.push([]);
            }

            this.buttonsLandscape[this.buttonsLandscape.length - 1].push(
                button
            );

            this.buttonsPortrait[this.buttonsPortrait.length - 1].push(button);

            buttonIndex++;
        });
    }

    resize(isPortrait = false, centerX = 0, centerY = 0): void {
        const buttonsMatrix = isPortrait
            ? this.buttonsPortrait
            : this.buttonsLandscape;
        //let rowIndex = 0;
        let accumulatedYOffset = 0;
        let minHeight = 0;
        buttonsMatrix.forEach((row) => {
            if (row.length > 0) {
                const totalW = this.calcTotalWidth(row);

                const totalH = this.calcTotalHeight(buttonsMatrix);

                let columnIndex = 0;
                let maxHeightInRow = 0;
                row.forEach((button) => {
                    button.x =
                        centerX -
                        0.5 * totalW +
                        0.5 * button.width +
                        (columnIndex *
                            (totalW +
                                (this.spaceWFactor
                                    ? this.spaceWFactor * button.width
                                    : this.spaceW))) /
                            row.length;
                    button.y =
                        centerY -
                        0.5 * totalH +
                        0.5 * button.height +
                        accumulatedYOffset +
                        this.additionalOffsetY;

                    button.setScale(
                        isPortrait ? this.portraitScale : this.landscapeScale
                    );

                    columnIndex++;

                    if (minHeight == 0) {
                        minHeight = button.height;
                    }

                    if (button.height < minHeight) {
                        minHeight = button.height;
                    }

                    if (button.height > maxHeightInRow) {
                        maxHeightInRow = button.height;
                    }
                });
                accumulatedYOffset +=
                    maxHeightInRow +
                    (this.spaceHFactor
                        ? this.spaceHFactor * minHeight
                        : this.spaceH);
            }

            //rowIndex++;
        });
    }

    private calcTotalWidth(row: GameButton[]): number {
        let totalWidth = 0;
        row.forEach((button) => {
            totalWidth += button.width;
            totalWidth += this.spaceWFactor
                ? this.spaceWFactor * button.width
                : this.spaceW;
        });

        return totalWidth;
    }

    private calcTotalHeight(buttonsMatrix: GameButton[][]): number {
        let totalHeight = 0;
        buttonsMatrix.forEach((row) => {
            totalHeight += row[0].height;
            totalHeight += this.spaceHFactor
                ? this.spaceWFactor * row[0].height
                : this.spaceH;
        });

        return totalHeight;
    }

    public setAdditionalOffsetY(value: number): void {
        this.additionalOffsetY = value;
        this.resize();
    }
}
