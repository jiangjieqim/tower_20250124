import { E } from "../../../../G";
import { FriendWatch_req, stCommonRank } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { GameEvent } from "../../main/model/GameEvent";
import { MainModel } from "../../main/model/MainModel";

export class RankModel extends Laya.EventDispatcher{
    private static _ins: RankModel;

    public rankList:stCommonRank[];
    public rankSelf:stCommonRank;
    public rankFlag:number;

    public static UPDATE_RANK:string = "UPDATE_RANK";
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new RankModel();
        }
        return this._ins;
    } 

    constructor(){
        super();
    }

    public watchPlayer(id:number){
        if(id == MainModel.Ins.mRoleData.AccountId){
            E.EventMgr.emit(GameEvent.WatchSelf);
        }else{
            let req = new FriendWatch_req;
            req.accountId = id;
            SocketMgr.Ins.SendMessageBin(req);
        }
    }
}