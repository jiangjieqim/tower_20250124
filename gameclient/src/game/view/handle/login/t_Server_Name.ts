import { BaseCfg } from "../../../static/json/data/BaseCfg";

export class t_Server_Name extends BaseCfg{
    private static _ins:t_Server_Name;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Server_Name();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Server_Name";
    }

    public getCfg(id:number,p:number){
        return this.List.find(ele => ele.f_server_id == id && ele.f_PlatformType == p);
    }
}