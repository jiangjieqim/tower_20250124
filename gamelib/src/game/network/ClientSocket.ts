import { LogSys } from "../../frame/util/LogSys";
import { TimeUtil } from "../../frame/util/TimeUtil";
import { Callback } from "../event/Callback";
import { EventID } from "../event/EventID";
// import { EventID } from "../event/EventID";
// import { E } from "../G";

/**
 * 协议解析接口
 */
interface IProtoParse{
    // getProtoid():number;
    protoid:number;
    write(b:Laya.Byte):void;
    read(b:Laya.Byte):void;
}

export enum SERVERTYPE{
    CLOSE = 1,//正常断线
    SELECTTYPE = 2,//选择服务器
    KickNtf = 3,//被踢下线
}

/**客户端socket*/
export class ClientSocket {
    static HeartMillisecond:number;
    getParseObj:Function;
    private blen: number = 0;
    //心跳包间隔(豪秒)
    private get HEART_TIME() {
        let v = ClientSocket.HeartMillisecond;
        if (!v) {
            v = 2000;
        }
        return v;
    }
    E:IE;
    private _socket: Laya.Socket;
    /**
     * 是否用Json结构的协议体
     */
    public static mJsonString:boolean = false;
    private _target;
    private _callback;
    private _url:string;
    constructor(){
        // let herat = parseInt(HrefUtils.getHref("heart"));
        // if(!isNaN(herat)){
        // this.HEART_TIME = herat;
        // }
    }
    public ConnectByUrl(url: string, target, callback): void {
        this._url = url;
        if (!this._socket) {
            this._socket = new Laya.Socket();
            this._socket.endian = Laya.Socket.BIG_ENDIAN;
        }
        this._target = target;
        this._callback = callback;
        console.log('ConnectByUrl:' + url)//, 'color:#ff0000');
        this._socket.connectByUrl(url);//+"?a=datatest"
        this.regEvents();

    }

    //注册
    private regEvents(): void {
        if (this._socket) {
            this._socket.on(Laya.Event.OPEN, this, this.socketOpenHandler);
            this._socket.on(Laya.Event.MESSAGE, this, this.socketMessageHandler);
            this._socket.on(Laya.Event.CLOSE, this, this.socketCloseHandler);
            this._socket.on(Laya.Event.ERROR, this, this.socketErrorHandler);
        }
    }

    //移除
    private remEvents(): void {
        if (this._socket) {

            this._socket.off(Laya.Event.OPEN, this, this.socketOpenHandler);
            this._socket.off(Laya.Event.MESSAGE, this, this.socketMessageHandler);
            this._socket.off(Laya.Event.CLOSE, this, this.socketCloseHandler);
            this._socket.off(Laya.Event.ERROR, this, this.socketErrorHandler);
        }
    }

    public serverType:number;
    private get headMSGID(){
        return 1001;
    }
    get hasLog(){
        return Laya.Utils.getQueryString("proto_log");
    }

    public binSendMsg(msg: IProtoParse):void{
        if (!this.IsConnect()) {
            console.log("socket 为空");
            return;
        }
        let cmd = msg.protoid;//msg.getProtoid();
        //消息内容
        let data: Laya.Byte = new Laya.Byte();//优化,不要NEW 字节流对象!!!!!!!!!
        data.pos = 0;
        data.endian = Laya.Byte.BIG_ENDIAN;
        // data.endian = Laya.Byte.LITTLE_ENDIAN;
        // data.writeUTFBytes(msg);
        if(typeof msg == "string"){
            throw Error("检查是否是json格式的协议");
        }
        msg.write(data);

        if (this.hasLog) {
            this.blen += data.length;
            if(cmd!=this.headMSGID){
                if(!this.checkCmd(cmd)){
                    console.log("..send:" + TimeUtil.serverTimeOutStr,msg, data.length + " bytes " );
                }
            }
            // + (this.blen / 1024).toFixed(3) + "kb"
        }
        // LogSys.Log("send cmd " + cmd + " len " + data.length);

        //消息域
        let msgByteArr: Laya.Byte = new Laya.Byte();//优化,不要NEW 字节流对象!!!!!!!!!
        msgByteArr.pos = 0;
        msgByteArr.endian = Laya.Byte.BIG_ENDIAN;

        //msgid+msg
        msgByteArr.writeUint16(cmd);
        msgByteArr.writeUint32(data.length);

        if (data.length > 0) {
            msgByteArr.writeArrayBuffer(data.buffer);
        }
        //console.log(msg);
        // LogSys.Log("send " + cmd + " (" + data.length + " bytes)"/*+",all len:"+msgByteArr.length+" bytes"*/);

        this._socket.send(msgByteArr.buffer);//发送消息

        // msg = AESUtil.DEncrypt(msg);
        // console.log("解密后：" + msg);
    }

