import { BaseModel } from "../../frame/util/ctl/BaseModel";
// import { EventID } from "../event/EventID";
import { E } from "../G";
import { ActivityModule } from "../view/handle/activity/ActivityModule";
import { ChatModule } from "../view/handle/chat/ChatModule";
import { ChengHaoModule } from "../view/handle/chenghao/ChengHaoModule";
import { ComposeModel } from "../view/handle/compose/ComposeModel";
import { DayTaskModule } from "../view/handle/dayTask/DayTaskModule";
import { DianYuModule } from "../view/handle/dianyu/DianYuModule";
import { FriendModule } from "../view/handle/friend/FriendModule";
import { FuLiModule } from "../view/handle/fuli/FuLiModule";
import { GuideModel } from "../view/handle/guide/GuideModel";
import { MailModule } from "../view/handle/mail/MailModule";
import { MainModel } from "../view/handle/main/model/MainModel";
import { NewYearModule } from "../view/handle/newyear/NewYearModule";
import { RankModule } from "../view/handle/rank/RankModule";
import { RoleInfoModule } from "../view/handle/roleinfo/RoleInfoModule";
import { ShengShouModule } from "../view/handle/shengshou/ShengShouModule";
import { SheZhiModule } from "../view/handle/shezhi/SheZhiModule";
import { SkillModule } from "../view/handle/skill/SkillModule";
import { TaoDaeModel } from "../view/handle/taodae/model/TaoDaeModel";
import { TowertMainModule } from "../view/handle/towertmain/TowertMainModule";
import { TowertMainCardModule } from "../view/handle/towertmaincard/TowertMainCardModule";
import { TowertMainHeroModule } from "../view/handle/towertmainhero/TowertMainHeroModule";
import { TowertMainLinbaoModule } from "../view/handle/towertmainlinbao/TowertMainLinbaoModule";
import { TowertMainShopModule } from "../view/handle/towertmainshop/TowertMainShopModule";
// import { YinDaoModule } from "../view/handle/yindao/YinDaoModule";
import { LoginClient } from "./clients/LoginClient";
import { SERVER_MSGID } from "./protocols/ProtoDef";

class RemoteMsgVo{
    msgId:SERVER_MSGID;
    remoteList:Callback[] = [];
    clear(){
        this.msgId = null;
        this.remoteList = [];
    }
    invoke(data){
        for(let i = 0;i < this.remoteList.length;i++){
            let cell = this.remoteList[i];
            cell.Invoke(data);
        }
    }

    push(callback: Function, that?: any){
        this.remoteList.push(Callback.Create(that,callback));
    }
}
interface IMSG_revc{
    msgId:number;
    data;
}
/**消息管理器
 * -处理Socket消息的派发与接收
*/
export class MsgManager {
    //TODO:后面需要把消息处理方法 也放到归类里

    //#region 静态

    //#endregion

    //#region 实例

    // private _msgDic: Dictionary<MSGID, Callback> = new Dictionary<MSGID, Callback>();//监听消息字典
    private _msgList:RemoteMsgVo[] = [];
    private _hasInit: boolean = false;
    private _moduleList:BaseModel[] = [];
    constructor() { }
    public Init(): boolean {
        if (this._hasInit) return false;
        this._hasInit = true;

        //#region 根据相应模块进行拆分

        let _moduleList = [
            LoginClient.Ins,
            MainModel.Ins,
            TowertMainModule.Ins,
            TowertMainHeroModule.Ins,
            SkillModule.Ins,
            TowertMainLinbaoModule.Ins,
            TowertMainShopModule.Ins,
            SheZhiModule.Ins,
            TowertMainCardModule.Ins,
            GuideModel.Ins,
            RoleInfoModule.Ins,
            DayTaskModule.Ins,
            MailModule.Ins,
            RankModule.Ins,
            ActivityModule.Ins,
            ChengHaoModule.Ins,
            // YinDaoModule.Ins,
            ChatModule.Ins,
            FuLiModule.Ins,
            ShengShouModule.Ins,
            FriendModule.Ins,
            DianYuModule.Ins,
            TaoDaeModel.Ins,
            NewYearModule.Ins
        ];

        this._moduleList = _moduleList;
        this._moduleList.push(ComposeModel.Ins);
        for(let i = 0;i < _moduleList.length;i++){
            let _base:BaseModel = _moduleList[i];
            // _base.onInitCallBack();
            _base.initMsg();
        }


        //#endregion

        E.EventMgr.on(EventID.WEBSOCKET_MESSAGE, this, this.socketMessageHandler);

        return true;
    }

    public reset(){
        for(let i = 0;i < this._moduleList.length;i++){
            let _base:BaseModel = this._moduleList[i];
            _base.onInitCallBack();
        }
    }

    public Clear() {
        // this._msgDic.Clear();
        while(this._msgList.length){
            let cell = this._msgList.shift();
            cell.clear();
        }
    }

    public AddMsg(msgid: SERVER_MSGID, callback: Function, caller?: any) {
        this.addMsg(msgid, callback, caller);
    }

    //消息
    private socketMessageHandler(msg: IMSG_revc): void {
        // if (this._msgDic.Value(msg.msgId))
        //     this._msgDic.Value(msg.msgId).Invoke(msg.data);
        for(let i = 0;i < this._msgList.length;i++){
            let cell = this._msgList[i];
            if(cell.msgId == msg.msgId){
                cell.invoke(msg.data);
            }
        }
    }

    /**注册监听 */
    private addMsg(msgid: SERVER_MSGID, callback: Function, that?: any) {
        /*
        if (this._msgDic.Value(msgid)) {
            console.warn("repeat add msgid:" + msgid);
            return;
        }
        this._msgDic.Add(msgid, Callback.Create(that, callback));
        */
        let _find:boolean = false;
        let _obj:RemoteMsgVo;
        for(let i = 0;i < this._msgList.length;i++){
            let cell = this._msgList[i];
            if(cell.msgId == msgid){
                LogSys.Warn("repeat add msgid:" + msgid);
                _obj = cell;
                _find = true;
                break;
            }
        }
        if(!_obj){
            _obj = new RemoteMsgVo();
            _obj.msgId = msgid;
            this._msgList.push(_obj);
        }
        _obj.push(callback,that);
    }


    //#endregion
}