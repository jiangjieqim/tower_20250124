import { ComposeModel } from "../ComposeModel";
import { CardMsgVo } from "./CardMsgVo";

/**
 * 弹幕历史数据结构
 */
export class HistroyMsgVo {
    /**波次数据 */
    wave: number;
    /**弹幕构建的时间戳 */
    time: number;
    /**弹幕数据 */
    vo: CardMsgVo;
    
    private model: ComposeModel;
    constructor(vo: CardMsgVo) {
        this.model = ComposeModel.Ins;
        this.wave = this.model.curAdapter.wave;
        this.time = this.model.curAdapter.clockTimeMs;
        this.vo = vo;
    }
}