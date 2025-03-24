import { E } from "../../../../G";
import { MainEvent } from "../../main/model/MainEvent";
import { MainModel } from "../../main/model/MainModel";
import { WeiXinSDK } from "../../weixin/WeiXinSDK";
import { gameTT, ttSygame } from "./IDouyinTTsdk";
import { SubscribeID, SubscribeModel } from "./SubscribeModel";
import { t_Douyin } from "./t_Douyin";
/**
 * 适配sysdk-wxapp.js中的game.sendTA(...)
 */
class DouyinGame{
    public sendTA(eventName:string,value){
        E.sendTrack(eventName,value);
    }
}
window["game"] = new DouyinGame();
////////////////////////////////////////////////////////
//侧边栏:{"iconShowStatus":1,"allowGetReward":0}
// interface ISidebarIconOption{
//     /**1从侧边栏进入的 */
//     allowGetReward:number;
// }

// window['savePay'] = function (key,value){
//     if(typeof ttSygame.setStorageSync != "undefined"){
//         ttSygame.setStorageSync(key, value);
//     }
// }


/**抖音SDK */
export class DouYinSDK extends WeiXinSDK{

    get isFromSidebarCard(){
        return ttSygame.sidebarIconInfo && ttSygame.sidebarIconInfo.allowGetReward == 1;
    }

    // private siderData:ISidebarIconOption;
    init(){
        LogSys.Log("DouYinSDK init...");
        super.init();
        gameTT.onTouchEnd(this.onTouchEnd);
    }
    /**获取侧边栏的状态 */
    private getSiderInfo(){
        /*
        // LogSys.Log("getSiderInfo openid:",this.getOpenId());
        ttSygame.syGetSidebarIconOpenStatus().then((res:ISidebarIconOption)=>{
            this.siderData = res;

            //test 
            // this.siderData.allowGetReward = 1;

            LogSys.Log("侧边栏信息:"+JSON.stringify(res) + ",是否从侧边栏进入的" +this.isFromSidebarCard);
        });
        */
    }

    /**是否从侧边栏进入的 */
    // get isFromSidebarCard():boolean{
    // return this.siderData && this.siderData.allowGetReward == 1;
    // return initConfig.sider == 1;
    // }

    loginCallBack(){
        this.getSiderInfo();
        // console.log( `your openid is [${this.getOpenId()}]`);
        if(typeof gameTT.getStorageSync == "function"){
            let syGamePayPayCache = gameTT.getStorageSync("tt"+this.getOpenId());
            let obj;
            if(syGamePayPayCache){
                obj = JSON.parse(syGamePayPayCache);
                ttSygame.syDescGamePayCoin(obj,false);
            }
            console.log(`use cache`,obj);
        }
    }
    private convertPos(obj):Laya.Point{
        let pos:Laya.Point;
        if(obj.changedTouches && obj.changedTouches.length > 0){
            let o = obj.changedTouches[0];
            pos = new Laya.Point(Math.round(o.clientX),Math.round(o.clientY));
        }
        return pos;
    }
    private onSiderTouchEnd(obj){
        //console.log("onTouchStart "+JSON.stringify(obj))
        let pos = this.convertPos(obj);
        let curId = SubscribeID.SIDER_POS;
        if (pos) {
            let _signMouseUp = SubscribeModel.Ins.getByID(curId);
            if (_signMouseUp && _signMouseUp.x == pos.x && _signMouseUp.y == pos.y) {
                ttSygame.sySidebarGuide();
                //console.log("onTouchStart触发 验证成功:" + curId);
            }
        }
    }

    /**头条弹起按钮操作 */
    private onTouchEnd(obj){
        let sdk:DouYinSDK = E.sdk as DouYinSDK;
        sdk.onSiderTouchEnd(obj);
    }
    
    /**
     * 拉起订阅消息
     * @param templates 模版ID 必填，最多⼀次请求三个模版ID
     */
    public getSubscribe(templates: string[]) {
        ttSygame.syGetSubscribe(templates).then((res) => {
            LogSys.Log("getSubscribe==========>"+JSON.stringify(res));
        });
        
    }

    /* 激励视频奖励
    0   ⽤户未看完取消
    1   ⽤户看完⼴告
    2   拉取⼴告错误
    */
    protected sdkWatchCVideo(callback){
        // this.showRewordVideo(callback);
        let _adunitid = initConfig.adunitid;
        if (!_adunitid) {
            console.log('缺少激励视频id');
            if (callback) callback(2);
            return false;
        }
        const adUnitId = _adunitid;
        const videoAd = gameTT.createRewardedVideoAd({ adUnitId });
        videoAd.onError(err => {
            console.log('showRewordVideo err: ', err);
            if (callback) callback(2);
        });
        try {
            if (videoAd.closeHandler) {
                videoAd.offClose(videoAd.closeHandler);
            }
        } catch (e) {
            console.log('videoAd.offClose error')
        }
        videoAd.closeHandler = function (res) {
            if (!videoAd) return;
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                LogSys.Log("sdkWatchCVideo finished...");
                // 播放完成
                if (callback) callback(1);

                ttSygame.syUploadCasualAdInfo({
                    "position": 1, // 必填，int，⼴告位，1为激励，2为banner
                    "task": "" // 必填，string，展示场景名称，若⽆展示场景请传空字符串
                });  

            } else {
                LogSys.Log("sdkWatchCVideo not play end,and exit...");
                // 播放中途退出
                if (callback) callback(0);
            }
            videoAd.offClose();
        }
        videoAd.onClose(videoAd.closeHandler);
        videoAd.show().catch(() => {
            // 失败重试
            videoAd.load().then(() => videoAd.show());
        });
    }

    /*
    goShare(t) {
        let e = Math.floor(Math.random() * this.conf.shareTitle.length);
        tt.shareAppMessage({
            title: this.conf.shareTitle[e],
            imageUrl: this.conf.cloudStorage + this.conf.shareImageUrl[e],
            query: `roomId=${F.I.roomId}&_id=${F.I._id}`,
            success(...t) {},
            fail(...t) {}
        }), Laya.timer.once(1500, this, () => {
            t();
        });
    }
    */
    /**
     * 测试模板id 295u3muwoi04478ib2 625q9sejp9532f35ih
     */
   goShareData(shareQueryParam:string){
       let templateId:string =  t_Douyin.Ins.getValStr(1);
       LogSys.Log("share templateId is " + templateId);
       gameTT.shareAppMessage({
           templateId: templateId, // 替换成通过审核的分享ID
           query: `${shareQueryParam}`,
           success() {
               console.log("分享成功");
               MainModel.Ins.event(MainEvent.ShareSuccess);
           },
           fail(e) {
               console.log("分享失败",e);
           },
       });
/*
        gameTT.shareAppMessage({
            title: "分享1",
            desc: "测试描述1",
            imageUrl: "http://fx-rs.zamerp.com.cn/uploads/boxSupport/8e9f772a8595f7a7ed306f60fe09acc3.png",
            query: `${shareQueryParam}`,//`roomId=${F.I.roomId}&_id=${F.I._id}`,
            success(...t) {
                console.log("分享成功",t);
            },
            fail(...t) {
                console.log("分享失败",t);
            }
        });
*/
    }
    // protected deskSceneIDs:string[]=["021020", "061020","101020","011020"];
}