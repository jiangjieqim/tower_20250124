import { BaseCfg } from "../../../../static/json/data/BaseCfg";


export class t_Blood_Color extends BaseCfg {
    public GetTabelName(): string {
        return "t_Blood_Color";
    }
    private static _ins: t_Blood_Color;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Blood_Color();
        }
        return this._ins;
    }

    getColor(v:number){
        v = v * 10000;
        let _color:string = "ff0000";
        let l:Configs.t_Blood_Color_dat[] = this.List;
        for(let i = 0;i < l.length;i++){
            let o = l[i];
            if(v >= o.f_interval_min && v <= o.f_interval_max){
                _color = o.f_blood_color;
                break;
            }
        }
        return `#${_color}`;
    }
}