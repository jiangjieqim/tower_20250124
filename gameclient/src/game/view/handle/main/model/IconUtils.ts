import { E } from "../../../../G";
import { stHero } from "../../../../network/protocols/BaseProto";
import { EHeroQua } from "../../compose/t_Battle_Config";
import { ItemProxy } from "../../main/proxy/ItemProxy";
import { ESub_type } from "../../main/vos/ItemVo";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";

export class IconUtils{
    // public static readonly EmptyBg:string = "remote/common/base/jiangli.png";//默认背景
    public static readonly DefaultRedImg:string = "o/q.png";
    public static readonly Empty:string = "empty";
    public static readonly effect:string = `o/spine/effect2/effect2`;//特效
    public static readonly plusAtlasPrefix:string = `remote/main/main/z`;//战斗数字
    public static readonly dldAtlasPrefix:string = `remote/daluandou/ls_`;//大乱斗数字
    public static readonly afAtlasPrefix:string = `remote/allianceFight/a`;//联盟战
    public static readonly DefaultEmpty:string = "remote/main/main/zhuangbeikuang_1.png";//默认品质
    public static readonly Bg:string = `remote/common/base/shuxingkuang.png`;
    public static readonly numAtlasPrefix:string = `remote/num/k_`;//数字
    public static readonly fulleffect:string = `o/spine/boxstage/boxstage`;//全屏特效
    public static readonly defaultIcon:string = "remote/common/base/jiangli1.png";
    public static readonly eflibao:string = "o/spine/eflibao/eflibao";
    public static getRankNumImg(i:number){
        return `remote/jjc/dfjjc_mc${i}.png`;
    }
    
    /**坐骑id */
    public static getHorseIcon(id:number){
        // return `o/horse/${id}.png`;
        return E.gameAdapter.getMountIcon(id);
    }
    public static getQuaIcon(qua:number){
        qua = qua || 0;
        if(qua == 0){
            return `remote/base/quaIcon_1.png`;
        }
       return `remote/base/quaIcon_${qua}.png`;
    }

    public static getIcon(icon:string|number){
        // if(typeof icon == "string"){
        //     if(icon.indexOf("|")!=-1){
        //         let arr = icon.split("|");
        //         return `o/icon/${arr[main.skinStyle - 1]}.png`;
        //     }
        // }
        return `o/itemicon/${icon}.png`;
        // return this.getIconByCfgId(itemid);
    }

    public static getNameByID(itemID:number){
        let _cfg = ItemProxy.Ins.getCfg(itemID);
        if(_cfg){
            return _cfg.f_name;
        }
        return "";
    }

    public static convert(_cfg:Configs.t_Item_dat){
        if(_cfg.f_sub_type == ESub_type.EquipSwitch){
            // let arr = _cfg.f_p1.split("|");
            // return ItemViewFactory.getEquipIcon(parseInt(arr[0]),parseInt(arr[1]));
            return "";
        }
        // else if(_cfg.f_sub_type == ESub_type.Pet){
        //     let petcfg = PetListProxy.Ins.getCfgById(parseInt( _cfg.f_p1));
        //     return PetListProxy.Ins.getPetIconById(petcfg.f_petid);
        // }
    }

    public static getIconByCfgId(_itemId:number){
        let _cfg:Configs.t_Item_dat = ItemProxy.Ins.getCfg(_itemId);
        if(_cfg){
            let icon:string = _cfg.f_icon;
            let icon1 = this.convert(_cfg);
            if(icon1){
                return icon1;
            }else if(icon == ""){
                icon = _itemId.toString();
            }
             return this.getIcon(icon);
            // return `o/icon/${icon}.png`;
        }
        return "";
    }
    public static str2Lv(lv:number){
        return "Lv." + lv;
    }

    static getCollectSkin(vo:stHero,empty:boolean = false) {
        if(HeroListProxy.Ins.getCfgById(vo.id).f_qua == EHeroQua.Red){
            let collect: number = vo.collect;
            if (collect <= 0) {
                if (empty) {
                    return "";
                } else {
                    return `remote/base/img_wsc_yx.png`;
                }
            } else {
                return `remote/base/img_sc_yx.png`;
            }
        }
        return "";
    }
}