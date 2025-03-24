declare class ByteCfg{
    init(byte:Laya.Byte);
    dispose();
    mDataMap;
    _mDataMap;
    list1:any[];
    tableName:string;
    getKv(keyStr:string,v)
    getAllByKey(keyStr:string)
    getAllCallByKey(that,func:Function);
    static indexKEY:string;
    static uint64;
}
declare class ByteCfgLoad {
    constructor() ;
    /**根据表名获取配置 */
    getByName(name:string):ByteCfg;
    /**加载所有的配置集合 */
    load(url:string,that,func:Function,indexKey:string);
} 
declare function JSZip (data);

declare interface IConfig{
    key:string;
}
declare let config:IConfig;
declare function game8u_pay(data);
declare function game8u_reportrole(data);
