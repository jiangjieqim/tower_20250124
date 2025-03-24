import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { stFriendListItem } from "../../../../network/protocols/BaseProto";
import { HeadCtl } from "../../common/HeadCtl";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { MainModel } from "../../main/model/MainModel";
import { RankModel } from "../../rank/model/RankModel";
import { FriendModel } from "../model/FriendModel";
import { t_Friendship } from "../proxy/t_Friendship";

export class FriendItem extends ui.views.friend.ui_friendItemUI{

    private _ctl:HeadCtl;

    constructor() {
        super();
        this._ctl = new HeadCtl(this.view);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
        ButtonCtl.Create(this.btn1,new Laya.Handler(this,this.onBtn1Click));
        ButtonCtl.Create(this.btn2,new Laya.Handler(this,this.onBtn2Click));
        this.view.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        RankModel.Ins.watchPlayer(this._data.playerId);
    }

    private onBtnClick(){
        if(!this._data)return;
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.SiLiao)){
            FriendModel.Ins.sendSL(this._data.playerId);
        }
    }

    private onBtn1Click(){
        if(!this._data)return;
        E.ViewMgr.Open(EViewType.FriendView1,null,this._data);
    }

    private onBtn2Click(){
        if(!this._data)return;
        E.ViewMgr.Open(EViewType.FriendView2,null,this._data.playerId);
    }

    private _data:stFriendListItem;
    public setData(value: stFriendListItem) {
        if(!value)return;
        this._data = value;
        let headUrl = MainModel.Ins.convertHead(value.headUrl);
        this._ctl.setData(headUrl, value.headFrame);
        this.lab.text = value.nickName;
        if(value.online){
            this.img.skin = "remote/friend/tx_zx.png";
        }else{
            this.img.skin = "remote/friend/tx_lx.png";
        }
        this.lab1.text = value.trophy + "";

        let cfg = t_Friendship.Ins.getCfgByNum(value.friendship);
        if(cfg){
            this.imgg.skin = `remote/friend/icon_yq_${cfg.f_level + 1}.png`;
        }else{
            this.imgg.skin = "";
        }
    }
}