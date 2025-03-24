import { SpineTemplet_3_8_v1 } from "../SpineTemplet_3_8_v1";
import { ISpineTempletTower } from "./ISpineTemplet";
import { ESpineTemplateType } from "./SpineTemplateCache";
// import { SpineTempletTower } from "./SpineTempletTower";
import { SpineTempletTower_3x } from "./SpineTempletTower_3x";

export class SpineFactory{

    static createByType(_clsType:ESpineTemplateType):ISpineTempletTower{
        let _templet:ISpineTempletTower;
        switch(_clsType){
            case ESpineTemplateType.Normal:
                _templet = new SpineTempletTower_3x();
                // _templet = new Laya.SpineTemplet(Laya.SpineVersion.v3_8) as any;
                break;
            case ESpineTemplateType.Ver_3_8:
                // _templet = new SpineTemplet_3_8_v1();
                _templet = new SpineTempletTower_3x();
                break;
        }
        return _templet;
    }

}