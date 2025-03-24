import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FriendPrivateChatAction_req, stFriendPrivateChatRole } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { HeadCtl } from "../../common/HeadCtl";
import { MainModel } from "../../main/model/MainModel";
import { ChatModel } from "../model/ChatModel";

export class ChatItem3 extends ui.views.chat.ui_chatItem4UI{

    private _ctl:HeadCtl;

    constructor(){
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);

        this._ctl = new HeadCtl(this.view);
        ButtonCtl.CreateBtn(this.btn, this, this.onClick);
    }

    private onClick(){
        if(!this._data)return
        let req = new FriendPrivateChatAction_req;
        req.flag = 0;
        req.friendId = this._data.friendId;
        SocketMgr.Ins.SendMessageBin(req);
        let index = ChatModel.Ins.slList.findIndex(ele=>ele.friendId == this._data.friendId);
        if(index != -1){
            ChatModel.Ins.slList.splice(index,1);
            ChatModel.Ins.event(ChatModel.UPDATE_DATA_SL);
        }
    }

    private onDisplay(){
        
    }

    private onUnDisplay(){
       
    }

    private _data:stFriendPrivateChatRole;
    public setData(value:stFriendPrivateChatRole,bo:boolean){
        if(!value)return;
        this._data = value;
        let headUrl = MainModel.Ins.convertHead(value.headUrl);
        this._ctl.setData(headUrl, value.headFrame);
        this.sel.visible = bo;
        this.lab_tr.text = value.trophy + "";
        this.lab.text = value.nickName;
        if(bo){
            DotManager.removeDot(this);
            value.hasRed = 0;
        }else{
            if(value.hasRed){
                DotManager.addDot(this);
            }else{
                DotManager.removeDot(this);
            }
        }
    }
}