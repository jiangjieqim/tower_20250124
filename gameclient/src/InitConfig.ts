import { ILoginCode } from "./game/view/handle/login/LoginViewNew";
//#region platform
export class PlatformConfig{
    /**开发 0*/
    static Dev: number = 0;
    /**微信 1*/
    static WeiXin: number = 1;
    /**公司戳爆0.1---->2 */
    static CB1: number = 2;
    /**抖音 3*/
    static DOU_YIN: number = 3;
    /**8U 4*/
    static BaU: number = 4;
    /**折心动H5 War3 魔兽 5*/
    static War3:number = 5;
    /**美团 6*/
    static MEITUAN:number = 6;
    /**微信0.1折扣 7*/
    static WEIXIN_DISCOUNT:number = 7;
    /**quick 平台 8*/
    static QUICK:number = 8;
    /**taptap 10*/
    static TAPTAP:number = 10;
}
//#endregion

/**皮肤类型 */
export enum ESkinType{
    /**三国 */
    ThreeKingdoms = 0,
    /**魔兽 */
    War3 = 1,
}
export class InitConfig {
    /**微信入口返回 */
    public static wxLoginResult:ILoginCode;
    private static asset:string;
    private static ui:string;
    /*
    "asset":"http://127.0.0.1:9001/jjq/game/resource/",
    */
    public static getAsset() { 
        if (!this.asset){
            this.asset = initConfig.asset;//window["initConfig"]["asset"];
        }
        if(Laya.Utils.getQueryString("asset")){
            return Laya.Utils.getQueryString("asset");
        }
        if(this.asset && this.asset.indexOf("http")==-1){
            return `http://${window.location.host}${this.asset}`;
        }

        return this.asset || "";
    }
    
    /**盛也后台接口 */
    public static getSyURL(){
        return initConfig.sy_url;
    }

    public static get tcp() {
        if(initConfig){
            return initConfig.tcp;
        }
    }

    public static get frameRate(){
        if (initConfig) {
            return initConfig.frameRate || "slow";//fast
        }
    }

    public static getServerIp() {
        let url:string = Laya.Utils.getQueryString("url");
        if(url){
            return "ws://"+url;
        }

        if(this.wxLoginResult){
            return this.wxLoginResult.result.tcp;
        }
    }
    public static getUI() {
        return "";
    }

    public static getUI2() {
        if (!this.ui) {
            if (this.getAsset().length > 0) {
                this.ui = this.getAsset();
            }
        }
        return this.ui || "";
    }
}
export class AnimConfig {
    private static _AnimScale:number = 1;

    public static get AnimScale(){
        return this._AnimScale;
    }
    public static set AnimScale(v:number){
        this._AnimScale = v;
    }

}