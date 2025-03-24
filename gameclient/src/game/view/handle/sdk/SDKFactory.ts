import { cb1SDK } from "./cb1SDK/cb1SDK";
import { Y1Y_TapTapSdk } from "./taptap/Y1Y_TapTapSdk";
/**SDK简单工厂类 */
export class SDKFactory {
    /** 公司壳包SDK*/
    static createY1YSDK(): cb1SDK {
        let sdk = new cb1SDK();
        let _sdk: cb1SDK = sdk as any;
        _sdk.curAppId = initConfig.appid;
        _sdk.curChannelId = initConfig.channel_id;
        _sdk.curDiscountRatio = initConfig.discount_ratio;
        return _sdk;
    }

    /**公司taptap壳包 */
    static createTapTapY1ySDK(){
        let sdk = new Y1Y_TapTapSdk();
        let _sdk: Y1Y_TapTapSdk = sdk as any;
        _sdk.curAppId = initConfig.appid;
        _sdk.curChannelId = initConfig.channel_id;
        // _sdk.curDiscountRatio = 1;
        return _sdk;
    }
}