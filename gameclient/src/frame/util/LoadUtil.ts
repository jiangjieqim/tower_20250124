import Handler = Laya.Handler;

import { StaticDataMgr } from "../../game/static/StaticDataMgr";

/**资源加载辅助*/
export class LoadUtil {

    constructor() { }

    public static GetRes(path: string): any { return Laya.loader.getRes(path); }

    //#region XML

    /**加载xml文件*/
    public static LoadXML(path: string | string[], complete: Function, progress: Function) {
        this.LoadRes(path, complete, progress, Laya.Loader.XML);
    }
    /**获取xml文件*/
    public static GetXML(path: string): any { return Laya.loader.getRes(path); }

    //#endregion

    //#region Json
    /**加载JSON文件*/
    public static LoadJson(path: string | string[], complete: Function, progress: Function) {
        this.LoadRes(path, complete, progress, Laya.Loader.JSON);
    }

    private static parseUint64(json) {
        /*
        if (InitConfig.isJson) {
            //js格式需要uint64转化
            if (json != null) {
                let m = json['mDataMap'];
                for (let o in m) {
                    let check = false;
                    // console.log(o,m,m[o]);
                    for (let i in m[o]) {
                        let v = m[o][i];
                        if (typeof v == "number" || typeof v == "string") {

                        } else {
                            let f = m[o][i];
                            m[o][i] = new uint64(f.low, f.high, f.unsigned);
                            check = true;
                        }
                    }
                    if (check == false) {
                        break;
                    }
                }
            }
        }
        */
    }

    /**获取JSON文件*/
    public static GetJson(path: string): any {
        let d = StaticDataMgr.Ins.getData(path);
        if (d) {
            return d;
        }
        let json: JSON = Laya.loader.getRes(path);
        if(typeof json == 'string'){
            json = JSON.parse(StringUtil.replaceComments(json));
        }
        this.parseUint64(json);
        if (json != null) return json;
        return null;
    }

    //#endregion

    //#region Text文件

    /**加载TXT单个文件*/
    public static LoadTxt(path: string | string[], complete: Function, progress: Function) {
        this.LoadRes(path, complete, progress, Laya.Loader.TEXT);
    }
    /**获取TXT单个文件*/
    public static GetTxt(path: string): string { return Laya.loader.getRes(path); }

    //#endregion

    /**加载文件资源
     * @param path 指定路径
     * @param complete 完成回调
     * @param progress 进度回调
    */
    public static LoadRes(path: string | string[], complete: Function, progress: Function, type: string = null): void {
        if (path == null || path.length == 0) {
            if (complete != null) complete();
            return;
        }
        Laya.loader.load(path, Handler.create(this, complete), Handler.create(this, progress, [], false), type);
    }

    /**加载3d资源
     * @param path 指定路径
     * @param complete 完成回调
     * @param progress 进度回调
    */
    public static LoadSprite3D(path: string | string[], complete: Function, progress: Function): void {
        if (path == null || path.length == 0) {
            if (complete != null) complete();
            return;
        }
        Laya.loader.create(path, Handler.create(this, complete, [], false), Handler.create(this, progress, [], false));
    }

    /**加载3d场景
     * @param path 指定路径
     * @param complete 完成回調
    */
    public static LoadScene3D(path: string, complete: Function): void {
        if (StringUtil.IsNullOrEmpty(path)) { if (complete != null) complete(); return; }
        Laya.Scene3D.load(path, Handler.create(this, complete, [], false));
    }

    /**释放资源*/
    public static ClearRes(url: string) {
        Laya.loader.clearRes(url);
    }

    /**清除未加載完成的資源*/
    public static ClearUnUnLoaded() {
        Laya.loader.clearUnLoaded();
    }

    // Laya.Resource.destroyUnusedResources()

}