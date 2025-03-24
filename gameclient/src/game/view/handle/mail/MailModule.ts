import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { MailList_revc, MailRed_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { FunctionModel } from "../funs/FunctionModel";
import { EFuncDef } from "../main/model/EFuncDef";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../towertmain/model/TowerMainModel";
import { MailModel } from "./model/MailModel";
import { MailView } from "./view/MailView";
import { MailView1 } from "./view/MailView1";
import { MailView2 } from "./view/MailView2";

export class MailModule extends BaseModel{
    private static _ins:MailModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new MailModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new MailView(EViewType.MailView));
        this.Reg(new MailView1(EViewType.MailView1));
        this.Reg(new MailView2(EViewType.MailView2));

        TowerMainModel.Ins.on(TowerMainEvent.MainViewInit,this,this.onMainViewInit);

        E.MsgMgr.AddMsg(SERVER_MSGID.MailRed,this.MailRed,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MailList,this.MailList,this);
    }

    private onMainViewInit(){
        Laya.timer.callLater(this,this.setDot);
    }

    private setDot(){   
        if(MailModel.Ins.isRedTip()){
            FunctionModel.Ins.funcSetRed(EFuncDef.Mail, true);
        }else{
            FunctionModel.Ins.funcSetRed(EFuncDef.Mail, false);
        }
    }

    private MailRed(value:MailRed_revc){
        MailModel.Ins.redTip = value.red;
        MailModel.Ins.event(MailModel.UPDATE_REDTIP);
        this.onMainViewInit();
    }

    private MailList(value:MailList_revc){
        MailModel.Ins.mailList = value.datalist;
        MailModel.Ins.event(MailModel.UPDATE_MAIL);
    }
}