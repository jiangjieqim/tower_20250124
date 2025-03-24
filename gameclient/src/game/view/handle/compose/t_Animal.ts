import { BaseCfg } from "../../../static/json/data/BaseCfg";
/**动物列表配置 */
export class t_Animal extends BaseCfg {
    public GetTabelName(): string {
        return "t_Animal";
    }
    private static _ins:t_Animal;
    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Animal();
        }
        return this._ins;
    }
}