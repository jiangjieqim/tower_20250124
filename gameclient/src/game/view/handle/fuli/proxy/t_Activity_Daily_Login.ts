import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Activity_Daily_Login extends BaseCfg{
    private static _ins:t_Activity_Daily_Login;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Activity_Daily_Login();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Activity_Daily_Login";
    }
}