    //发送消息
    public SendMessage(msgId: number, msg: any): void {
        if (!this.IsConnect()) {
            console.log("socket 为空");
            return;
        }
        // console.log("send:"+msgId);
        // if(!ClientSocket.mJsonString){
        //     this.binSendMsg(msg);
        //     return;
        // }

        // msg = JSON.parse(msg);
        // msg = AESUtil.Encrypt(msg);
        // console.log("加密后：" + msg);
        // msg = JSON.stringify(msg);

        //消息内容
        let data: Laya.Byte = new Laya.Byte();
        data.pos = 0;
        data.endian = Laya.Byte.BIG_ENDIAN;
        data.writeUTFBytes(msg);

        //消息域
        let msgByteArr: Laya.Byte = new Laya.Byte();
        msgByteArr.pos = 0;
        msgByteArr.endian = Laya.Byte.BIG_ENDIAN;

        //msgid+msg
        msgByteArr.writeUint16(msgId);
        msgByteArr.writeUint32(data.length);

        if (data.length > 0) {
            msgByteArr.writeArrayBuffer(data.buffer);
        }
        this._socket.send(msgByteArr.buffer);//发送消息

        // msg = AESUtil.DEncrypt(msg);
        // console.log("解密后：" + msg);

        if (msgId != this.headMSGID) {

            // console.log("debuginfo clientSocket sendMessage CmdId:" + idNumber);
            // console.log("debuginfo clientSocket sendMessage msg:");
            // console.log(msg);
        }
    }

    // type MessageBinary struct{
    //     CmdLen uint32       // 4
    //     TimeStamp uint32    // 4
    //     CmdId   uint32      // 4
    //     BodyLen uint32      // 4
    //     Data []byte
    // } 
    // public static readIndex:number = 0;


    private checkCmd(cmdId:number){
        if(debug){
            let disable:boolean = false;
            let disableCMD:string = Laya.Utils.getQueryString("disableCMD");
            
            // if(!disableCMD){
            // disableCMD=initConfig['disableCMD'];
            // }
            if(disableCMD){
                let arr = disableCMD.split("@");
                if(arr.indexOf(cmdId.toString())!=-1){
                    disable = true;
                }
            }
            return disable;
        }
        return false;
    }

