import { stHero } from "../../../../network/protocols/BaseProto";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { HeroListLvProxy, HeroListProxy } from "../proxy/HeroProxy";
import { t_Hero_Skin } from "../proxy/t_Hero_Skin";

export class TowertMainHeroModel extends Laya.EventDispatcher{
    private static _ins: TowertMainHeroModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new TowertMainHeroModel();
        }
        return this._ins;
    }
    
    public static UPDATE_HERO:string = "UPDATE_HERO";
    public static UPDATE_UP:string = "UPDATE_UP";

    public heroList:stHero[];

    constructor(){
        super();
        this.heroList = [];
    }

    public getHeroById(id:number){
        return this.heroList.find(ele => ele.id === id);
    }

    /**化神后去掉的英雄列表 */
    public getHeroList():stHero[]{
        let arr = [];
        for(let i:number=0;i<this.heroList.length;i++){
            let cfg = HeroListProxy.Ins.getCfgById(this.heroList[i].id);
            if(cfg.f_if_transform == 0){
                arr.push(this.heroList[i]);
            }
        }
        return arr;
    }

    public getSkinIdById(id: number) {
        let skinId = 0;
        let data = this.getHeroById(id);
        if (data) {
            skinId = data.skinId;
        }
        if (skinId == 0) {
            let cfg = HeroListProxy.Ins.getCfgById(id);
            skinId = parseInt(cfg.f_skin.split("-")[0]);
        }
        return skinId;
    }

    public getImageIdById(id:number) {
        let skinId = 0;
        let data = this.getHeroById(id);
        if (data) {
            skinId = data.skinId;
        }
        if (skinId == 0) {
           return this.getDefImageIdById(id);
        }
        let cfg = t_Hero_Skin.Ins.getCfgById(skinId);
        return cfg.f_imageid;
    }

    public getDefImageIdById(id:number){
        let cfg = HeroListProxy.Ins.getCfgById(id);
        let skinId = parseInt(cfg.f_skin.split("-")[0]);
        let sCfg = t_Hero_Skin.Ins.getCfgById(skinId);
        if(!sCfg){
            console.log(">>>>>>>>skinId",skinId);
        }
        return sCfg.f_imageid;
    }

    public isHeroRedTip(){
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.Hero,false)){
            return false;
        }
        if(this.isAllHeroLv()){
            return true;
        }
        return false;
    }

    public isAllHeroLv(){
        if(!this.heroList){
            return false;
        }
        let arr = this.getHeroList();
        for(let i:number=0;i<arr.length;i++){
            if(this.isHeroLv(arr[i].id,arr[i].level)){
                return true;
            }
        }
        return false;
    }

    public isHeroLv(id:number,lv:number){
        let nextCfg = HeroListLvProxy.Ins.getNextCfgByIdAndLv(id,lv);
        if(!nextCfg){
            return false;
        }
        let cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(id,lv);
        return TowerMainModel.Ins.isItemEnoughStArr(cfg.f_consumption);
    }

    public getAttr(){
        let num = 0;
        let arr = this.getHeroList();
        for(let i:number=0;i<arr.length;i++){
            let cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(arr[i].id,arr[i].level);
            if(cfg.f_global_attribute != ""){
                num += parseInt(cfg.f_global_attribute.split(":")[1]);
            }
        }
        return num;
    }
    
    /**当前的皮肤id列表*/
    getHeroSkins(){
        let _heroSkins:number[] = [];
        let heros = this.heroList || [];
        for(let i = 0;i < heros.length;i++){
            let vo = heros[i];
            let cfg = HeroListProxy.Ins.getCfgById(vo.id);
            if(!cfg.f_if_transform && !StringUtil.IsNullOrEmpty(cfg.f_skin)){
                let skins:number[] = vo.skins;
                let defaultSkinId:number = parseInt(cfg.f_skin.split("-")[0]);
                for(let n = 0;n < skins.length;n++){
                    let cur = skins[n];
                    if(cur!=defaultSkinId){
                        if(_heroSkins.indexOf(cur)==-1){
                            _heroSkins.push(cur);
                        }
                    }
                }
            }
        }
        return _heroSkins;
    }
}