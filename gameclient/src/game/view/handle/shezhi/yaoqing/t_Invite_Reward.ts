import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Invite_Reward extends BaseCfg{
    private static _ins:t_Invite_Reward;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Invite_Reward();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Invite_Reward";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let type = this.List[i].f_invite_type;
            if(!this._map[type]){
               this._map[type] = [];
            }
            this._map[type].push(this.List[i]);
        }
    }

    public getListByType(type:number){
        let arr = this._map[type];
        let array = [];
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_plat_type == initConfig.platform){
                array.push(arr[i]);
            }
        }
        return array;
    }
}