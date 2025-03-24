import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class FuncProxy extends BaseCfg {
    public GetTabelName() {
        return "t_func"
    }
    private static _ins: FuncProxy;
    public fightFunMap:number[];
    public setFunMap:number[];

    public static get Ins() {
        if (!this._ins) {
            this._ins = new FuncProxy();
        }
        return this._ins;
    }

    constructor(){
        super();
        this.fightFunMap = [];
        this.setFunMap = [];
        for(let i:number = 0;i<this.List.length;i++){
            if(this.List[i].f_main_redpoint){
                this.fightFunMap.push(this.List[i].f_FunctionID);
            }
            if(this.List[i].f_setting_redpoint){
                this.setFunMap.push(this.List[i].f_FunctionID);
            }
        }
    }

    public getCfgByFuncId(funcId: number): Configs.t_func_dat {
        return this.List.find(o => o.f_FunctionID === funcId);
    }
}

export class MainIconProxy extends BaseCfg {
    public GetTabelName() {
        return "t_MainIcon"
    }
    private static _ins: MainIconProxy;

    public static get Ins() {
        if (!this._ins) {
            this._ins = new MainIconProxy();
        }
        return this._ins;
    }
    /**顶部最大的pos值 */
    public readonly bottomMaxPos:number = 5;
    public getCfgByPosition(pos:number):Configs.t_MainIcon_dat{
        return this.List.find(o => o.f_pos === pos);
    }

    public getCfgByFuncid(funcId:number):Configs.t_MainIcon_dat{
        return this.List.find(o => o.f_funid === funcId);
    }

    /**
     * 获取功能id对应的位置信息pos
     * @param funcId 功能id
     * @returns 功能位置信息pos
     */
    public getFuncPosByFuncId(funcId: number): number {
        const cfg = this.List.find(o => Number(o.f_funid) === funcId);
        if (!cfg) {
            // throw new Error(`t_MainIcon缺少功能id#${funcId}的配置`);
            return -1;
        }
        return cfg.f_pos;
    }
}
