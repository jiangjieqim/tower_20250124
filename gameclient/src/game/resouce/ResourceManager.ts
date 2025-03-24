
// import { Dictionary } from "../../frame/structure/Dictionary";
import { LoadUtil } from "../../frame/util/LoadUtil";
import { EScene2DType } from "../managers/Scene2DManager";
import { EScene3DType } from "../managers/Scene3DManager";
import { ResItem } from "./ResItem";
import { ResItemGroup } from "./ResItemGroup";

/**资源管理器
 * @description -所有资源的加载、获取、释放
*/
export class ResourceManager {

    //#region 静态相关

    //#endregion

    //#region 实例相关

    //所有已加载的资源 k=路径 v=资源条目
    private resItemMap: Map<string, ResItem> = new Map<string, ResItem>();

    private hasInit: boolean = false;

    constructor() { }

    public Init() {
        if (this.hasInit) return false;
        this.hasInit = true;

        return true;
    }

    public Clear() { }

    // //#region wx广告配置

    // /**微信广告配置*/
    // public GetWxAdsCfg() { return LoadUtil.GetJson(ResPath.Cfg.wxAdsCfg); }
    // public RandomWxShare() { }

    // //#endregion

    //#region 资源释放

    /**释放指定资源*/
    public ReleaseURL(url: string) {
        let contains: boolean = false;
        this.resItemMap.forEach((v: ResItem, key: string) => {
            if (key == url)
                contains = true;
        });
        if (contains)
            LoadUtil.ClearRes(url);
        else
            LogSys.Error("加载资源组内不存在该资源");
    }

    /**释放资源组*/
    public ReleaseGroup(group: ResItemGroup) {
        let urls = new Array<string>();
        group.Items.forEach(i => {
            urls.push(i.Url);
        });

        for (let i = 0; i < urls.length; i++) {
            LoadUtil.ClearRes(urls[i]);
            this.resItemMap.forEach((v: ResItem, key: string) => {
                if (key == urls[i])
                    this.resItemMap.delete(key);
            });
        }
    }

    /**釋放未加載完成的資源*/
    public ReleaseUnLoaded() {
        LoadUtil.ClearUnUnLoaded();
    }

    //#endregion

    //#region 資源加載

    /**加載預設*/
    public LoadPrefab(path: string | string[], complete: Callback, progress: Callback) {
        LoadUtil.LoadRes(path, (item: Laya.Prefab) => {
            let prefab: Laya.Prefab = new Laya.Prefab();
            prefab.json = item;
            if (complete != null) complete.Invoke(prefab);
        }, (v) => {
            if (progress != null) progress.Invoke(v);
        });
    }

    //#endregion

    /**加载资源组
     * @param group 资源组
     * @param progress 进度回调
     * @param complete 完成回调
    */
    public LoadGroup(group: ResItemGroup, complete: Callback, progress: Callback) {
        let urls: Array<any> = new Array<any>();
        group.Items.forEach(i => {
            urls.push({ url: i.Url, type: i.Type });
        });

        if(initConfig.enable_res_log){
            for(let i = 0;i < urls.length;i++){
                let url = urls[i];
                LogSys.Log(`LoadGroup:${JSON.stringify(url)}`);
            }
        }

        LoadUtil.LoadRes(urls, () => {
            if (complete) complete.Invoke();

            for (let i: number = 0; i < group.Items.length; i++) {
                let info = group.Items[i];
                if (!this.resItemMap.has(info.Url))
                    this.resItemMap.set(info.Url, info);
            }

        }, (v: number) => {
            if (progress) progress.Invoke(v);
        });
    }

    /**加载单个资源*/
    public LoadRes(item: ResItem, completeEvent: Callback, progressEvent: Callback) {
        LoadUtil.LoadRes([item.Url], (success: boolean) => {
            if (success) {
                if (completeEvent) completeEvent.Invoke();
                this.resMapAdd(item);
            }
            else {
                LogSys.Error("Load Res Error:" + item.Url);
            }
        }, (v: number) => {
            if (progressEvent) progressEvent.Invoke(v);
        });
    }

    /**获取资源*/
    public GetRes(url: string): any {
        return LoadUtil.GetRes(url);
    }

    //#region laya 场景资源处理

    private scene2DMap: Dictionary<EScene2DType, string>;

    /**打开场景*/
    public SceneOpen(e: EScene2DType, complete: Laya.Handler, progress: Laya.Handler): void {
        let path = "";
        if (this.scene2DMap != null) {
            path = this.scene2DMap.Value(e);
        }

        if (!StringUtil.IsNullOrEmpty(path))
            Laya.Scene.open(path, true, null, complete, progress);
    }

    /**关闭场景*/
    public SceneClose(e: EScene2DType): void {
        let path = "";
        if (this.scene2DMap != null) {
            path = this.scene2DMap.Value(e);
        }

        if (!StringUtil.IsNullOrEmpty(path))
            Laya.Scene.close(path);
    }

