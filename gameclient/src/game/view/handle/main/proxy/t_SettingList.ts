import { BaseCfg } from "../../../../static/json/data/BaseCfg";
import { MainModel } from "../model/MainModel";
/**
 * 1 代表放在外部 2代表放入内部
 */
export enum ESettingType{
    OutSide = 1,
    InSide = 2,
}
/*
export class t_SettingList extends BaseCfg{
    public GetTabelName(): string {
        return "t_SettingList";
    }
    private static _ins: t_SettingList;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_SettingList();
        }
        return this._ins;
    }

    getByType(type:ESettingType){
        let res:Configs.t_SettingList_dat[] = [];
        let l:Configs.t_SettingList_dat[] = this.List;
        for(let i = 0;i < l.length;i++){
            let cfg = l[i];
            if(cfg[this.typeKey] == type){
                res.push(cfg);
            }
        }
        res = res.sort((a,b)=>{
            if(a.f_sort < b.f_sort){
                return -1;
            }
            else if(a.f_sort > b.f_sort){
                return 1;
            }
            else{
                return 0;
            }
        });
        return res;
    }

    private get typeKey(){
        return MainModel.Ins.realVerify ? "f_type_review" : "f_type";
    }
}
*/