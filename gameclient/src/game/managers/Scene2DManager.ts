
import {IScene2D} from "../../frame/scene2d/IScene2D";
import { E } from "../G";

/**2D场景类型 */
export enum EScene2DType {
    None = 0,// 未定义
}

/**2D场景管理器*/
export class Scene2DManager {

    private _hasInit: boolean = false;//是否已初始化
    private _scenes: Map<EScene2DType, IScene2D>;//所有注册的场景
    private _openScenes: EScene2DType[];//已开启的场景列表

    constructor() { }

    public Init(): boolean {
        if (this._hasInit) return false;
        this._hasInit = true;

        this._scenes = new Map<EScene2DType, IScene2D>();
        this._openScenes = [];

        this.initRegScenes();

        return true;
    }

    /**初始化注册场景 */
    private initRegScenes() {
        // this.Reg(EScene2DType.Test, new TestScene());
    }

    /**注册场景*/
    public Reg(type: EScene2DType, view: IScene2D) {
        if (view == null) return;
        if (this._scenes[type]) return;
        this._scenes[type] = view;
    }

    /**注销场景*/
    public UnReg(type: EScene2DType) {
        if (!this._scenes[type]) return;
        this._scenes[type] = null;

        delete this._scenes[type];
    }

    /**获取场景*/
    public Get(type: EScene2DType): IScene2D {
        return this._scenes[type];
    }

    /**当前打开的场景*/
    public CurOpenNum(): number {
        return this.CurOpenNum.length;
    }

    /**开启场景*/
    public Open(type: EScene2DType, callback: Callback, data?: any) {

        let scene: IScene2D = this.Get(type);
        if (scene == null) {
            LogSys.Warn("场景未注册 type:" + type);
            return;
        }
        E.ResMgr.LoadGroup(scene.ResGroup, Callback.Create(this, () => {
            scene.Enter(data);
            this._openScenes.push(type);
            // Log.Log("open scene :" + type);
            if (callback != null) callback.Invoke();
        }), Callback.Create(this, (v) => {
        }));
    }

    /**关闭页面*/
    public Close(type: EScene2DType) {
        let scene: IScene2D = this.Get(type);
        if (scene == null) return;
        ListUtil.Remove(this._openScenes, type);

        scene.Exit();
        // Log.Log("close scene :" + type);
    }

    /**是否注册该场景*/
    public HasReg(type: EScene2DType): boolean {
        if (this._scenes[type])
            return true;
        return false;
    }

    public Clear() {
        this.CloseAll();
        this._scenes = null;
    }

    /**关闭所有场景*/
    public CloseAll() {
        for (let i: number = 0; i < this._openScenes.length; i++) {
            this.Close(this._openScenes[i]);
        }
    }

    /**销毁指定页面
     * @param type 页面类型
     * @param newScene 新替换的页面
    */
    public Destroy(type: EScene2DType, newScene: IScene2D = null) {
        let oldScene: IScene2D = this.Get(type);
        if (oldScene) {
            this.UnReg(type);
            oldScene.Exit();
            oldScene = null;
        }
        this.Reg(type, newScene);
    }
}