    /**打开页面*/
    public ViewOpen(path: string, complete: Function): void {
        // Log.Log("[ResMgr][ViewOpen] type:" + type, "path" + StringUtil.IsNull(path));
        if (!StringUtil.IsNullOrEmpty(path)) {
            if (complete) complete(LoadUtil.GetJson(path));
        }
        else {
            LogSys.Log("path is null of type:" + path);
        }
    }

    //#endregion

    //#region u3d场景资源处理

    private getScene3D(path: string): Laya.Scene3D {
        let scene: Laya.Scene3D = LoadUtil.GetJson(path) as Laya.Scene3D;
        return scene;
    }

    /**异步获取场景-如果已加载，则直接获取返回，如果未加载，则先加载后返回
     * @param path 场景资源路径
     * @param complete 回调返回场景
    */
    public GetScene3D(path: string, complete: Callback): void {
        if (StringUtil.IsNullOrEmpty(path) || complete == null) {
            console.warn("params not define");
            return;
        }
        let scene: Laya.Scene3D = this.getScene3D(path);
        if (scene != null) {
            complete.Invoke(scene);
        }
        else {
            LoadUtil.LoadScene3D(path, () => {
                complete.Invoke(this.getScene3D(path));
            });
        }
    }

    /**通过场景名获取场景路径
     * @param type 场景枚举
    */
    public GetScenePath(type: EScene3DType): string {
        // switch (type) {
        //     case EScene3DType.Main:
        //         return ResPath.U3D.Scene_MainScene;
        //     case EScene3DType.ShowRole:
        //         return ResPath.U3D.Scene_ShowRole;
        //     case EScene3DType.House:
        //         return ResPath.U3D.Scene_MapEditor;
        //     case EScene3DType.HomeBuild:
        //         return ResPath.U3D.Scene_MapEditor;
        //     default:
                return StringUtil.Empty;
        // }
    }

    //#endregion

    //#region unity资源处理

    /**通过指定路径数组加载3d资源
     * @param paths 指定路径数组
    */
    public GetSprite3Ds(paths: string[], complete: Function, progress: Function): void {
        let loadpath: string[] = [];
        for (let i: number = 0; i < paths.length; i++) {
            if (LoadUtil.GetJson(paths[i]) == null) {
                // console.log("add path " + scene_prefabs[i]);
                ListUtil.SafeAdd(loadpath, paths[i]);
            }
        }
        // console.log("loadpath:::" + loadpath.length);

        LoadUtil.LoadSprite3D(loadpath, () => {
            if (complete != null) complete();
        }, (value) => {
            if (progress != null) progress(value);
        });
    }

    /**通过指定路径获取资源
     * @param path -完整资源路径带扩展名
     * @param complete 加载完成回调-加载成功失败都会执行，成功返回加载克隆对象，失败返回null
    */
    public GetSprite3D(path: string, complete: Callback): void {
        if (StringUtil.IsNullOrEmpty(path) || complete == null) {
            console.warn("params not define");
            return;
        }

        //先本地获取-如果本地已加载，则直接返回完成
        let obj: Laya.Sprite3D = LoadUtil.GetJson(path) as Laya.Sprite3D;
        if (obj != null) {
            // Log.Log("Get Unity Export Prefab:" + path);
            complete.Invoke(this.cloneSprite3D(obj));
        }
        //本地没有，则进行资源加载
        else {
            // Log.Log("Load Unity Export Prefab:" + path);
            LoadUtil.LoadSprite3D([path], () => {
                obj = LoadUtil.GetJson(path) as Laya.Sprite3D;
                if (obj != null) {
                    complete.Invoke(this.cloneSprite3D(obj));
                }
                else {
                    LogSys.Error("[ResMgr][GetUnityExport] Failed:" + path);
                    complete.Invoke(null);
                }
            }, null);
        }
    }

    /**加载.lh文件
     * @param path 完整资源路径名，会自动补全.lh后缀
     * @param complete 加载完成回调-完成回调返回sprite3d参数
    */
    public LoadU3D_LH(path: string, complete: Callback): void {
        if (StringUtil.IsNullOrEmpty(path)) return;
        if (!StringUtil.Contains(path, ".lh")) {
            path += ".lh";
        }
        this.GetSprite3D(path, complete);
    }

    /**加载特效资源
     * @param name 资源名,可以不加扩展名
     * @param complete 加载完成回调
    */
    public LoadU3D_VFX(name: string, complete: Callback): void {
        let path = "";//ResPath.U3D.GetTotalVFXPath(name);
        this.LoadU3D_LH(path, complete);
    }

    //#endregion

    /**添加资源缓存*/
    private resMapAdd(item: ResItem): void {
        if (!this.resItemMap.has(item.Url)) {
            this.resItemMap.set(item.Url, item);
        }
    }

    /**克隆对象*/
    private cloneSprite3D(obj: Laya.Sprite3D): Laya.Sprite3D {
        return Laya.Sprite3D.instantiate(obj);
    }

    //#endregion
}