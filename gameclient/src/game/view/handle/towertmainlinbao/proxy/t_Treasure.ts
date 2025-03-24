import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Treasure extends BaseCfg{
    private static _ins:t_Treasure;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Treasure();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Treasure";
    }

    public getCfgById(id:number):Configs.t_Treasure_dat{
        return this.List.find(item => item.f_treasureid == id);
    }

    public getIcon(icon:number){
        return `o/lingbaoicon/${icon}.png`;
    }

    public getQuaSkin(qua:number){
        return `remote/linbao/qua${qua}.png`;
    }
    // get watchMaxCount(){
    //     let n:number = 0;
    //     for(let i = 0;i < this.List.length;i++){
    //         let cfg:Configs.t_Treasure_dat = this.List[i];
    //         if(cfg.f_rank){
    //             n++;
    //         }
    //     }
    //     return n;
    // }
}