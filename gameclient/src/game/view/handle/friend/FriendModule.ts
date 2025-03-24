import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { LayerMgr } from "../../../layer/LayerMgr";
import { FriendDiscussAction_revc, FriendDiscuss_revc, FriendList_revc, FriendTaskListUpdate_revc, FriendWatch_revc, FriendZan_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { FriendModel } from "./model/FriendModel";
import { FriendView } from "./view/FriendView";
import { FriendView1 } from "./view/FriendView1";
import { FriendView2 } from "./view/FriendView2";
import { FriendView3 } from "./view/FriendView3";
import { FriendView4 } from "./view/FriendView4";

export class FriendModule extends BaseModel{
    private static _ins:FriendModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new FriendModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new FriendView(EViewType.FriendView));
        this.Reg(new FriendView1(EViewType.FriendView1));
        this.Reg(new FriendView2(EViewType.FriendView2));
        this.Reg(new FriendView4(EViewType.FriendView4));

        E.MsgMgr.AddMsg(SERVER_MSGID.FriendList, this.FriendList,this);
        // E.MsgMgr.AddMsg(SERVER_MSGID.FriendTaskListUpdate, this.FriendTaskListUpdate,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FriendDiscuss, this.FriendDiscuss,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FriendDiscussAction, this.FriendDiscussAction,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FriendWatch, this.FriendWatch,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FriendZan, this.FriendZan,this);
    }

    private FriendList(value: FriendList_revc) {
        switch (value.type) {
            case 0:
                FriendModel.Ins.firendSQList = value.datalist;
                break;
            case 1:
                FriendModel.Ins.firendList = value.datalist;
                break;
            case 2:
            case 3:
                FriendModel.Ins.firendTJList = value.datalist;
                break;
        }
        FriendModel.Ins.event(FriendModel.UPDATE_VIEW,value.type);
    }

    // private FriendTaskListUpdate(value:FriendTaskListUpdate_revc){
    //     let index = FriendModel.Ins.firendList.findIndex(ele => ele.playerId === value.playerId);
    //     if(index != -1){
    //         FriendModel.Ins.firendList[index].datalist = value.datalist;
    //     }
    // }

    private FriendDiscuss(value:FriendDiscuss_revc){
        if(value.flag == 0){
            if(value.mode == 1){
                E.ViewMgr.Open(EViewType.JjcView,null,100);
            }else if(value.mode == 2){
                E.ViewMgr.Open(EViewType.JjcView,null,101);
            }else if(value.mode == 3){
                E.ViewMgr.Open(EViewType.JjcView,null,102);
            }
        }else{
            let view = this.getView();
            view.setLab(value.nickName);
            view.x = (LayerMgr.Ins.screenEffectLayer.width >> 1) - 77;
            view.y = (LayerMgr.Ins.screenEffectLayer.height >> 1) + 200;
            if(!view.parent){
                LayerMgr.Ins.screenEffectLayer.addChild(view);
            }
        }
    }

    private _fView:FriendView3;
    private getView(){
        if(!this._fView){
            this._fView = new FriendView3();
        }
        return this._fView;
    }

    private FriendDiscussAction(value:FriendDiscussAction_revc){
        let view = this.getView();
        view.removeSelf();
    }

    private FriendWatch(value:FriendWatch_revc){
        E.ViewMgr.Open(EViewType.FriendView4,null,value)
    }

    private FriendZan(value:FriendZan_revc){
        FriendModel.Ins.event(FriendModel.UPDATE_VIEW_ZAN,value);
    }
}