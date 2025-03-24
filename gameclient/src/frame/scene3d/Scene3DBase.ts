import { EventGroup } from "../../game/event/EventGroup";
import { E } from "../../game/G";
import { EScene3DType } from "../../game/managers/Scene3DManager";
import {ResItemGroup} from "../../game/resouce/ResItemGroup";
import { IScene3D } from "./ISceneBase3D";

/**3d场景基类 
 * 
 * 声明周期：
 * onAddLoadRes
 * 
 * onEnter
 * onInit
 * onAddEventListener
 * 
 * onUpdate
 * onLateUpdate
 * onFixedUpdate
 * 
 * onExit
 * onClear3D
 * 
*/
export abstract class Scene3DBase implements IScene3D {
    //进入场景时携带的数据，根据需要转换类型
    private _data: any;
    protected get Data() { return this._data; }
    //加载场景完成的回调
    private enterComplete: Callback;
    //场景脚本对象唯一ID
    private static _uuid: number = 0;
    private static getUUID() { return this._uuid++; }

    constructor(type: EScene3DType) {
        this.onAddLoadRes();
        this.SceneType = type;
        this.UUID = Scene3DBase.getUUID();
        console.log("this.id:" + this.UUID);
    }

    //#region 接口实现

    //实例对象时获取的ID
    public UUID: number = 0;
    //场景类型
    public SceneType: EScene3DType = EScene3DType.Main;

    public Enter(complete: Callback, data?: any) {
        this.enterComplete = complete;
        this._data = data;
        this.onEnter();
        this.init();

        // Updater.Ins.AddUpdate(this, this.onUpdate);
        // Updater.Ins.AddFixedUpdate(this, this.onFixedUpdate);
        // Updater.Ins.AddLateUpdate(this, this.onLateUpdate);
    }

    public Exit() {
        this.onExit();
        this.clearEventListenr();
        this.clearRes();
        this.clear3D();
        this.hasInit = false;
    }

    protected abstract onEnter(): void;
    protected abstract onExit(): void;

    //#region 刷新

    Update() { this.onUpdate(); }
    LateUpdate() { this.onLateUpdate(); }
    FixedUpdate() { this.onFixedUpdate(); }

    protected abstract onUpdate(): void;
    protected abstract onLateUpdate(): void;
    protected abstract onFixedUpdate(): void;

    //#endregion

    //#endregion

    //是否已经初始化
    protected hasInit: boolean = false;
    //初始化
    private init(): void {
        if (this.hasInit) return;
        this.hasInit = true;
        LogSys.Log("Scene:" + this.constructor.name + " init");
        this.onInit();
        this.addEventListener();
        this.init3D();
    }

    /**初始化-在初始化场景之前执行 */
    protected abstract onInit(): void;

    //#region 资源组-该页面用到的资源

    //资源组
    private _resGroup: ResItemGroup;
    public get ResGroup(): ResItemGroup {
        if (!this._resGroup) this._resGroup = new ResItemGroup();
        return this._resGroup;
    }

    /**添加加载资源 
     * -u3d资源不要通过这种方式加载
    */
    protected abstract onAddLoadRes(): void;

    /**添加资源
     * @param url 资源地址
     * @param type 资源类型
     */
    protected addRes(url: string, type: string): void {
        if (!this._resGroup) this._resGroup = new ResItemGroup();
        this._resGroup.Add(url, type);
    }

    /**资源组清除 */
    private clearRes(): void {
        if (this._resGroup == null) return;
        this._resGroup.Clear();
        this._resGroup = null;
    }

    //#endregion

    //#region 事件组-该页面监听的自定义事件
    //事件组
    private _eventGroup: EventGroup;
    public get Event() { return this._eventGroup; }
    //正在监听
    private isListening: boolean = false;
    /**添加监听事件 */
    protected abstract onAddListener(): void;

    /**添加事件监听 */
    private addEventListener() {
        if (this.isListening) return; this.isListening = true;
        if (this._eventGroup == null) this._eventGroup = new EventGroup();
        //子类添加事件监听
        this.onAddListener();
    }

    /**清除事件监听*/
    private clearEventListenr() {
        if (!this.isListening) return; this.isListening = false;
        if (this._eventGroup == null) return;
        this._eventGroup.Clear();
        this._eventGroup = null;
    }

    //#endregion

    //#region 3D场景

    //场景对象
    private _scene3d: Laya.Scene3D;
    public get Scene3D(): Laya.Scene3D { return this._scene3d; }

    //初始化场景
    private init3D(): void {
        E.ResMgr.GetScene3D(E.ResMgr.GetScenePath(this.SceneType), Callback.Create(this, (scene3d: Laya.Scene3D) => {
            if (scene3d == null) {
                console.error('load scene3d failed:' + this.SceneType);
                return;
            }
            this._scene3d = scene3d;
            this.onInit3D();
            if (this.enterComplete) this.enterComplete.Invoke({ scene3d: this });
        }));
    }

    //清除场景
    private clear3D(): void {
        if (this._scene3d != null) {
            this._scene3d.removeSelf();
            this._scene3d.destroy();
            this._scene3d = null;
        }
        this.onClear3D();
    }

    protected abstract onInit3D(): void;
    protected abstract onClear3D(): void;

    //#endregion


}