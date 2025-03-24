import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";

export class AssetConfig{
    /**spine优化配置 释放插槽中的纹理数据 */
    static freeSlot: boolean = true;

    /**使用资源释放 */
    static enableClearTex:boolean = true;

    /**关闭界面的时候自动释放UI的图集 */
    static enableFreeUIatlas:boolean = true;
    //==============================================================
    static mainList:string[] = [];
    static clearTextureRes(url:string){
        if (this.enableClearTex) {
            if (E.ViewMgr) {
                if (E.ViewMgr.isOpenReg(EViewType.Main)) {
                    if (this.mainList.indexOf(url) == -1) {
                        this.mainList.push(url);
                    }
                    return;
                }
            }

            Laya.Loader.clearTextureRes(url);
        }
    }

    static get bg(){
        if(initConfig.disable_bg){
            return "";
        }
        return "static/bg.jpg";
    }
}