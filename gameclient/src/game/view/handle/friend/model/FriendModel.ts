import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FriendManage_req, stFriendListItem } from "../../../../network/protocols/BaseProto";
import { ChatView } from "../../chat/view/ChatView";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";

export class FriendModel extends Laya.EventDispatcher{
    private static _ins: FriendModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new FriendModel();
        }
        return this._ins;
    } 

    public static UPDATE_VIEW:string = "UPDATE_VIEW";
    public static UPDATE_VIEW_ZAN:string = "UPDATE_VIEW_ZAN";

    public firendList:stFriendListItem[];
    public firendSQList:stFriendListItem[];
    public firendTJList:stFriendListItem[];

    constructor(){
        super();
        this.firendList = [];
        this.firendSQList =[];
        this.firendTJList = [];
    }

    public isRedTip(){
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.Friend,false)){
            return false;
        }
        if(this.firendSQList.length){
            return true;
        }
        return false;
    }

    public sendCmdManage(id:number,type:number){
        let req = new FriendManage_req;
        req.playerId = id;
        req.type = type;
        SocketMgr.Ins.SendMessageBin(req);
    }

    public sendSL(id:number){
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.SiLiao,false))return;
        if (E.ViewMgr.isOpenReg(EViewType.ChatView)) {
            (E.ViewMgr.Get(EViewType.ChatView) as ChatView).setSL(id);
        }else{
            E.ViewMgr.Open(EViewType.ChatView,null,id);
        }
    }
}