    //读取数据
    private readMessage(msg: any): void {
        let data: Laya.Byte = new Laya.Byte();
        data.writeArrayBuffer(msg);

        data.pos = 0;
        data.endian = Laya.Byte.BIG_ENDIAN;

        let cmdId: number = data.getUint16();
        let datalen: number = data.getUint32();
        // LogSys.Log("revc:" + cmdId + " (" + datalen + " bytes)");

        let protoByte: Laya.Byte = new Laya.Byte();
        let protoUint8Arr: Uint8Array = data.getUint8Array(data.pos, datalen);
        protoByte.writeArrayBuffer(protoUint8Arr.buffer);
        protoByte.pos = 0;
        protoByte.endian = Laya.Byte.BIG_ENDIAN;

        let obj: IProtoParse = this.getParseObj(cmdId) as IProtoParse;
        if (obj) {
            if(this.hasLog){
                this.blen+=protoByte.length;
                if(cmdId!=this.headMSGID){
                    let disable:boolean = this.checkCmd(cmdId);
                    if(!disable){
                        console.log("" + Laya.timer.currTimer + ",read:" + TimeUtil.serverTimeOutStr, 
                        obj
                        , "cmd:" + cmdId + " len:" + protoByte.length);
                    }
                }
                // + " bytes,all len:" + (this.blen / 1024).toFixed(3) + "kb"
            }
            // LogSys.Log("read cmd " + cmdId + " len " + protoByte.length);
            if (cmdId != this.headMSGID) {
                
                if(obj.read){
                
                    // try{
                    // LogSys.Log("read " + cmdId + ",protoByte:" + protoByte.length + " bytes" + ",all len:" + msg.byteLength + " bytes");
                    obj.read(protoByte);
                    // }catch(e){
                        // console.error("解析协议异常,请检查协议:"+cmdId);
                        // E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,"协议"+cmdId+"不一致!");
                    // }
                    protoByte.clear();
                    let msgInfo: any = { msgId: cmdId, data: obj };
                    //消息内部派发
                    this.E.EventMgr.emit(EventID.WEBSOCKET_MESSAGE, msgInfo);
                    // SocketMgr.Ins.readIndex++;
                }
                else{
                    console.error(cmdId+" 协议未添加监听!");
                }
            }
        } else {
            console.error("协议:"+cmdId+"未定义");
            // let msgData: any = protoByte.readUTFBytes(datalen);
            // if (cmdId != MSGID.HeartbeatRsp) {
            //     // console.log("debuginfo clientSocket receivems cmdId:" + cmdId);
            //     // console.log("debuginfo clientSocket receivems msgData:");
            //     // console.log(msgData);

            //     // console.log("解密前：" + msgData);
            //     // msgData = AESUtil.DEncrypt(msgData);
            //     msgData = JSON.parse(msgData);
            //     // console.log("解密后：" + msgData);
            //     protoByte.clear();

            //     let msgInfo: any = { msgId: cmdId, data: msgData };

            //     //消息内部派发
            //     E.EventMgr.emit(EventID.WEBSOCKET_MESSAGE, msgInfo);
            // }
        }
    }

    //是否是连接状态
    public IsConnect(): boolean {
        return this._socket && this._socket.connected;
    }

    //关闭socket连接
    public close(): void {
        if (this._socket)
            this._socket.close();
    }

    //连上socket
    private socketOpenHandler(): void {
        LogSys.Log("webSocket is open");

        this.StartOrStopHeartbeat(true);
        this.totalReconnectCount = 10;
        this.curReconnectCount = 0;
        this.serverType = SERVERTYPE.CLOSE;

        if (this._callback != null)
            this._callback.bind(this._target)();
    }

    private _msgList:any[];

    private onReadList(){
        if(this._msgList.length > 0){
            // console.log(new Date().toString());
            let cell = this._msgList.shift();
            this.readMessage(cell);
        }
    }

    //接收消息
    private socketMessageHandler(msg: any = null): void {
        // let time: number = DebugData.delay;
        // if (time) {
        //     if (!this._msgList) {
        //         this._msgList = [];
        //         Laya.timer.loop(time, this, this.onReadList);
        //     }
        //     this._msgList.push(msg);
        // } else {
            this.readMessage(msg);
        // }
    }

    /*
    TODO:网络异常断开连接后 需要弹窗提示 
        并尝试重新连接 n次后仍未成功，退到登录页面 需要用户主动重新登录
    */
    private needReconnect: boolean = false;
    private totalReconnectCount: number = 3;//总连接次数
    private curReconnectCount: number = 0;//当前连接次数
    private reconnectCallback: Callback;//重连回调

    public SetReconnectCall(callback: Callback) {
        this.reconnectCallback = callback;
    }

