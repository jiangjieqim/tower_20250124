import { BaseCfg } from "../../../../static/json/data/BaseCfg";
export class ItemProxy extends BaseCfg{
    public GetTabelName() {
        return "t_Item"
    }
    private static _ins: ItemProxy;

    public static get Ins() {
        if (!this._ins) {
            this._ins = new ItemProxy();
        }
        return this._ins;
    }

    public getCfg(itemId:number):Configs.t_Item_dat{
        return this.List.find(o=>o.f_itemid == itemId);
    }

    public getSubTypeList(subType:number){
        let itemIdList:number[] = [];
        let _l:Configs.t_Item_dat[] = this.List;
        _l.forEach(cfg=>{
            if(cfg.f_sub_type ==  subType){
                itemIdList.push(cfg.f_itemid);
            }
        });
        return itemIdList;
    }

    getByP2(id:number,subtype:number){
        let _l:Configs.t_Item_dat[] = this.List;
        let o = _l.find(o=>parseInt(o.f_p2) == id && o.f_sub_type == subtype);
        return o;
    }
    getByP1(id:number,subtype:number){
        let _l:Configs.t_Item_dat[] = this.List;
        let o = _l.find(o=>parseInt(o.f_p1) == id && o.f_sub_type == subtype);
        return o;
    }
}
export class t_IconEffect extends BaseCfg{
    public GetTabelName() {
        return "t_IconEffect";
    }
    private static _ins: t_IconEffect;

    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_IconEffect();
        }
        return this._ins;
    }
    getEffectURL(effIndex:number){
        let arr = [
            "efxinshou","eflibao","fuyuan","glow01"
        ]
        let k = arr[effIndex];
        return `o/spine/${k}/${k}`;
    }
}