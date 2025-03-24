import { E } from "../../../../G";
import { cb1SDK } from "../cb1SDK/cb1SDK";

interface ITapTapSdk {
    // syShowRewardAd(): Promise<any>;
    syTapTapAndroidAction(str: string,data?,param?): Promise<any>;
    PUBLIC_URL: string;
    /**壳包分享接口 */
    // gotoTapTap();
}
let giftCode: string = "";

// -10 安卓映射没有
// 0成功
// 其他失败

let sdk = window['Y1YSDK'];
if (sdk) {
    /**
     * 在游戏内监听，当用户从TapTap跳转到游戏内的时候，可以通过监听去获取到用户携带过来的礼包码
     */
    sdk.syListenerTapTapGiftCode((data) => {
        // console.log(data);
        //data.code 礼包码、-1代表获取异常
        //data.message:
        if (data.code == -1) {

        } else {

        }
        giftCode = data.code;
        LogSys.Log(`your giftCode is ${JSON.stringify(data)}`);
    });
}

/**taptap 公司h5壳包 */
export class Y1Y_TapTapSdk extends cb1SDK {

    private get taptapSdk(): ITapTapSdk {
        return window['Y1YSDK'];
    }

    public lookVideo(callback: (type: 0 | 1 | 2) => void) {
        // async function sdkShowRewardAd() {
        //     var data = await sdk.syShowRewardAd();
        //     console.log(data);
        //     //data.code 0:播放完成，可以发放奖励；其他情况：失败、跳过等
        //     不发放奖励
        //     //data.message:q
        //     }

        if (this.canFreeLook) {
            callback.call(this, 1);
        } else {
            let _sdk = this.taptapSdk;
            if (typeof _sdk.syTapTapAndroidAction != "undefined") {
                LogSys.Log(`taptap开始看视频!`);

                _sdk.syTapTapAndroidAction("showRewardAd").then((data) => {

                    let t = data.code;
                    let val;
                    switch (t) {
                        case 0:
                            val = 1;
                            break;
                        default:
                            val = 0;
                            break;
                    }

                    LogSys.Log(`taptap看广告... code = ${t} val = ${val}`);
                    callback.call(this, val);
                }
                );

            } else {
                LogSys.Log(`没有接口syTapTapAndroidAction`);
            }
        }
    }

    /**
     * 分享 1成功 0失败
     * @param data 
     */
    public goShareData(shareQueryParam: string,that?,callBack?:Function) {
    /*
        window.addEventListener('message', function (e) {
            let status:number = 0;
            LogSys.Log(`goShareData:${JSON.stringify(e)}`);
            if (e.data.shareStatus === 'success') {
                // alert('分享成功');
                status = 1;
            }
            if(callBack){
                callBack.call(that,status);
            }
        });

        //todo
        let data = {
            share: 1,
            shareQueryParam: shareQueryParam
        }
        // 这地方需要判断下协议，根据是http或者是https来往父级传送数据
        parent.postMessage(data, this.taptapSdk.PUBLIC_URL);

        */

//      var data = await sdk.syTapTapAndroidAction('tapTapShare');
        this.actionFunc("tapTapShare",undefined,that,callBack);
    }

    gotoTapTap(url:string,that?,callBack?:Function) {
        // LogSys.Log(`待壳包实现SDK...`);
        this.actionFunc("goTapTapPage",url,that,callBack);
    }

    private actionFunc(eventName:string,url?,that?,callBack?:Function)
    {
        if (this.taptapSdk && typeof this.taptapSdk.syTapTapAndroidAction == "function") {
            this.taptapSdk.syTapTapAndroidAction(eventName,url).then((data) => {
                // this.actionFunc(data,that,callBack);
                let status:boolean = false;
                switch(data.code){
                    case 0:
                        status = true;
                        break;
                    case -10:
                        // E.ViewMgr.ShowMidError(`请更新APP`);
                        LogSys.Log("请更新APP");
                        break;
                }
                if(callBack){
                    callBack.call(that,status);
                }
                LogSys.Log(eventName+":" + JSON.stringify(data) + url);
                
            });
        } else {
            LogSys.Log(`SDK syTapTapAndroidAction 接口未实现`);
        }
    }
    
    public taptapInit() {
        let _sdk = this.taptapSdk;
        LogSys.Log("taptapInit syTapTapAndroidAction...");
        if (_sdk) {
            _sdk.syTapTapAndroidAction("gameInit").then((data) => {
            });
        }
    }

    taptapTrack(eventName: string, param?) {
        let s: string = param ? JSON.stringify(param) : "";
        LogSys.Log(`taptapTrack:${eventName}${s}`);
        // this.actionFunc(eventName,param);
        let _sdk = this.taptapSdk;
        if (_sdk) {
            _sdk.syTapTapAndroidAction('tapTapSendEvent', eventName, param);
        }
    }
/*
    getAge(that:any,callBack:Function){
        if (this.taptapSdk && typeof this.taptapSdk.syTapTapAndroidAction == "function") {
            this.taptapSdk.syTapTapAndroidAction("tapTapGetAge").then((data) => {
                // this.actionFunc(data,that,callBack);
                switch(data.code){
                    case 0:
                        // status = true;
                        E.sdk.age = data.data;
                        console.log(`getAge... onAgeAngin: age:${E.sdk.age} ${JSON.stringify(data)}`);
                        break;
                    case -10:
                        // E.ViewMgr.ShowMidError(`请更新APP`);
                        // LogSys.Log("请更新APP");
                        break;
                }
                if(callBack){
                    callBack.call(that);
                }
                // LogSys.Log(eventName+":" + JSON.stringify(data) + url);
            });
        } else {
            LogSys.Log(`SDK syTapTapAndroidAction 接口未实现`);
        }
    }
*/
}