import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Friendship extends BaseCfg{
    private static _ins:t_Friendship;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Friendship();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Friendship";
    }
    
    public getCfgByNum(num):Configs.t_Friendship_dat{
        for(let i:number=this.List.length - 1 ;i >= 0;i--){
            if(num >= this.List[i].f_points){
                return this.List[i];
            }
        }
        return null;
    }
}