import { E } from "../../game/G";

export class InputTipsCtl {
    private maxNum: number;
    private tf: Laya.TextArea|Laya.TextInput;
    private showTf: Laya.Text | Laya.Label;
    constructor(tf: Laya.TextArea|Laya.TextInput, maxNum: number, showTf?: Laya.Text | Laya.Label) {
        this.tf = tf;
        this.showTf = showTf;
        tf.maxChars = maxNum + 1;
        this.maxNum = maxNum;
        tf.textField.on(Laya.Event.INPUT, this, this.onChangeHandler);
    }
    private onChangeHandler() {
        if (StringUtil.getNumBytes(this.tf.text) > this.maxNum) {
            this.tf.text = StringUtil.CutByteLen(this.tf.text, this.maxNum, "");//this.tf.text.substr(0, this.maxNum);
            E.ViewMgr.ShowMidLabel(E.LangMgr.getLang("InputMuchMore"));
        }
        if (this.showTf) {
            this.showTf.text = `${this.tf.text.length.toString()}/${this.maxNum}`;
        }
    }
    public dispose() {
        this.tf.off(Laya.Event.CHANGE, this, this.onChangeHandler);
        this.tf = null;
    }
}