import V3 = Laya.Vector3;

import { RaycastHelper } from "../../../frame/help/RaycastHelp";
import { MathUtil } from "../../../frame/util/MathUtil";
import { NumberUtil } from "../../../frame/util/NumberUtil";
import { Vec3Util } from "../../../frame/util/Vec3Util";

/**相机控制器
 * -控制相机的跟随旋转
*/
export class CameraController extends Laya.Script {

    public Rotater: Laya.Sprite3D;//需要转动的对象

    private _camera: Laya.Camera;//相机
    private _cameraParent: Laya.Sprite3D;//相机父节点

    private _bUpdate: boolean = false;//是否刷新

    private _scene: Laya.Scene3D;//场景
    private _player: Laya.Sprite3D;//角色
    private _disAway: number = 0;//角色与相机的距离
    private _minDis: number = 1.75;//角色与相机的最小距离
    private _checkName: string = "Str_Building";//检测的碰撞命名

    private _rayDir: Laya.Vector3;// 射线方向
    private _rayDirNor: Laya.Vector3;// 射线方向单位向量
    private timer: number = 0;
    private timespan: number = 1000;
    private _tarPos: Laya.Vector3 = null;
    private bMove: boolean = false;

    constructor() {
        super();
    }

    public OnInit() {
        this._camera = this.owner as Laya.Camera;
        this._cameraParent = this._camera.parent as Laya.Sprite3D;
        // Layer的方式适配
        // this._camera.viewport = new Laya.Viewport(LayerMgr.left, LayerMgr.top, LayerMgr.stageDesignWidth * LayerMgr.adaptScale, LayerMgr.stageDesignHeight * LayerMgr.adaptScale);
    }

    public OnClear() {
        this._camera = null;
        this.Rotater = null;

        this._scene = null;
        this._player = null;
        this._bUpdate = false;
    }

    /**初始化相机检测参数 */
    public InitCameraHit(scene: Laya.Scene3D, player: Laya.Sprite3D) {
        this._scene = scene;
        this._player = player;
        this._disAway = Vec3Util.Magnitude(this._camera.transform.localPosition);// 初始距离
        this._rayDirNor = Vec3Util.Normalize(this._camera.transform.localPosition);// 方向向量
        if (this._scene != null && this._player != null) {
            this._bUpdate = true;
        }

    }

    /**刷新处理*/
    public UpdateHandler() {
        if (!this._bUpdate) return;

        //todo:目前pc使用滚轴缩放相机，先把自动移动注掉了
        // if (this.bMove && this._tarPos) {// 需要移动相机且目标点不为空
        //     this.timer += TimeUtil.DeltaTimeMS;
        //     this._camera.transform.localPosition = Vec3Util.Lerp(this._camera.transform.localPosition, this._tarPos, this.timer / this.timespan);
        //     if (Vec3Util.Distance(this._camera.transform.localPosition, this._tarPos) <= 0.1) {// 移动完成
        //         this.bMove = false;
        //         this._tarPos = null;
        //         this.timer = 0;
        //     }
        // }
    }

    /**刷新相机 */
    public UpdateCamera() {
        return;
        //todo:目前pc使用滚轴缩放相机，先把自动移动注掉了
        
        if (this.bMove) return;

        this._rayDir = Vec3Util.Normalize(Vec3Util.Subtract(this._camera.transform.position, this._player.transform.position));
        let hits: Laya.HitResult[] = RaycastHelper.RayCastAllPointDirLength(this._scene, this._player.transform.position, this._rayDir, this._disAway);

        let bHit: boolean = false;
        if (hits.length > 0) {
            for (let i = 0; i < hits.length; i++) {
                let hit = hits[i];
                if (hit.collider.owner.name.search(this._checkName) != -1) {// 撞到建筑
                    let curDis: number = Vec3Util.Distance(this._player.transform.position, hit.point);// 当前玩家与碰撞点的距离
                    if (curDis < this._disAway && curDis >= this._minDis) {// 距离小于正常相机距离且距离大于最小处理距离
                        // 设定目标点并移动相机
                        this._tarPos = Vec3Util.Scale(this._rayDirNor, curDis);// 目标点为碰撞点在当前节点下的本地坐标
                        this.timer = 0;
                        this.bMove = true;
                    }
                    bHit = true;
                    break;
                }
            }
        }
        if (!bHit) {
            // 判定相机是否需要复位
            let curDis: number = Vec3Util.Magnitude(this._camera.transform.localPosition);
            if (MathUtil.Abs(this._disAway - curDis) > 0.1) {// 相机不在初始位置(与初始位置偏差大于0.1)
                // 设定目标点并移动相机
                this._tarPos = Vec3Util.Scale(this._rayDirNor, this._disAway);// 目标点为相机的初始本地坐标
                this.timer = 0;
                this.bMove = true;
            }
        }
    }


    private _minDisToTarget: number = 1;//相机距离目标最小的距离
    private _maxDisToTarget: number = 15;//相机距离目标最大的距离
    private _saleCameraSpeed: number = 0.01;//缩放相机速度

    /**缩放相机 */
    public ScaleCamera(delta: number): void {
        if (this._camera == null || this._cameraParent == null) return;
        this.scaleCamera(delta);
    }

    /**相机距离目标位置缩放 */
    private scaleCamera(delta: number): void {
        let tmpDis = NumberUtil.toFixed(this.cameraToOriginDis, 2);//相机与目标的距离
        let offset: number = - delta * this._saleCameraSpeed * tmpDis;//偏移值-取反
        let camLocal = this._camera.transform.localPosition;//相机本地位置
        let vel = Vec3Util.Scale(this._rayDirNor, offset);//变化向量
        let tartPos = this._camera.transform.localPosition;//相机目标位置
        //拉远
        if (delta < 0) {
            if (tmpDis < this._maxDisToTarget) tartPos = Vec3Util.Add(camLocal, vel);
            //变化后的距离
            let tarCameraDis = Vec3Util.Distance(tartPos, Vec3Util.ZERO);
            //限制最大距离
            if (tarCameraDis > this._maxDisToTarget) tartPos = Vec3Util.Scale(this._rayDirNor, this._maxDisToTarget);
        }
        //拉近
        else if (delta > 0) {
            if (tmpDis > this._minDisToTarget) tartPos = Vec3Util.Add(camLocal, vel);
            //变化后的距离
            let tarCameraDis = Vec3Util.Distance(tartPos, Vec3Util.ZERO);
            //限制最小距离
            if (tarCameraDis < this._minDisToTarget) tartPos = Vec3Util.Scale(this._rayDirNor, this._minDisToTarget);
        }
        // console.log("offset:" + offset);
        // console.log("tartPos:" + Vec3Util.ToString(tartPos));
        this._camera.transform.localPosition = tartPos;
    }

    /**相机与原点的距离 */
    private get cameraToOriginDis(): number {
        if (this._camera == null || this._cameraParent == null) return 0;
        return Vec3Util.Distance(this._camera.transform.localPosition, Vec3Util.ZERO);
    }
}