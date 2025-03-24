// import { DebugUtil } from "../../../../frame/util/DebugUtil";
import { PlatformConfig } from "../../../../InitConfig";
import { E } from "../../../G";
import { gameTT } from "./douyin/IDouyinTTsdk";
import { meituan } from "./IMeiTuan";
import { ISizePos, IUserInfo } from "./ISdk";

export interface ISdkBaseButton{
    show();
    hide();
    destroy();
}
function maskImgURL()
{
    return initConfig.debug ? "./mask_alpha.png":"./empty.png";
}


class NormalBtn extends Laya.Sprite{
    show(){
        this.visible = true;
    }
    hide(){
        this.visible = false;
    }
}
class BaseButton{
	/**错误日志*/
    errMsg:string;
    protected btnAuthorize:NormalBtn;
    protected _isShow:boolean = false;
    protected that;
    protected func:Function;
    constructor(){

    }
 
    hide(){
        this._isShow = false;
        // this.btnAuthorize.visible = false;
        // if(this.btnAuthorize){
        //     this.btnAuthorize.destroy();
        // }
        if(this.btnAuthorize){
            if(typeof this.btnAuthorize.hide == "function"){
                this.btnAuthorize.hide();
            }
        }
    }

    protected initSimpleBtn(o:ISizePos,that?,func?:Function){
        this.that = that;
        this.func = func;
        let btn = new NormalBtn();
        btn.width = o.w;
        btn.height = o.h;
        btn.x = o.x;
        btn.y = o.y;
        btn.hitArea = new Laya.Rectangle(0,0,o.w,o.h);
        btn.on(Laya.Event.CLICK,this,this.onClickHandler);
        DebugUtil.draw(btn,"#0000ff",null,null,null,null,true);
        Laya.stage.addChild(btn);
        this.btnAuthorize = btn;
        return btn;
    }

    protected onClickHandler(){
        if(this.func){
            this.func.call(this.that);
        }
        E.ViewMgr.ShowMidError(this.errMsg||"app原生按钮");
    }
    show(){
        this._isShow = true;
        this.btnAuthorize && this.btnAuthorize.show();
    }

    destroy(){
        this._isShow = false;
        this.btnAuthorize && this.btnAuthorize.destroy();
    }
}

//#region 测试开发按钮
class DevButton extends BaseButton implements ISdkBaseButton{
    constructor(o:ISizePos,that?,func?:Function){
        super();
        o = SdkButtonMgr.replaceBack(o);
        this.initSimpleBtn(o,that,func);
    }
}
/**美团创建用户信息按钮 */
class MeiTuanGetInfoButton extends DevButton implements ISdkBaseButton{
    constructor(o:ISizePos,that?,func?:Function){
        super(o,that,func);
    }
    protected onClickHandler() {
        if (typeof meituan != "undefined") {
            let cur = this;
            meituan.getUserInfo({
                withCredentials: true,//返回敏感数据
                success(res:IUserInfo) {
                    if (res) {
                        // console.log("===============>" + JSON.stringify(res));
                        if(res){
                            cur.func.call(cur.that,res);
                        }
                    }
                },
                fail(res) {
                    console.log(`getUserInfo 调用失败` + JSON.stringify(res));
                },
            });
        }

    }
}

//#endregion
//#region 微信按钮
/**创建一个平台相关的按钮 */
class WxSdkButton extends BaseButton implements ISdkBaseButton{
    constructor(o:ISizePos,that,func:Function){
        super();
        //微信接口
        let btnAuthorize = wx.createUserInfoButton({
            type: "text",
            text: initConfig.debug ? "微信按钮":"",
            // type: "image",
            // image: maskImgURL(),        // game.maskImgURL,  
            style: {
                left: o.x,
                top: o.y,
                width: o.w,
                height: o.h,
                lineHeight: 0,
                backgroundColor: "",//透明
                color: "#ff0000",
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4,
            },
        });
        btnAuthorize.onTap((res) => {
            if(res){
                func.call(that,res.userInfo);
            }
        });

        this.btnAuthorize = btnAuthorize;
    }

    
}
//#endregion
/**抖音基础按钮 */
class DouYinButton  extends BaseButton implements ISdkBaseButton{
    constructor(o:ISizePos,that,func:Function){
        super();
        this.that = that;
        this.func = func;
        let curThat = this;
        let t = 1;//Laya.Browser.clientWidth / Laya.stage.width;
        let params = {
            // type: "text",//"image",
            type: "image",
            image: maskImgURL(),        // game.maskImgURL,    
            // text: "aa",
            style: {
                left: o.x * t,
                top: o.y * t,
                width: o.w * t,
                height: o.h * t,
                // textColor: "#ffffffff",
                borderColor: "#ffffff00",
                backgroundColor: "#ffffff00", //透明
                borderRadius: 0,
                borderWidth: 0
            },
            success(button) {
                // complete.runWith(button);
                function button_tap(res) {
                    // func.call(that,res);
                    curThat.clickRun();
                }
                if(typeof button.onTap == "function"){
                    button.onTap(button_tap);
                }
                curThat.btnAuthorize = button;
                curThat.updateView();
            },
            fail(res) {
                console.log("创建失败", res.errMsg);
            },
        };
        this.createBtn(params);
    }

