import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { ChatListInit_revc, Chat_revc, FriendPrivateChatContents_revc, FriendPrivateChatRoles_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { System_RefreshTimeProxy } from "../main/ctl/System_RefreshTimeProxy";
import { MainModel } from "../main/model/MainModel";
import { ChatModel } from "./model/ChatModel";
import { ChatView } from "./view/ChatView";

export class ChatModule extends BaseModel{
    private static _ins:ChatModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new ChatModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new ChatView(EViewType.ChatView));

        E.MsgMgr.AddMsg(SERVER_MSGID.ChatListInit, this.ChatListInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.Chat, this.Chat,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FriendPrivateChatRoles, this.FriendPrivateChatRoles,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FriendPrivateChatContents, this.FriendPrivateChatContents,this);
    }

    private ChatListInit(value:ChatListInit_revc){
        ChatModel.Ins.chatList = value.datalist;
    }

    private Chat(value:Chat_revc){
        let num = parseInt(System_RefreshTimeProxy.Ins.getVal(54));
        for(let i:number=0;i<value.datalist.length;i++){
            let data = ChatModel.Ins.getChatList(value.datalist[i].channelId);
            if(!data)continue;
            if(data.datalist.length >= num){
                data.datalist.shift();
            }
            data.datalist = data.datalist.concat(value.datalist[i].datalist);
            if(value.datalist[i].channelId == ChatModel.Ins.channelId){
                ChatModel.Ins.event(ChatModel.UPDATE_DATA);
                ChatModel.Ins.event(ChatModel.UPDATE_MAIN,0);
            }
        }
    }

    private FriendPrivateChatRoles(value:FriendPrivateChatRoles_revc){
        ChatModel.Ins.slList = value.datalist;
        ChatModel.Ins.event(ChatModel.UPDATE_DATA_SL);
    }

    private FriendPrivateChatContents(value:FriendPrivateChatContents_revc){
        if(value.isHole){
            ChatModel.Ins.slDataList = value.datalist;
        }else{
            ChatModel.Ins.slDataList = ChatModel.Ins.slDataList.concat(value.datalist);
        }
        ChatModel.Ins.event(ChatModel.UPDATE_DATA_SLDATA);
        ChatModel.Ins.event(ChatModel.UPDATE_MAIN,1);
    }
}