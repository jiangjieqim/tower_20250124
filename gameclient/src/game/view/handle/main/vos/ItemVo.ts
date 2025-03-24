import { EMsgBoxType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { IconUtils } from "../model/IconUtils";
import { ItemProxy } from "../proxy/ItemProxy";
/** t_Item小类型*/
export enum ESub_type {

    // 神话英雄碎片
    HeroPiece =1,


    // 1货币类型
    // 2羽毛类型
    // 3加速券
    // 4福佑类型
    // 5神石加速券类型
    // 6信物
    // 7源石
    // 8武馆邀请函
    // 9宝石

    // 10戳爆坐骑
    CB_Mount = 10,

    /** 11激活换装：部位换装id,领取后触发 2|58 --->部位id|样式 参考结构体stStyle*/
    EquipSwitch = 11,

    /**随机箱子 */
    RandomGemBox = 13,

    /**宠物 */
    Pet = 15,

    /**用户客户端特效的 */
    ClientEffect = 16,

    /**坐骑 */
    Mount = 17,
}



export class ItemVo{
    private _cfg:Configs.t_Item_dat;
    /**t_item中的 */
    private _cfgId:number = 0;
    public count:number;
    public toString(){
        return `${this.cfgId}-${this.count}`;
    }
    constructor(){
    
    }

    clone(){
        let item = new ItemVo();
        item.cfgId = this.cfgId;
        item.count = this.count;
        return item;
    }
    // public get cntName(){
    //     return `${this.count}${this.getName()}`;
    // }
    public get cfg() {
        if (!this._cfg) {
            this._cfg = ItemProxy.Ins.getCfg(this._cfgId);
            if (!this._cfg) {
                E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, "t_Item配置不存在id:" + this._cfgId);
                // console.error("t_Item配置不存在id:" + this._cfgId);
            }
        }
        return this._cfg;
    }

    public set cfgId(id:number){
        this._cfgId = id;
    }

    public get cfgId(){
        return this._cfgId;
    }

    public getIcon(){
        let _cfg = this.cfg;

        if(!_cfg){
            return "";
        }
        let icon = IconUtils.convert(_cfg);

        if(icon){
            return icon;
        }
        if(_cfg.f_icon == ""){
            E.ViewMgr.ShowDebugError(`table t_Item f_itemid:${this._cfgId} 's f_icon is empty!`);
        }
        if(_cfg.f_icon == ""){
            return "";
        }
        return IconUtils.getIcon(_cfg.f_icon);
    }

    public getDesc(){
        return this.cfg.f_info;
    }

    public getName(){
        return this.cfg.f_name;
    }

    public quaIcon(){
        if(!this.cfg){
            return IconUtils.DefaultEmpty;
        }
        // if(this._cfg.f_sub_type == ESub_type.Pet){
        //     let petcfg = PetListProxy.Ins.getCfgById(parseInt( this._cfg.f_p1));
        //     IconUtils.getQuaIcon(petcfg.f_petquality);
        // }
        // return QualityUtils.getQuaColor(this.cfg.f_qua);
        return IconUtils.getQuaIcon(this.cfg.f_qua);
    }
}