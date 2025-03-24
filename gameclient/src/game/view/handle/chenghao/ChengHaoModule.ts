import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { TitleAction_revc, TitleInit_revc, TitleSwitch_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { ChengHaoModel } from "./model/ChengHaoModel";
import { ChengHaoView } from "./view/ChengHaoView";

export class ChengHaoModule extends BaseModel{
    private static _ins:ChengHaoModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new ChengHaoModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new ChengHaoView(EViewType.ChengHaoView));

        E.MsgMgr.AddMsg(SERVER_MSGID.TitleInit, this.TitleInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TitleSwitch, this.TitleSwitch,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TitleAction, this.TitleAction,this);
    }

    private TitleInit(value:TitleInit_revc){
        ChengHaoModel.Ins.titleId = value.titleId;
        ChengHaoModel.Ins.titleList = value.datalist;
    }

    private TitleSwitch(value:TitleSwitch_revc){
        ChengHaoModel.Ins.titleId = value.titleId;
        ChengHaoModel.Ins.event(ChengHaoModel.UPDATE_TITLE);
    }

    private TitleAction(value:TitleAction_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index;
            if(value.action == 0){
                index = ChengHaoModel.Ins.titleList.findIndex(ele => ele.id === value.datalist[i].id);
                if(index != -1){
                    ChengHaoModel.Ins.titleList.splice(index,1);
                }
            }else if(value.action == 1){
                ChengHaoModel.Ins.titleList.push(value.datalist[i]);
            }else if(value.action == 2){
                index = ChengHaoModel.Ins.titleList.findIndex(ele => ele.id === value.datalist[i].id);
                if(index != -1){
                    ChengHaoModel.Ins.titleList[index] = value.datalist[i];
                }
            }
        }
        ChengHaoModel.Ins.event(ChengHaoModel.UPDATE_DATA);
    }

}