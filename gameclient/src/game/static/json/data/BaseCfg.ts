import { LoadUtil } from "../../../../frame/util/LoadUtil";
import { E } from "../../../G";
export enum ECfgVersion{
    Normal = 1,
    Diff = 2,
}
export abstract class BaseCfg {
    protected _tableName:string;
    // private static _ins:BaseCfg;
    // public static get Ins(){
    //     if(!this._ins){
    //         this._ins = new BaseCfg();
    //     }
    //     return this._ins;
    // }
    private _ver: number;
    public get ver(): number {
        if (this._ver == undefined) {
            let _name = this.GetTabelName();
            let arr = _name.split("_");
            let s = arr[arr.length - 1];
            this._ver = parseInt(s.substr(1, s.length - 1));
            if(isNaN(this._ver)){
                this._ver = 0;
            }
        }
        return this._ver;
    }
    public get suffix(){
        // return MainModel.Ins.tabelSuffix;
        return "";
    }
    protected Cfg;
    
    public abstract GetTabelName():string;
    
    /**是否根据版本读表 */
    constructor(_tableName?:string){
        let _name;
        if(_tableName){
            this._tableName = _tableName;
            _name = _tableName;
        }else{
            _name = this.GetTabelName();
        }
        if(!_name){
            throw Error("Please set your tabel name!");
        }
        this.Cfg = this.GetTabel(`cfg_${_name}`);
        if(!this.Cfg){
            LogSys.Error(`${_name}...Cfg is null`);
        }
    }
    private _isHasData:boolean;
    /**是否已经初始化数据了 */
    protected get isHasData(){
        if(!this._isHasData){
            let _name = this.GetTabelName();
            if (!_name) {
            
            }else{
                this._isHasData = this.GetTabel(`cfg_${_name}`) != null;
            }
        }
        return this._isHasData;
    }
    /**
     * 根據f_id獲取值
     */
    public GetDataById(id: number) {
        return this.getkv('f_id', id);
    }

    public GetAllFids(){
        return this.getAllValue('f_id');
    }
    public get isLoaded() {
        return this.Cfg != undefined;
    }
    protected getkv(keyStr:string,v){
        let by:ByteCfg = this.Cfg;
        if(!by){
            return;
        }
        if(by.tableName && !by._mDataMap){
            return by.getKv(keyStr,v);//不解全表获取
        }

        for (var key in this.Cfg.mDataMap) {
            let element = this.Cfg.mDataMap[key];
            if (element[keyStr] == v)
                return element;
        }
        return null;
    }

    protected getAllValue(keyStr:string){
        let by:ByteCfg = this.Cfg;
        if(by.tableName && !by._mDataMap){
            return by.getAllByKey(keyStr);//不解全表
        }
        let m = this.Cfg.mDataMap;
        let result = [];
        for (let key in m) {
            let element = m[key];
            result.push(element[keyStr]);
        }
        return result;
    }

    public forEach(that,func:Function){
        let by:ByteCfg = this.Cfg;
        by.getAllCallByKey(that,func);
    }

    /**配置的列表 */
    private _list;
    public get List(): any[]{
        if(this._list){
            return this._list;
        }
        let by:ByteCfg = this.Cfg;
        if(!by){
            E.debugMsgBox(`table[${this.GetTabelName()}] not exist!`);
            this._list = [];
            return this._list;
        }
        if(by.tableName && !by._mDataMap){
            let m1= this.Cfg.mDataMap;//解表
            this._list = by.list1;
            return this._list;
        }
        let _list1 = [];
        for (var key in this.Cfg.mDataMap) {
            let element = this.Cfg.mDataMap[key];
            _list1.push(element);
        }
        this._list = _list1;
        return this._list;
    }

    protected GetTabel(name:string){
        return LoadUtil.GetJson(`o/config/export/${name}.json`);
    }

    public dispose(){
        let by:ByteCfg = this.Cfg;
        by.dispose();
    }
    checkVaild(){

    }
}
/**基础表 */
export class BaseCfgConstuctor extends BaseCfg{
    private _name:string;
    public GetTabelName(): string {
        return this._name;
    }
    constructor(_name:string){
        super(_name);
    }
}