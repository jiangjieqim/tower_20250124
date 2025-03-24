import { InitConfig } from "../../InitConfig";
import { E } from "../G";
import { LoginClient } from "./clients/LoginClient";
import { GetServerTimeMS_req, Heartbeat_req } from "./protocols/BaseProto";
import { getParseObj } from "./protocols/ProtoDef";

export class SocketMgr {
    // public HeartMillisecond:number;
    private _socket: ClientSocket;
    // HeartMillisecond: number;
    KickNtfType:number;

    // public readIndex:number = 0;
    public constructor() {
        this.initData()
    }
    public static get Ins() {
        if (!this._ins) this._ins = new SocketMgr();
        return this._ins;
    }
    private static _ins: SocketMgr;

    //初始化数据
    private initData(): void {
        if (!this._socket) {
            this._socket = new ClientSocket();
            this._socket.E = E;
            this._socket.getParseObj = getParseObj;
            this._socket.SetHeartbeatCall(Callback.Create(this, this.hearbeatCallback));
            this._socket.SetReconnectCall(Callback.Create(this, this.connectWebSocket));
        }
      }

    //连接到对象
    public ConnectWebsocket(target, callback): void {
        // LogSys.Log("websocket connecting======");
        let sendUrl: string = InitConfig.getServerIp();//wss://cleannumber.wonderfrog.cn/websocket;ws://127.0.0.1:20000
        this._socket.ConnectByUrl(sendUrl, target, callback);
    }

    private connectWebSocket(){
        this.ConnectWebsocket(this, () => {
            // if(initConfig.platform == PlatformConfig.WeiXin){
                E.sendTrack("connectWebSocket>>>>>>>>>>");
                if (SocketMgr.Ins.IsConnect()) {
                    LoginClient.Ins.wxReconnetLogin();
                }
            // }else{
            // }
        });
    }
/*
    //发送消息
    public SendMessage(msgId: number, msg: any): void {
        if (!this._socket.IsConnect()) {
            console.log("websocket not connect");
            return;
        }
        //todo:转换为json的操作放到这里，外部直接传入数据结构

        this._socket.SendMessage(msgId, msg);
    }
*/
    //流格式发送消息
    public SendMessageBin( msg: any): void {
        if (!this._socket.IsConnect()) {
            LogSys.Log("websocket not connect");
            return;
        }
        this._socket.binSendMsg(msg);
    }

    public setServerType(value:number){
        this._socket.serverType = value;
    }

    public getServerType(){
        return this._socket.serverType
    }

    //是否连接
    public IsConnect(): boolean {
        return this._socket && this._socket.IsConnect();
    }
    //关闭socket
    public CloseSocket(): void {
        if (this._socket)
            this._socket.close();
    }

    //#region 心跳消息
    private _hearbeatMsg: string = JSON.stringify({});
    private hearbeatCallback() {
        // SocketMgr.Ins.SendMessage(MSGID.HeartbeatReq, this._hearbeatMsg);
        // LogSys.LogColor(">>心跳包发送");
        SocketMgr.Ins.SendMessageBin(new Heartbeat_req());
        SocketMgr.Ins.SendMessageBin(new GetServerTimeMS_req());
    }
    //#endregion

}