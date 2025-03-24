// import { SimpleEffect } from "../../avatar/SimpleEffect";

// export class IconEffectCtl {
//     private eff: SimpleEffect;

//     private set_effect(skin: Laya.Sprite, cfg: Configs.t_Item_dat) {
//         this.dispose();
//         let f_iconeffect = cfg.f_iconeffect;
        
//         if(Laya.Utils.getQueryString("debug_iconeffcet")){f_iconeffect = "4";}

//         if (f_iconeffect) {
//             /*
//             let iconcfg: Configs.t_IconEffect_dat = t_IconEffect.Ins.GetDataById(parseInt(f_iconeffect));
//             let url = t_IconEffect.Ins.getEffectURL(iconcfg.f_effectgroup);
//             this.eff = new SimpleEffect(skin, url, skin.width / 2, skin.height / 2);
//             this.eff.play(iconcfg.f_effectid, true);
//             */
//         }
//     }
//     dispose() {
//         if (this.eff) {
//             this.eff.dispose();
//             this.eff = null;
//         }
//     }

//     refreshData(skin:Laya.Sprite,_cfg: any) {
//         let itemCfg;
//         // if (typeof _cfg.f_MountID == "number") {
//         //     //坐骑
//         //     let mountCfg:Configs.t_Mount_List_dat = _cfg;
//         //     itemCfg = ItemProxy.Ins.getByP2(mountCfg.f_MountID, ESub_type.Mount);
           
//         // }
//         // else if( typeof _cfg.f_petid == "number"){
//         //     //宠物
//         //     let petCfg:Configs.t_Pet_List_dat = _cfg;
//         //     itemCfg = ItemProxy.Ins.getByP1(petCfg.f_petid, ESub_type.Pet);
//         // }
//         // else 
//         if(typeof _cfg.f_itemid == "number"){
//             itemCfg = _cfg;
//         }
//         if(itemCfg){
//             this.set_effect(skin,itemCfg);
//         }
//     }
// }