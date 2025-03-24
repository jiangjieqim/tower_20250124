import { BaseCfg } from "../../../static/json/data/BaseCfg";

export class t_Monster_Template extends BaseCfg{
    public GetTabelName(): string {
        return "t_Monster_Template";
    }
    private static _ins: t_Monster_Template;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Monster_Template();
        }
        return this._ins;
    }
    getMonsterTemplate(templateId:number):Configs.t_Monster_Template_dat{
        // f_monster_template_id
        let l:Configs.t_Monster_Template_dat[] = this.List;
        return l.find(o=>o.f_monster_template_id == templateId);
    }
}

/**怪物配置接口 */
export interface It_MonsterCfg{
    getCfgMonsterid(f_monsterid:number):Configs.t_Monster_dat;
    getMonsterAttrVal(monsterId:number,attrId:number);
    getHeadIcon(f_monsterid:number);
    getTempCfg(f_monsterid:number):Configs.t_Monster_Template_dat;
    getTempSpeed(monsterId:number);
}

// export class t_Monster implements It_MonsterCfg{
//     private static _ins: t_Monster;
//     public static get Ins() {
//         if (!this._ins) {
//             this._ins = new t_Monster();
//         }
//         return this._ins;
//     }
// }


/**PVP怪物配置表 */
export class t_MonsterPvp extends BaseCfg implements It_MonsterCfg{
    public GetTabelName(): string {
        return t_MonsterPvp.NAME;
    }
    static NAME:string = "t_Monster";

    // private static _ins: t_MonsterPvp;
    // public static get Ins() {
    //     if (!this._ins) {
    //         this._ins = new t_MonsterPvp();
    //     }
    //     return this._ins;
    // }
    getCfgMonsterid(f_monsterid:number){
        if(initConfig.debug_monsterId)  {
            f_monsterid = initConfig.debug_monsterId;
        }
        let l:Configs.t_Monster_dat[] = this.List; 
        let cfg = l.find(o=>o.f_monsterid == f_monsterid);
        return cfg;
    }

    /**获取怪物的属性值 */
    getMonsterAttrVal(monsterId:number,attrId:number){
        let cfg = this.getCfgMonsterid(monsterId);
        if(cfg){
            let arr = cfg.f_monster_attribute.split("|");
            for(let i = 0;i < arr.length;i++){
                let o = arr[i];
                let a = o.split(":");
                if(parseInt(a[0]) == attrId){
                    return parseInt(a[1]);
                }
            }
        }
        return 0;
    }

    /**获取boss头像 */
    getHeadIcon(f_monsterid:number){
        let tempCfg = this.getTempCfg(f_monsterid);
        return `o/monsterhead/${tempCfg.f_headid}.png`;
    }
    /**怪物模块配置 */
    getTempCfg(f_monsterid:number){
        let l:Configs.t_Monster_dat[] = this.List; 
        let cfg = l.find(o=>o.f_monsterid == f_monsterid);
        if(cfg){
            let tempCfg = t_Monster_Template.Ins.getMonsterTemplate(cfg.f_monster_template_id);
            return tempCfg;
        }
    }

    /**获取怪物模板速度 */
    getTempSpeed(monsterId:number){
        let _monsterCfg = this.getCfgMonsterid(monsterId);
        let _monsterTempCfg = t_Monster_Template.Ins.getMonsterTemplate(_monsterCfg.f_monster_template_id);
        let _speed:number = parseInt(_monsterTempCfg.f_10003.split(":")[1]);
        if(Laya.Utils.getQueryString("walkspeed")){
            return parseInt(Laya.Utils.getQueryString("walkspeed"));
        }
        return _speed;
    }
}

/**PVE合作战配置 */
export class t_Monster_Coop extends t_MonsterPvp{
    static NAME:string = "t_Monster_Coop";

    public GetTabelName(): string {
        return t_Monster_Coop.NAME;
    }
}