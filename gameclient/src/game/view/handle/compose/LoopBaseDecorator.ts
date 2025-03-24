import { stMonsterBirth } from "../../../network/protocols/BaseProto";
import { ComposeModel } from "./ComposeModel";
/**战斗帧循环器 */
export abstract class LoopBaseDecorator {
    protected get model() {
        return ComposeModel.Ins;
    }
    protected get fight() {
        return this.model.fightView;
    }
    /**开始计时器 */
    abstract start();
    /**终止计时器 */
    abstract stop();
    /**创建怪物 */
    abstract createMonsters(l: stMonsterBirth[]);
    /**帧循环更新 */
    // abstract update();
    /**创建英雄*/
    // abstract createHero(vo:ComposeUpdateVo);
    // abstract onLoop();
    /**清理 */
    // abstract clear();
}