import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FriendDiscussAction_req } from "../../../../network/protocols/BaseProto";

export class FriendView3 extends ui.views.friend.ui_friendView3UI{

    constructor(){
        super();
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
        ButtonCtl.Create(this.btn1,new Laya.Handler(this,this.onBtn1Click));
    }

     private onBtnClick(){
        let req = new FriendDiscussAction_req;
        req.action = 0;
        SocketMgr.Ins.SendMessageBin(req);
     }

     private onBtn1Click(){
        let req = new FriendDiscussAction_req;
        req.action = 1;
        SocketMgr.Ins.SendMessageBin(req);
     }

     public setLab(st:string){
        this.lab.text = st;
     }
}