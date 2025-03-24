import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FriendDiscuss_req } from "../../../../network/protocols/BaseProto";
import { RoleInfoModel } from "../../roleinfo/model/RoleInfoModel";

export class FriendView2 extends ViewBase{
    private _ui:ui.views.friend.ui_friendView2UI;

    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes() {
        
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.friend.ui_friendView2UI;
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2,new Laya.Handler(this,this.onBtn2Click)),
            )
        }
     }

     private onBtnClick(){
        let req = new FriendDiscuss_req;
        req.mode = 1;
        req.friendId = this.Data;
        SocketMgr.Ins.SendMessageBin(req);
     }

     private onBtn1Click(){
        let req = new FriendDiscuss_req;
        req.mode = 2;
        req.friendId = this.Data;
        SocketMgr.Ins.SendMessageBin(req);
     }

     private onBtn2Click(){
        if(RoleInfoModel.Ins.pveModeExist >= 1){
            let req = new FriendDiscuss_req;
            req.mode = 3;
            req.friendId = this.Data;
            SocketMgr.Ins.SendMessageBin(req);
        }else{
            E.ViewMgr.ShowMidError(E.getLang("tuwei1"));
        }
     }

     protected onInit(): void {
         
     }

     protected onExit(): void {
         
     }
}