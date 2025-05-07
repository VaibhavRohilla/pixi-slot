import { Text, TextStyle, TextMetrics } from 'pixi.js';

export class TextUtil {
    public static createText(
        text: string,
        positonx : number,
        positony : number,
        fontSize: number = 24,
        color: number = 0xFFFFFF,
        anchor:number,
        style?: Partial<TextStyle>
    ): Text {
        const defaultStyle = new TextStyle({
            fontFamily: 'Tagesschrift-Regular',
            fontSize: fontSize,
            fill: color,
            align: 'center',
            ...style
        });

        const textObj = new Text(text, defaultStyle);

        // Set position
        if (positonx !== undefined) textObj.x = positonx;
        if (positony !== undefined) textObj.y = positony;

        // Set anchor
        if (anchor) {
            textObj.anchor.set(anchor);
        }

        return textObj;
    }

    public static updateText(textObj: Text, newText: string): void {
        textObj.text = newText;
    }

    public static centerText(text: Text, containerWidth: number, containerHeight: number): void {
        text.x = containerWidth / 2;
        text.y = containerHeight / 2;
        text.anchor.set(0.5);
    }

    public static getTextMetrics(text: Text): TextMetrics {
        return TextMetrics.measureText(text.text, text.style);
    }
} 