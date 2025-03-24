import { DoubleList } from "../structure/DoubleList";
import {NumberUtil} from "./NumberUtil";

/**使用与文本内容的动态变化*/
export class TextUtil {

    /** Des:存放变化进度信息的链表 */
    private static numDataList: DoubleList<ChangeNumData> = new DoubleList<ChangeNumData>();

    /**
     * 设置数字文本显示
     * @param txt 文本
     * @param cont 内容
     */
    public static SetNumText(txt, cont) {
        txt.text = parseFloat(cont).toString();
    }

    /**
     * 设置字符串文本显示
     * @param txt
     * @param cont
     */
    public static SetStrText(txt, cont) {
        txt.text = cont.toString();
    }

    /**
     * 设置文本变化 --(只适用于科学计数法)
     * @param targetNum 目标变化值
     * @param nowNum 目标当前值
     * @param time 时间
     * @param area
     * @param cb
     */
    public static SetSciTextAni(targetNum, nowNum, text, time = 300, area?, cb?) {
        //获取进度信息
        let numData: ChangeNumData = TextUtil.numDataList.Header();
        if (numData == null) numData = new ChangeNumData();
        //进度变化幅度
        numData.changeNum = NumberUtil.bigNumberDivDounble(nowNum, targetNum);
        //变化
        Laya.Tween.to(numData, {
            changeNum: 1, update: new Handler(this, () => {
                let cont = NumberUtil.bigNumberFormat(NumberUtil.bigNumberMul(targetNum, numData.changeNum));
                text.text = cont;
            })
        }, time, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
            text.text = NumberUtil.bigNumberFormat(targetNum);
            TextUtil.numDataList.Add(numData);
            if (cb) {
                cb.call(area);
            }
        }))
    }

    /**
     * 设置文本变化 --(只适用于数字类的变化)
     * @param targetNum 目标变化值
     * @param nowNum 目标当前值
     * @param time 时间
     * @param area
     * @param cb
     */
    public static SetNumTextAni(targetNum, nowNum, text, time = 300, area?, cb?) {
        //获取进度信息
        let numData: ChangeNumData = TextUtil.numDataList.Header();
        if (numData == null) numData = new ChangeNumData();
        //进度变化幅度
        numData.changeNum = nowNum / targetNum;
        //变化
        Laya.Tween.to(numData, {
            changeNum: 1, update: new Handler(this, () => {
                let cont = Math.floor(targetNum * numData.changeNum);
                text.text = cont.toLocaleString();
            })
        }, time, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
            text.text = targetNum.toLocaleString();
            TextUtil.numDataList.Add(numData);
            if (cb) {
                cb.call(area);
            }
        }))
    }
}

/** @param:用于变化的进度信息 */
export class ChangeNumData {

    //变化进度
    changeNum: number = 0;

}