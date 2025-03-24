import { Scene3DBase } from "../../frame/scene3d/Scene3DBase";
import { E } from "../G";
// import { Scene3D_House } from "../modules/house/scene3d/Scene3D_House";
// import { BuildScene3D } from "../modules/buildsys/BuildScene3D";

/**3D场景类型*/
export enum EScene3DType {
    None = 0,// 未定义
    Main,// 主场景
    ShowRole,//展示角色场景
    House,//家园系统场景
    HomeBuild,//建造
}

/**3D场景管理器 */
export class Scene3DManager {
    private _hasInit: boolean = false;//是否已初始化标记
    private _openeds: Scene3DBase[] = [];//打开的场景

    public Init() {
        if (this._hasInit) return; this._hasInit = true;
        this._openeds = [];
    }

    public Clear() {
        if (!this._hasInit) return; this._hasInit = false;
        if (!ListUtil.IsNullOrEmpty(this._openeds)) {
            this._openeds.forEach(o => {
                o.Exit();
            });
            this._openeds = [];
        }
    }

    public Update() {
        if (!ListUtil.IsNullOrEmpty(this._openeds)) {
            this._openeds.forEach(o => { o.Update(); });
        }
    }

    public LateUpdate() {
        if (!ListUtil.IsNullOrEmpty(this._openeds)) {
            this._openeds.forEach(o => { o.LateUpdate(); });
        }
    }

    public FixedUpdate() {
        if (!ListUtil.IsNullOrEmpty(this._openeds)) {
            this._openeds.forEach(o => { o.FixedUpdate(); });
        }
    }

    /**打开场景 
     * @param type 场景类型
     * @param complete 完成回调，携带参数当前的场景脚本
     * @param data 传入的数据
    */
    public Open(type: EScene3DType, complete: Callback, data: any) {
        let scene: Scene3DBase = this.getScene(type);
        if (scene == null) {
            LogSys.Error("scene no found:" + type);
            return;
        }
        ListUtil.Add(this._openeds, scene);
        E.ResMgr.LoadGroup(scene.ResGroup,
            Callback.Create(this, () => { scene.Enter(complete, data); }),
            Callback.Create(this, (v: number) => { })
        );

        return scene;
    }

    public Close(uuid: number) {
        let scene: Scene3DBase = this.find(uuid);
        if (scene == null) {
            LogSys.Error("scene no found :" + uuid);
            return;
        }
        ListUtil.Remove(this._openeds, scene);
        scene.Exit();
    }

    public Get(uuid: number): Scene3DBase {
        return this.find(uuid);
    }

    private find(id: number): Scene3DBase {
        let scene: Scene3DBase;
        if (this._openeds != null && this._openeds.length > 0) {
            scene = this._openeds.find(i => i.UUID == id);
        }
        return scene;
    }

    private getScene(type: EScene3DType): Scene3DBase {
        // let scene: Scene3DBase;
        // if (type == EScene3DType.Main) scene = new Scene3D_Main(type);
        // else if (type == EScene3DType.House) scene = new Scene3D_House(type);
        // else if (type == EScene3DType.HomeBuild) scene = new BuildScene3D(type);
        // return scene;
        return null;
    }

}