import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { OnlineSec_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { EActivityID } from "../activity/ActivityEnum";
import { ActivityModel } from "../activity/ActivityModel";
import { FunctionModel } from "../funs/FunctionModel";
import { EFuncDef } from "../main/model/EFuncDef";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../towertmain/model/TowerMainModel";
import { FuLiModel } from "./model/FuLiModel";
import { FuLiView } from "./view/FuLiView";

export class FuLiModule extends BaseModel{
    private static _ins:FuLiModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new FuLiModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new FuLiView(EViewType.FuLiView));

        TowerMainModel.Ins.on(TowerMainEvent.MainViewInit,this,this.onMainViewInit);
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onMainViewInit);

        E.MsgMgr.AddMsg(SERVER_MSGID.OnlineSec,this.OnlineSec,this);
    }

    private onMainViewInit(){
        Laya.timer.callLater(this,this.setDot);
    }

    private setDot(){   
        if (ActivityModel.Ins.isRedTip(EActivityID.DLHaoLi)) {
            FunctionModel.Ins.funcSetRed(EFuncDef.DLHaoLi, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.DLHaoLi, false);
        }
        if (ActivityModel.Ins.isRedTip(EActivityID.ZXHaoLi)) {
            FunctionModel.Ins.funcSetRed(EFuncDef.ZXHaoLi, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.ZXHaoLi, false);
        }
        if (ActivityModel.Ins.isRedTip(EActivityID.PTShengYan)) {
            FunctionModel.Ins.funcSetRed(EFuncDef.PTShengYan, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.PTShengYan, false);
        }
        if (ActivityModel.Ins.isRedTip(EActivityID.XWFenLu)) {
            FunctionModel.Ins.funcSetRed(EFuncDef.XWFenLu, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.XWFenLu, false);
        }
    }

    private OnlineSec(value:OnlineSec_revc){
        FuLiModel.Ins.onlineSec = value.sec;
        FuLiModel.Ins.event(FuLiModel.UPDATE_OnlineSec);
    }
}