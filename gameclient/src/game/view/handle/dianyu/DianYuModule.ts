import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { CrazyFishCharge_revc, CrazyFishInitOrFresh_revc, CrazyFishLottery_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { DianYuModel } from "./model/DianYuModel";
import { DianYuView } from "./view/DianYuView";

export class DianYuModule extends BaseModel{
    private static _ins:DianYuModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new DianYuModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new DianYuView(EViewType.DianYuView));

        E.MsgMgr.AddMsg(SERVER_MSGID.CrazyFishInitOrFresh,this.CrazyFishInitOrFresh,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.CrazyFishLottery,this.CrazyFishLottery,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.CrazyFishCharge,this.CrazyFishCharge,this);
    }

    private CrazyFishInitOrFresh(value:CrazyFishInitOrFresh_revc){
        DianYuModel.Ins.configId = value.configId;
        DianYuModel.Ins.guarantee = value.guarantee;
        DianYuModel.Ins.clist = value.datalist;
    }

    private CrazyFishLottery(value:CrazyFishLottery_revc){
        DianYuModel.Ins.guarantee = value.guarantee;
        DianYuModel.Ins.event(DianYuModel.UPDATE_CHOU_VIEW,value);
    }

    private CrazyFishCharge(value:CrazyFishCharge_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = DianYuModel.Ins.clist.findIndex(ele => ele.flag === value.datalist[i].flag);
            if(index != -1){
                DianYuModel.Ins.clist[index] = value.datalist[i];
            }
        }
        DianYuModel.Ins.event(DianYuModel.UPDATE_VIEW);
    }
}