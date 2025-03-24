import { BaseModel } from "../../../frame/util/ctl/BaseModel";
import { InitConfig } from "../../../InitConfig";
import { Frame } from "../../audio/AudioMgr";
import { EMsgBoxType, EViewType } from "../../common/defines/EnumDefine";
// import { Player } from "../../player/Player";
// import { EventID } from "../../event/EventID";
import { E } from "../../G";
import { LayerMgr } from "../../layer/LayerMgr";
import { IMsgBoxParms } from "../../view/handle/common/MsgBoxView2";
import { ILoginResult, LoginViewNew } from "../../view/handle/login/LoginViewNew";
import { MainModel } from "../../view/handle/main/model/MainModel";
import { TowerMainFightModel } from "../../view/handle/towertmain/model/TowerMainFightModel";
// import { MSGID } from "../MSGID";
import { Kick_revc, WebClientLogin_req, WebClientLogin_revc, WebClientRegist_req, WebClientRegist_revc, wxLogin_req } from "../protocols/BaseProto";
import { SERVER_MSGID } from "../protocols/ProtoDef";
import { SocketMgr } from "../SocketMgr";
/**平台ID定义*/
export enum EPID {
    Internal = 0,   //内部登录
    WxMini = 1,     //wx小游戏
    QQMini = 2,     //qq小游戏
}

/**
 * 登录消息通信处理
*/
export class LoginClient extends BaseModel{
    //#region 静态
    private static _ins: LoginClient;
    public static get Ins() {
        if (!this._ins) this._ins = new LoginClient();
        return this._ins;
    }
    code:number = 0;
    public onInitCallBack():void{
        this.code = 0;
    }
    //#endregion
    // public openId:string = "";
    //#region 实例

    public initMsg(): void {
        E.MsgMgr.AddMsg(SERVER_MSGID.WebClientRegist, this.onRegistRsp,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.WebClientLogin, this.onLoginRsp,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.Kick, this.onKickNtf,this);
    }

    //#region 注册消息

    public ReqRegist(acc: string, pwd: string) {
        if (SocketMgr.Ins.IsConnect()) {
            let obj: WebClientRegist_req = new WebClientRegist_req();
            obj.pid = EPID.Internal;
            obj.account = acc;
            obj.password = pwd;
            SocketMgr.Ins.SendMessageBin(obj);
            return;
        }else{
            //socket未连接,连接后再登录
            SocketMgr.Ins.ConnectWebsocket(this, () => {
                this.ReqRegist(acc, pwd);
            });
        }
    }

    /**
     * @param type 0非断线重现 1 断线重连
     */
    private wxLogin(type:number){
        let req:wxLogin_req = new wxLogin_req();
        let _data:ILoginResult = InitConfig.wxLoginResult.result;
        req.appid = _data.appid;
        req.openid = _data.openid;

        let token =  _data.token;
        if(Laya.Utils.getQueryString("token")){
            token = Laya.Utils.getQueryString("token");
        }
        req.token = token;
        req.type = type;
        req.inviterId = 0;
        let distinctId = "";
        if(E.ta){
            if(E.ta.store){
                distinctId = E.ta.store._state.distinct_id;
            }else if(E.ta.persistence){
                distinctId = E.ta.persistence._state.distinct_id;
            }
        }
        req.distinctId = distinctId;
        req.scene = 0;
        req.tunnelId = E.sdk.cbsgTunnelId;
        req.age = E.sdk.age;

        if(Laya.Utils.getQueryString("age")){
            E.sdk.age = parseInt(Laya.Utils.getQueryString("age"));
        }
        LogSys.Log(`age:${req.age}`);
        if (window['wx']) {
            const data = wx.getLaunchOptionsSync();
            req.scene = data['scene'];
            const inviterId = Number(data['query'] && data['query']['inviterId']);
            if (inviterId) {
                req.inviterId = inviterId;
            }
            const frid = data['query'] && data['query']['wxFriendRoomId'];
            if (!StringUtil.IsNullOrEmpty(frid)) {
                TowerMainFightModel.Ins.wxFriendRoomId = frid;
            }
        } else {
            const inviterId = Number(Laya.Utils.getQueryString("inviterId"));
            if (inviterId) {
                req.inviterId = inviterId;
            }
            const frid = Laya.Utils.getQueryString("wxFriendRoomId")
            if (!StringUtil.IsNullOrEmpty(frid)) {
                TowerMainFightModel.Ins.wxFriendRoomId = frid;
            }
        }
            
        LogSys.Log("wxLogin:"+req.appid+","+req.openid+","+req.token+","+req.type+","+req.distinctId+","+req.scene+","+req.inviterId);
        SocketMgr.Ins.SendMessageBin(req);
    }

    public wxNormalLogin(){
        if (SocketMgr.Ins.IsConnect()) {
            this.wxLogin(0);
            E.taLoginTrack("socketLinkComplete")
            // console.log("socket链接完成")
        }else{
            SocketMgr.Ins.ConnectWebsocket(this,this.onConnectSucceed);
        }
    }

    private onConnectSucceed(){
        let id:number = EViewType.LoginNew;

        if(E.ViewMgr.isOpenReg(id)){
            let view:LoginViewNew = E.ViewMgr.Get(id) as LoginViewNew;
            if(view){
                view.onUnlockEnter();
                E.ViewMgr.closeWait();
            }
        }
    }

    public wxReconnetLogin(){
        this.wxLogin(1);
    }

    

