import { stCommonTimes } from "../../../../network/protocols/BaseProto";
import { EActivityID } from "../../activity/ActivityEnum";
import { ActivityModel } from "../../activity/ActivityModel";

export class DianYuModel extends Laya.EventDispatcher{
    private static _ins: DianYuModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new DianYuModel();
        }
        return this._ins;
    } 

    public static UPDATE_VIEW:string = "UPDATE_VIEW";
    public static UPDATE_CHOU_VIEW:string = "UPDATE_CHOU_VIEW";

    public configId:number;
    public guarantee:number;
    public clist:stCommonTimes[];

    constructor(){
        super();
    }

    public isRedTip(){
        return ActivityModel.Ins.isRedTip(EActivityID.DianYu);
    }
}