import { PlatformConfig } from "../../../../../InitConfig";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { NewInvite_req, stNewInvite } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { RankModel } from "../../rank/model/RankModel";
import { TowerMainFightModel } from "../model/TowerMainFightModel";

export class TWZItem extends ui.views.main.ui_tuweiItemUI{
    constructor(){
        super();
        this.img.on(Laya.Event.CLICK,this,this.onclick);
        this.add.on(Laya.Event.CLICK,this,this.onAddclick);
    }

    private onclick(){
        if(this._data && this._data.playerId){
            if(this._data.status == 2){
                RankModel.Ins.watchPlayer(this._data.playerId);
            }else{
                let req = new NewInvite_req;
                req.pos = this._data.pos;
                SocketMgr.Ins.SendMessageBin(req);
            }
        }
    }

    private onAddclick(){
        if(initConfig.platform == PlatformConfig.TAPTAP){
            E.ViewMgr.Open(EViewType.TWZView1);
        }else if(initConfig.platform == PlatformConfig.WeiXin){
            E.sdk.goShareData('inviterId=' + MainModel.Ins.mRoleData.AccountId);
        }
    }

    private _data:stNewInvite;
    public setData(value:Configs.t_Invite_Reward_Daily_dat){
        if(!value)return;
        let itemVo = ItemViewFactory.convertItem(value.f_reward);
        this.icon.skin = itemVo.getIcon();
        this.lab.text = "+" + itemVo.count;
        this._data = TowerMainFightModel.Ins.newInvite.find(ele=>ele.pos == value.f_id);
        DotManager.removeDot(this);
        if(this._data.playerId){
            this.add.visible = false;
            this.img.visible = true;
            let headUrl = MainModel.Ins.convertHead(this._data.headUrl);
            MainModel.Ins.setTTHead(this.img,headUrl);
            if(this._data.status == 2){
                this.icon.visible = this.lab.visible = false;
            }else{
                this.icon.visible = this.lab.visible = true;
                DotManager.addDot(this,20,20);
            }
        }else{
            this.add.visible = true;
            this.img.visible = false;
            this.icon.visible = this.lab.visible = true;
        }
    }
}