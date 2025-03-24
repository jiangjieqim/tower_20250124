import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FriendWatch_revc, FriendZan_req, WatchCommonRankDetail_req } from "../../../../network/protocols/BaseProto";
import { HeadCtl } from "../../common/HeadCtl";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { MainModel } from "../../main/model/MainModel";
import { FriendModel } from "../model/FriendModel";

export class FriendView4 extends ViewBase{
    private _ui:ui.views.friend.ui_friendView4UI;

    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _ctl:HeadCtl;

    protected onAddLoadRes() {
        
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.friend.ui_friendView4UI;

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2,new Laya.Handler(this,this.onBtn2Click)),
                ButtonCtl.Create(this._ui.btn3,new Laya.Handler(this,this.onBtn3Click)),
                ButtonCtl.Create(this._ui.btn4,new Laya.Handler(this,this.onBtn4Click)),
            )

            this._ctl = new HeadCtl(this._ui.view);
        }
     }

     private onBtnClick(){
        if(!this._data)return;
        let req = new FriendZan_req;
        req.playerId = this._data.playerData.AccountId;
        SocketMgr.Ins.SendMessageBin(req);
     }

    private onBtn1Click() {
        if(!this._data)return;
        let req = new WatchCommonRankDetail_req;
        req.accountId = this._data.playerData.AccountId;
        SocketMgr.Ins.SendMessageBin(req);
        this.Close();
    }

    private onBtn2Click(){
        if(!this._data)return;
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.SiLiao)){
            FriendModel.Ins.sendSL(this._data.playerData.AccountId);
            this.Close();
        }
    }

    private onBtn3Click(){
        if(!this._data)return;
        E.ViewMgr.Open(EViewType.FriendView2,null,this._data.playerData.AccountId);
        this.Close();
    }

    private onBtn4Click(){
        if(!this._data)return;
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.Friend)){
            if(this._data.isFriend){
                FriendModel.Ins.sendCmdManage(this._data.playerData.AccountId,2);
            }else{
                FriendModel.Ins.sendCmdManage(this._data.playerData.AccountId,3);
            }
            this.Close();
        }
    }

     private _data:FriendWatch_revc;
     protected onInit(): void {
        FriendModel.Ins.on(FriendModel.UPDATE_VIEW_ZAN,this,this.setLab);
        this._data = this.Data;
        let headUrl = MainModel.Ins.convertHead(this._data.playerData.HeadUrl);
        this._ctl.setData(headUrl, this._data.playerData.HeadFrame);
        this._ui.lab.text = this._data.playerData.NickName;
        this._ui.lab1.text = this._data.playerData.trophy + "";
        if(this._data.isFriend){
            this._ui.lab4.text = "删除好友";
        }else{
            this._ui.lab4.text = "添加好友";
        }

        this._ui.lab2.text = this._data.zanCnt + "";
        if(this._data.zanExist){
            this._ui.btn.disabled = true;
        }else{
            this._ui.btn.disabled = false;
        }
     }

     protected onExit(): void {
        FriendModel.Ins.off(FriendModel.UPDATE_VIEW_ZAN,this,this.setLab);
     }

     private setLab(){
        this._ui.btn.disabled = true;
        this._ui.lab2.text = (this._data.zanCnt + 1) + "";
     }
}