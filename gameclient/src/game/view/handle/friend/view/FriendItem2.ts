import { ui } from "../../../../../ui/layaMaxUI";
import { stFriendListItem } from "../../../../network/protocols/BaseProto";
import { HeadCtl } from "../../common/HeadCtl";
import { MainModel } from "../../main/model/MainModel";
import { RankModel } from "../../rank/model/RankModel";
import { FriendModel } from "../model/FriendModel";

export class FriendItem2 extends ui.views.friend.ui_friendItem2UI{

    private _ctl:HeadCtl;

    constructor() {
        super();
        this._ctl = new HeadCtl(this.view);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
        ButtonCtl.Create(this.btn1,new Laya.Handler(this,this.onBtn1Click));
        this.view.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        RankModel.Ins.watchPlayer(this._data.playerId);
    }

    private onBtnClick(){
        if(!this._data)return;
        FriendModel.Ins.sendCmdManage(this._data.playerId,0);
    }

    private onBtn1Click(){
        if(!this._data)return;
        FriendModel.Ins.sendCmdManage(this._data.playerId,1);
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
    }
}