    protected createBtn(params){
        gameTT.createInteractiveButton(params);
    }

    /**点击回调 */
    protected clickRun(){
        
    }

    private updateView(){
        if(this._isShow){
            this.show();
        }else{
            this.hide();
        }
    }
}

/**获取人物信息 */
class DouYinUserInfo extends DouYinButton{
    protected clickRun(){
        let curThat = this;

        // 
        gameTT.getUserInfo({ 
            withCredentials: true,//返回敏感数据
            success(res) {
            //   console.log(`getUserInfo 调用成功 ${res.userInfo}`);
                if(res){
                    curThat.func.call(curThat.that,res.userInfo);
                }
            },
            fail(res) {
              console.log(`getUserInfo 调用失败`);
            },
          });
          
    }

}

export class SdkButtonMgr {
    /**创建人物信息按钮 用于设置头像 */
    static createUserInfoButton(o: ISizePos, that, func: Function):ISdkBaseButton {
        let platform = E.get_SDK_platform();
        switch (platform) {
            case PlatformConfig.WeiXin:
            case PlatformConfig.WEIXIN_DISCOUNT:   
                return new WxSdkButton(o, that, func);
            case PlatformConfig.Dev:
                return new DevButton(o, that, func);
            case PlatformConfig.DOU_YIN:
                return new DouYinUserInfo(o, that, func);
            case PlatformConfig.MEITUAN:
                return new MeiTuanGetInfoButton(o,that,func);
            default:
                return new DevButton(o, that, func);
        }
    }

    /**客服按钮 */
    static createClientButton(o: ISizePos, that?, func?: Function):ISdkBaseButton{
        let platform = E.get_SDK_platform();
        switch (platform) {
            case PlatformConfig.DOU_YIN:
                return new TTDouYinClientButton(o, that, func);
            default:
                let btn = new DevButton(o);
                btn.errMsg = `原生按钮 createContactButton is not support!`;
                return btn;
        }
    }

    static replaceBack(o:ISizePos){
        let w:number;
        if(typeof wx!="undefined"){
            let info = wx.getSystemInfoSync();
            w = info.screenWidth;
        }
        else{
            w = Laya.stage.width;
        }
        let percent = w / Laya.stage.width;
        o.x/=percent;
        o.y/=percent;
        o.w/=percent;
        o.h/=percent;
        return o;
    }

    /**创建朋友圈按钮 */
    static createGameClub(o:ISizePos,openLink?){
        let funcName = "createGameClubButton";
        if(typeof wx[funcName] == "undefined"){
            let btn = new DevButton(o);
            btn.errMsg = `${funcName} is not support!`;
            return btn;
        }else{
            let btn = wx[funcName]({
                // icon: 'green',
                hasRedDot:false,
                image: "empty.png",
                style: {
                    left: o.x,
                    top:  o.y,
                    width: o.w,
                    height: o.h,
                    // backgroundColor:"",//透明
                    // color:"#ffffff",
                },
                // openlink: openLink
            });
            return btn;
        }
    }
}

/**抖音客服按钮 */
export class TTDouYinClientButton extends DouYinButton{
    protected createBtn(params){
        this.btnAuthorize = gameTT.createContactButton(params);
        // console.warn("TTDouYinClientButton createBtn...",this.btnAuthorize);
    }
}