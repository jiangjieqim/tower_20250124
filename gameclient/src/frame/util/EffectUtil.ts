
/**特效工具类*/
export class EffectUtil extends Laya.Script {

    /**飘字效果
    */
    public static PlayTextEffect(parentNode: any, content: string, pos: { x: number, y: number } = null): void {
        var label = new Laya.Label();
        label.text = content;
        label.fontSize = 30;
        label.color = "#fff1ba";
        label.anchorX = 0.5;
        label.anchorY = 0.5;
        parentNode.addChild(label);
        if (pos)
            label.pos(pos.x, pos.y);
        else
            label.pos(parentNode.width / 2, -parentNode.height / 2);
        //动画
        Laya.Tween.to(label, { x: label.x, y: (label.y - 70), alpha: 0 }, 2000, Laya.Ease.cubicInOut,
            Laya.Handler.create(this, (label: Laya.Label) => {
                label.removeSelf();
            }, [label]));
    }

    /**
     * 文字打字机效果
     * obj           文本对象
     * content       文字
     * interval      打字间隔 毫秒
     */
    public static playTypewriterEffect(label: Laya.Label, content: string = "", interval: number = 50, callBack: Function = null): void {
        let self = this;
        label.text = "";
        let strArr: string[] = content.split("");
        let len: number = strArr.length;
        for (let i = 0; i < len; i++) {
            Laya.timer.once(interval * i, this, () => {
                label.text = label.text.concat(strArr[i]);
                if ((i >= len - 1) && (callBack != null)) {
                    callBack();
                }
            })
        }
    }

}