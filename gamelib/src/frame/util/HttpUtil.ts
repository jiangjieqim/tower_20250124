import { LogSys } from "./LogSys";

export class HttpUtil{
    private static err(_url:string,errHandler:Laya.Handler,errData:string){
        if(errHandler){
            errHandler.runWith(errData);
        }
        if(this.E){
            this.E.sendTrack("HttpRequest", { error: errData, val: _url});
        }
    }
    private static complete(callBack:Laya.Handler,data){
        callBack.runWith(data);
    }
    public static E:IE;
    public static httpGet(url,callBack:Laya.Handler,errHandler?:Laya.Handler){
		let http:Laya.HttpRequest = new Laya.HttpRequest();
		http.once(Laya.Event.COMPLETE,this,this.complete,[callBack]);
        LogSys.Log(url);
		http.send(url,null,"get");
        http.once(Laya.Event.ERROR,this,this.err,[url,errHandler]);
    }
    public static httpPost(url,data: any,callBack:Laya.Handler){
		let http:Laya.HttpRequest = new Laya.HttpRequest();
		http.once(Laya.Event.COMPLETE,this,this.complete,[callBack]);
        LogSys.Log(url);
		http.send(url,data,"post");
        http.once(Laya.Event.ERROR,this,this.err,[url]);
    }
}