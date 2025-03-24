import { E } from "../../../../G";
import { IconUtils } from "../../main/model/IconUtils";
import { FontClipCtl } from "./FontClipCtl";

export class FontCtlFactory{
    public static get OffsetX(){
        return E.gameAdapter.fontOffsetX;
    }

    public static createMainPlus(){
        let ctl:FontClipCtl = new FontClipCtl(IconUtils.plusAtlasPrefix);
        ctl.offsetX = this.OffsetX;
        ctl.mScale = parseFloat(E.getLang("fontScale"));//E.gameAdapter.fontScale;
        return ctl;
    }
    /**普通战斗力 */
    public static createPlus(mScale:number = 0.7){
        let ctl:FontClipCtl = new FontClipCtl(IconUtils.plusAtlasPrefix);
        ctl.offsetX = this.OffsetX;
        ctl.mScale = mScale;
        return ctl;
    }
}