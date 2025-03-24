import { IMSpineRegions, ISpineTempletTower } from "./ISpineTemplet";
/*
SpineTemplet_3_x laya.spine.js line 643

+-----------------------------------------------------+
| SpineTemplet_3_x : SpineTempletBase : Laya.Resource |
+-----------------------------------------------------+

+-----------------------------+
| SpineGLTexture: Laya.Texture|
+-----------------------------+

*/
export class SpineTempletTower_3x extends Laya.SpineTemplet_3_x implements ISpineTempletTower{
    tex: Laya.SpineGLTexture;
    setSkin(fileList: IMSpineRegions[], sourceUrl: string, part: string, callBack?: Handler) {
        // throw new Error("Method not implemented.");
        LogSys.Error(`未实现setSkin`);
    }

    jsonOrSkelUrl:string;

    parseSpineAni() {
        let atlas = this.assetManager.get(this.atlasUrl);
        if(!atlas){
            return;
        }
        super.parseSpineAni();
    }
}


