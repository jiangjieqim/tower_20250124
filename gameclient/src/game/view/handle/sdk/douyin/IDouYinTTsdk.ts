/**抖音原生接口映射 */
export interface IDouYinTTsdk{
    createInteractiveButton(params);
    getUserInfo(params);
    createRewardedVideoAd(params);
    shareAppMessage(params);
    onTouchEnd(callBack:Function);
    setClipboardData(obj);

    /**创建客服按钮 */
    createContactButton(obj);

    getStorageSync(key:string);
}

export let gameTT:IDouYinTTsdk = window["tt"];

/**盛也抖音SDK */
export interface IDouYinSySDK{
    syUploadCasualAdInfo(params);
    syGetSubscribe(params);
    /**侧边栏引导 */
    sySidebarGuide();
    syGetSidebarIconOpenStatus();
    sidebarIconInfo;
    syDescGamePayCoin(obj,popWindow?:boolean);
    setStorageSync(key, value);
}

export let ttSygame = window['Sygame'] as IDouYinSySDK;