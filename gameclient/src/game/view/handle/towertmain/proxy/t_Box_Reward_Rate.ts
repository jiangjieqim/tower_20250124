import { BaseCfg } from "../../../../static/json/data/BaseCfg";
import { ECellType } from "../../main/vos/ECellType";

export class t_Box_Reward_Rate extends BaseCfg{
    private static _ins:t_Box_Reward_Rate;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Box_Reward_Rate();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Box_Reward_Rate";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let id = this.List[i].f_box_id;
            if(!this._map[id]){
               this._map[id] = [];
            }
            this._map[id].push(this.List[i]);
        }
    }

    public getStById(id:number,type:number){
        let arr = this._map[id];
        let st;
        let min = 0;
        let max = 0;
        for(let i:number=0;i<arr.length;i++){
            let cfg:Configs.t_Box_Reward_Rate_dat = arr[i];
            let a = cfg.f_quantity.split("|");
            if(cfg.f_reward == ECellType.JINBI.toString()){
                st = a[0] + "-" + a[1];
            }else{
                if(cfg.f_drop_rate == 10000){
                    min += parseInt(a[0]);
                    max += parseInt(a[1]);
                }else{
                    max += parseInt(a[1]);
                }
            }
        }
        if(type == 1){
            return st;
        }else if(type == 2){
            return min + "-" + max;
        }
    }

}