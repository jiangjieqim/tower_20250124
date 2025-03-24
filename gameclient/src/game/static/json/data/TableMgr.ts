export class TableMgr {
    private _clsMap = {};
    constructor() {
      
    }

    regClsList(_clss:any[]){
        for(let i = 0;i < _clss.length;i++){
            this.reg(_clss[i]);
        }
    }

    private reg(cls) {
        if(typeof cls.NAME!="string"){
            LogSys.Error(`your class must be have static NAME!`)
            return;
        }
        this._clsMap[cls.NAME] = cls;
    }

    private _tableMap = {};
    getTable(name: string):any {
        if(StringUtil.IsNullOrEmpty(name)){
            return;
        }
        if (!this._tableMap[name]) {
            let _cls = this._clsMap[name]
            this._tableMap[name] = new _cls();
        }
        return this._tableMap[name];
    }
}