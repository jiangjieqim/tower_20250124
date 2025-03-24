import { BaseCfg } from "../../../../static/json/data/BaseCfg";
import { EHeroQua } from "../../compose/t_Battle_Config";
/**属性id */
export enum ETowerAttr{
    /**血量值 */
    BloodVal = 10001,
    /**攻击力 */
    Atk = 10002,
    /**攻击间隔 */
    AtkGapMs = 10008,
    /**攻击速度 */
    AtkSpeed = 20014,
    /**原攻击力加成百分比 */
    AtkPer = 20002,
}

// export enum ETowerAttrType{
// }

export class HeroListProxy extends BaseCfg{
    private static _ins:HeroListProxy;

    public static get Ins(){
        if(!this._ins){
            this._ins = new HeroListProxy();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Hero";
    }

    public getList(){
        let arr = [];
        for(let i:number=0;i<this.List.length;i++){
            if(this.List[i].f_if_transform){
                continue;
            }
            arr.push(this.List[i]);
        }
        return arr;
    }
    // /**查看英雄最大数量 */
    get maxWatchHeroCount(){
        let l:Configs.t_Hero_dat[] = this.List;
        let n:number = 0;
        for(let i = 0;i < l.length;i++){
            let cfg = l[i];
            if(!cfg.f_transform){
                n++;
            }
        }
        return n;
    }

    public getCfgById(heroId:number):Configs.t_Hero_dat{
        return this.List.find(item => item.f_heroid == heroId);
    }

    public getCfgByItemId(heroId:number):Configs.t_Hero_dat{
        return this.List.find(item => item.f_heropiece_id == heroId);
    }

    public getScaleById(heroId:number){
        let _curScale:number = 1;
        if(HeroListProxy.Ins.getCfgById(heroId).f_qua == EHeroQua.Red){
            _curScale = 1.2;
        }
        return _curScale;
    }

    /**获取属值 */
    getAttrVal(_heroCfg:Configs.t_Hero_dat,type:ETowerAttr){
        let l = _heroCfg.f_base_attribute.split("|");
        for(let i = 0;i < l.length;i++){
            let arr = l[i].split(":");
            if(parseInt(arr[0]) == type){
                return parseInt(arr[1]);
            }
        }
        return 0;
    }
    /**
     * 
     * @param id 
        1：白色品质
        2：蓝色品质
        3：紫色品质
        4：橙色品质
        5：红色品质
     */
    getQuaColor(id:number){
        let cfg = this.getCfgById(id);
        let arr:string[] = ['#FFFFFF','#0000FF','#FF00FF',"#FFAA00","#FF0000"]
        return arr[cfg.f_qua-1];
    }

    public getSmallIconSkin(imageid:number){
        return `o/smallrole/${imageid}.png`;
    }

    public getHeroBigIconSkin(imageid:number){
        return `o/bigherohead/${imageid}.png`;
    }

    public getQuaSkin(qua:number){
        return `remote/hero/qua_${qua}.png`;
    }

    public getQuaSkin1(qua:number){
        return `remote/base/qua${qua}.png`;
    }

    public getSmallQuaSkin(qua:number){
        return `remote/base/qua_s${qua}.png`;
    }
    // /**获取头像 */
    // getHeadIcon(f_headid:number){
    //     return `o/herohead/${f_headid}.png`;
    // }
    /**基础攻击间隔 */
    getAtkTime(heroId:number) {
        let heroCfg: Configs.t_Hero_dat = this.getCfgById(heroId);
        let atkTime = 1000 / this.getAttrVal(heroCfg, ETowerAttr.AtkGapMs);
        return atkTime;
    }

    /**查看最大皮肤数量 */
    get maxWacthSkinCount(){
        let n:number = 0;
        let l:Configs.t_Hero_dat[] = this.List;
        for(let i = 0;i < l.length;i++){
            let cfg = l[i];
            if(!cfg.f_if_transform && !StringUtil.IsNullOrEmpty(cfg.f_skin)){
                let skins:string[] = cfg.f_skin.split("-");
                let count:number = skins.length-1;
                n+=Math.max(0,count);
            }
        }
        return n;
    }
}

export class HeroListLvProxy extends BaseCfg{
    private static _ins:HeroListLvProxy;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new HeroListLvProxy();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Hero_upgrade";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let id = this.List[i].f_heroid;
            if(!this._map[id]){
               this._map[id] = [];
            }
            this._map[id].push(this.List[i]);
        }
    }

    public getCfgByIdAndLv(id:number,lv:number):Configs.t_Hero_upgrade_dat{
        return this.List.find(item => item.f_heroid == id && item.f_herolevel == lv);
    }

    public getNextCfgByIdAndLv(id:number,lv:number):Configs.t_Hero_upgrade_dat{
        return this.List.find(item => item.f_heroid == id && item.f_herolevel == (lv + 1));
    }

    public getListById(id:number){
        return this._map[id];
    }

    public getSpeedNum(id:number,lv:number):number{
        let arr = this.getListById(id);
        let num = 0;
        for(let i:number=0;i<arr.length;i++){
            if(lv >= arr[i].f_herolevel){
                num += arr[i].f_attack_speed;
            }
        }
        return num;
    }
}