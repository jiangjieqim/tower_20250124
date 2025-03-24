import { E } from "../../../game/G";
import { IView } from "../../view/IView";

export abstract class BaseModel extends Laya.EventDispatcher {
    public abstract initMsg(): void;
    protected Reg(iv: IView){
        E.ViewMgr.Reg(iv);
        return iv;
    }
    /**初始化重置数据 */
    public abstract onInitCallBack():void;
}