import { stLimitPackTime } from "../../../../network/protocols/BaseProto";

export class XianShiLiBaoModel extends Laya.EventDispatcher{
    private static _ins: XianShiLiBaoModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new XianShiLiBaoModel();
        }
        return this._ins;
    } 

    public static UPDATE_DATA:string = "UPDATE_DATA";

    public limitPackTimeList:stLimitPackTime[];

    constructor(){
        super();
    }
}