// import { stItem } from "../../../../../network/protocols/BaseProto";
// import { uint64 } from "../../../../../network/protocols/uint64";
import { IconUtils } from "../../model/IconUtils";
import { ItemProxy } from "../../proxy/ItemProxy";
import { QualityUtils } from "../../vos/QualityUtils";

/* @Author: tsy
 * @Date: 2023-02-20 13:17:49
 * @Last Modified by: tsy
 * @Last Modified time: 2023-02-22 20:28:28
*/
export class GridItemVo{
    private _uid:uint64;
    private _itemID:number;
    // private _stItem:stItem;
    private _count:number;
    private _itemCfg:Configs.t_Item_dat;
    private _cheifId:number;

    public isNull:boolean;

    public get uid():uint64{
        return this._uid;
    }

    public get cheifId():number{
        return this._cheifId;
    }

    public get itemID():number{
        return this._itemID;
    }

    // public get stItem():stItem{
    //     return this._stItem;
    // }

    public get itemCfg():Configs.t_Item_dat{
        return this._itemCfg;
    }

    public get count():number{
        return this._count;
    }

    public getName():string{
        // if(this._itemCfg.f_sub_type == 4){
        //     let attr = HuYouModel.Ins.getAttr(this._uid);
        //     if(attr){
        //         let cfg = HuYouIconProxy.Ins.getCfgByIdAndAttr(this._itemID,attr.id);
        //         return cfg ? cfg.f_SoulName:""+attr.id;
        //     }
        // }else{
        return this._itemCfg.f_name;
        // }
    }

    public getQua(){
        return QualityUtils.getQuaColor(this._itemCfg.f_qua);
    }

    public getDec(){
        return  this._itemCfg.f_info;
    }

    public getIconSkin(){
        // if(this._itemCfg.f_sub_type == 4){
        //     let attr = HuYouModel.Ins.getAttr(this._uid);
        //     if(attr){
        //         let cfg = HuYouIconProxy.Ins.getCfgByIdAndAttr(this._itemID,attr.id);
        //         return cfg ? `o/bless/${cfg.f_icon}` : "remote/common/base/wh.png";
        //     }
        // }else{
        return IconUtils.getIcon(this._itemCfg.f_icon);
        // }
    }

    public init(value){
        // this._stItem = value;
        this._uid = value.uid;
        this._cheifId = value.cheifId;
        this._itemID = value.id;
        this._count = value.count;
        this._itemCfg = ItemProxy.Ins.getCfg(value.id);
    }
}