    //sockect 关闭
    private socketCloseHandler(): void {
        LogSys.Log("webSocket is close");
        this.E.sendTrack("webSocket is close",{"curReconnectCount":this.curReconnectCount});
        this.StartOrStopHeartbeat(false);
        this.clean();

        if(this.serverType == SERVERTYPE.SELECTTYPE){
            // E.EventMgr.emit(EventID.WEBSOCKET_SELECTSERVER, null);
            this.E.MsgMgr.reset();
            // E.ViewMgr.Close(EViewType.SheZhiView);
            // E.ViewMgr.Close(EViewType.QuFuView);
            // MainModel.Ins.connectRegist();

            this.E.EventMgr.emit(EventID.ConnectRegist);

        }else if(this.serverType == SERVERTYPE.KickNtf){
            this.E.EventMgr.emit(EventID.KickNtf, null);
        }
        else{
            if (this.curReconnectCount == 0) this.needReconnect = true;
            if (this.needReconnect && this.curReconnectCount < this.totalReconnectCount) {
                ++this.curReconnectCount;
                LogSys.Warn("curReconnectCount:::" + this.curReconnectCount);
                Laya.timer.callLater(this,()=>{
                    if (this.reconnectCallback != null) this.reconnectCallback.Invoke({ caller: this, callback: null });
                });   
            }
            else {
                this.needReconnect = false;
                if (this._callback != "") this._callback = "";
                this.E.EventMgr.emit(EventID.WEBSOCKET_CLOSED, null);
            }
        }
    }

    //socket错误
    private socketErrorHandler(): void {
        // if(debug){
        // E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,`${this._url} connect fail!`);
        // }
        LogSys.Log("webSocket Error is close");
        this.E.sendTrack("webSocket Error is close",{"curReconnectCount":this.curReconnectCount});
        this.StartOrStopHeartbeat(false);
        this.clean();
        Laya.timer.once(1000,this,this.onCurRec);
        // if (this._callback != "") {
        //     this._callback = "";
        // }
        // E.EventMgr.emit(EventID.WEBSOCKET_ERROR, null);
    }

    private onCurRec(){
        LogSys.Log("onCurRec>>>>>>>>>>");
        this.E.sendTrack("onCurRec",{"curReconnectCount":this.curReconnectCount});
        if(this.curReconnectCount >= this.totalReconnectCount){
            this.E.EventMgr.emit(EventID.WEBSOCKET_ERROR, null);
            LogSys.Log("onCurRec>>>>>>>>>>,EventID.WEBSOCKET_ERROR");
            return;
        }
        if(this._socket && this._socket.connected){
            LogSys.Log("onCurRec>>>>>>>>>>,connectedOKOKOK>>>>");
            return;
        }else{
            if (this.reconnectCallback != null) this.reconnectCallback.Invoke({ caller: this, callback: null });
            this.curReconnectCount ++;
            LogSys.Log("onCurRec>>>>>>>>>>,connected>>>>",this.curReconnectCount);
        }
    }

    private clean(): void {
        if (this._socket) {
            this._socket.close();
            this.remEvents();
            this._socket = null;
        }
    }

    //#region 心跳
    private _heartbeatTimer: Laya.Timer;
    private _heartbeatCallback: Callback;
    public SetHeartbeatCall(callback: Callback) {
        this._heartbeatCallback = callback;
    }

    /**开始或停止心跳*/
    public StartOrStopHeartbeat(b: boolean) {
        if (this._heartbeatTimer)
            this._heartbeatTimer.clear(this, this.headbeatHandler);

        if (b) {
            if (this._heartbeatTimer == null)
                this._heartbeatTimer = new Laya.Timer();

            this._heartbeatTimer.once(this.HEART_TIME, this, this.headbeatHandler);
        }
    }

    //心跳
    private headbeatHandler(): void {
        if (this._heartbeatCallback != null)
            this._heartbeatCallback.Invoke();
        this._heartbeatTimer.once(this.HEART_TIME, this, this.headbeatHandler);
    }

    //#endregion
}