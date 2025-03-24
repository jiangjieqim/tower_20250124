import { MathUtil } from "../../../../../frame/util/MathUtil";
import { stChat, stChatChannel, stFriendPrivateChatRole } from "../../../../network/protocols/BaseProto";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";

export class ChatModel extends Laya.EventDispatcher{
    private static _ins: ChatModel;

    private _channelId:number;

    public chatList:stChatChannel[];
    public slList:stFriendPrivateChatRole[];
    public slDataList:stChat[];

    public static UPDATE_DATA:string = "UPDATE_DATA";
    public static UPDATE_DATA_SL:string = "UPDATE_DATA_SL";
    public static UPDATE_DATA_SLDATA:string = "UPDATE_DATA_SLDATA";
    public static UPDATE_MAIN:string = "UPDATE_MAIN";
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new ChatModel();
        }
        return this._ins;
    } 

    constructor(){
        super();
        this.chatList = [];
        this._channelId = 0;
        this.slList = [];
        this.slDataList = [];
    }

    public getChatList(channelId:number){
        return this.chatList.find(ele => ele.channelId == channelId);
    }

    public getChannelNum(){
        return parseInt(System_RefreshTimeProxy.Ins.getVal(50));
    }

    public get channelId(){
        if(this._channelId){
            return this._channelId;
        }else{
            this._channelId = MathUtil.RangeInt(1,this.getChannelNum());
        }
        return this._channelId;
    }

    public set channelId(value:number){
        this._channelId = value;
    }
}