    // public startConnect(){
    //     SocketMgr.Ins.ConnectWebsocket(this,this.statrtWxLogin);
    // }

    /**注册返回 */
    private onRegistRsp(data: WebClientRegist_revc) 
    {
        E.EventMgr.emit(EventID.WebClientRegistRsp, { errorID: data.errorID });
    }

    //#endregion

    //#region 登录消息

    /**登录请求
     * @param acc 账号
     * @param pwd 密码
    */
    public ReqLogin(acc: string, pwd: string) {
        if (SocketMgr.Ins.IsConnect()) {
            let msg: WebClientLogin_req = new WebClientLogin_req();
            msg.account = acc;
            msg.password = pwd;
            msg.pid = EPID.Internal;
            // msg.openid = E.sdk.getOpenId();
            // LogSys.Log("WebClientLogin_req:",JSON.stringify(msg));
            SocketMgr.Ins.SendMessageBin(msg);
            E.ViewMgr.openWait(true);
            return;
        }
        //连接后再登录
        SocketMgr.Ins.ConnectWebsocket(this, () => {
            this.ReqLogin(acc, pwd);
        });
    }

    private onAudioComplete(){
        LogSys.Log("onAudioComplete...");
        E.AudioMgr.PlayBGM(Frame.BGMDefine.bgm);
    }

    public startPlayAudio(){
        E.AudioMgr.LoadAudio(this,this.onAudioComplete,this.loadAudioProgress)
    }

    private loadAudioProgress(v:number){
        LogSys.Log("loadAudioProgress:"+v);
    }

    /**登录返回*/
    private onLoginRsp(data: WebClientLogin_revc): void {

        if(Laya.Utils.getQueryString("errorID")){
            data.errorID = parseInt(Laya.Utils.getQueryString("errorID"));
        }

        this.code = data.errorID;
        if (data.errorID == 0) {
            let model = MainModel.Ins;

            // model.clearUI();

            ClientSocket.HeartMillisecond = data.serverConfig.HeartMillisecond;
            //客户端-服务器-时间差值
            TimeUtil.serverTimeV = data.serverConfig.ServerTime;
            // LogSys.Log("ServerTime:"+TimeUtil.timestamtoTime(TimeUtil.serverTime * 1000));
            let opentime = data.serverConfig.openTime;
            // if(opentime.isZero()){
            //     opentime = new uint64(TimeUtil.serverTime);
            // }
            TimeUtil.openTime = opentime;
            LogSys.Log("开服时间:"+TimeUtil.timestamtoTime(TimeUtil.serverTime * 1000));

            model.isNewRole = data.newRole == 1;
            model.season = data.season;
            model.todayFirstLogin = data.todayFirstLogin;
            model.todaySpirit = data.todaySpirit;

            let mRoleData = model.mRoleData;
            mRoleData.mBaseInfo = data.BaseInfo;
            mRoleData.mPlayer = data.playerData;

            // mRoleData.mPlayer.HeadUrl = 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epvVWFNMvSCvDD1QdnIaFiagPh0smEyv89AzFqCGRc5FDIZdtWfVec2FDuq5DsdzbwCLFa2gC4W7xg/132';
            // mRoleData.mPlayer.HeadUrl = `https://thirdwx.qlogo.cn/mmopen/vi_32/mUEpYJPWEfEepupX422ib5etOtv5tzia2Sia0icPks7H73sNiaHPGk1BHRDn9ET1iaXnGkSOAxX5S17Jh3EPiat5v0JAg/132`;
            LogSys.Log("url1:"+mRoleData.mPlayer.HeadUrl);

            if(E.ta){
                E.ta.login(data.playerData.AccountId.toString());
                E.ta.userSetOnce({ cleint_account_id: data.playerData.AccountId });
            }
            mRoleData.NickName = data.playerData.NickName;
            mRoleData.AccountId = data.playerData.AccountId;
            mRoleData.serverId = data.playerData.serverId;
            mRoleData.lv = data.playerData.level;
            mRoleData.exp = data.playerData.curLevelExp;
            mRoleData.trophy = data.playerData.trophy;
            mRoleData.HeadFrame = data.playerData.HeadFrame;
            if(initConfig.debug_pay_server_id){
                mRoleData.serverId = parseInt(initConfig.debug_pay_server_id);
            }
            
            //todo 测试用
            // mRoleData.serverId = 999888777;
            // if(!StringUtil.IsNullOrEmpty(data.playerData.naming)){
            //     mRoleData.serverName = data.playerData.naming;
            // }else{
            mRoleData.serverName = data.playerData.serverName;
            // }
            // this.startPlayAudio();

        }else if(data.errorID == 2){
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,E.getLang("acmount_stop"));
        }
        else if(data.errorID == 5){
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, E.getLang("underage_err"), new Laya.Handler(this,this.onErrHandler), undefined, undefined, { fontSize: 23 } as IMsgBoxParms);
        }
        E.ViewMgr.closeWait();
        E.EventMgr.emit(EventID.WebClientLoginRsp, { errorID: data.errorID });
    }

    private onErrHandler(){
        LayerMgr.Ins.pageToLogin();
    }

    //#endregion


    /**踢出通知 */
    private onKickNtf(data: Kick_revc): void {
        SocketMgr.Ins.KickNtfType = data.reason;
        SocketMgr.Ins.setServerType(SERVERTYPE.KickNtf);
        // console.log("onKickNtf:", data.reason);
    }

}