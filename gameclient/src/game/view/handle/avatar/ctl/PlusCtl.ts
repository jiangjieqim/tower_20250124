import { E } from "../../../../G";
import { IconUtils } from "../../main/model/IconUtils";
import { FontClipCtl } from "./FontClipCtl";

export class PlusCtl extends FontClipCtl{
    constructor(){
        super(IconUtils.plusAtlasPrefix);
        this.mScale = 0.7;
        this.offsetX = E.gameAdapter.fontOffsetX;
    }
    public setPlus(container:Laya.Sprite,v:number){
        let v1 =  StringUtil.val2Atlas(v);
        this.setValue(container,v1);
    }
}