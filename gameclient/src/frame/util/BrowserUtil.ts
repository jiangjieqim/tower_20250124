import Browser = Laya.Browser;

// import {Dictionary} from "../structure/Dictionary";

/**网页相关*/
export class BrowserUtil {

    /**打开外部链接*/
    public static OpenUrl(url: string): void {
        Laya.Browser.window.location.href = url;
    }

    /**获取当前地址栏参数*/
    public static GetLocationParams(): Dictionary<string, string> {
        let url = window.location.href;
        let dic = new Dictionary<string, string>();
        let num = url.indexOf("?");
        if (num >= 0) {
            url = url.substr(num + 1);
            let key, value;
            let arr = url.split("&")
            for (let i in arr) {
                let str = arr[i];
                num = str.indexOf('=');
                key = str.substr(0, num);
                value = str.substr(num + 1);
                dic.Add(key, value);
            }
        }
        return dic;
    }

    /**在移动设备*/
    public static get IsMobile() { return Browser.onMobile; }
    /**在PC设备*/
    public static get IsPc() { return Browser.onPC; }
    // /*是否是qq小游戏*/
    // public static get IsQQMini() { return Browser.onQQMiniGame; }
    // /**是否是微信小游戏*/
    // public static get IsWXMini() { return Browser.onMiniGame; }
    /**安卓*/
    public static get IsAndroid() { return Browser.onAndroid; }
    /**苹果*/
    public static get IsIOS() { return Browser.onIOS; }
    // /**是否是微信*/
    // public static get IsWX() { return Browser.onWeiXin; }


}