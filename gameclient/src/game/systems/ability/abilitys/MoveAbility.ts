import Vector3 = Laya.Vector3;
import Sprite3D = Laya.Sprite3D;
import Animator = Laya.Animator;

import { MathUtil } from "../../../../frame/util/MathUtil";
import { UnityUtil } from "../../../../frame/util/UnityUtil";
import { Vec3Util } from "../../../../frame/util/Vec3Util";
import { TextDefine } from "../../../common/defines/TextDefine";
import { AbilityBase, EAbility } from "../base/AbilityBase";

/**
 * 移动能力
 * -处理移动
 */
export class MoveAbility extends AbilityBase {
    protected _ability: EAbility = EAbility.Move;

    private _obj: Sprite3D;//对象本身
    private _obj_model: Sprite3D;//对象模型
    private _obj_shadow: Sprite3D;//对象脚底阴影
    private _anim: Animator;

    private _tarPos: Vector3;   //目标位置
    private _tarEuler: Vector3;   //目标旋转
    private _lstTarPos: Vector3[] = [];   //目标位置列表
    private _lstTarEuler: Vector3[] = [];   //目标旋转列表
    private _velocity: Vector3;//移动速率
    //角色控制器
    private _characterCtrl: Laya.CharacterController;

    private _moving: boolean = false;
    private _readyAnim: boolean = false;// 准备动画
    public MoveCallback: Callback; //移动回调

    public get IsMoving() {
        return this._moving;
    }

    constructor() {
        super();
    }

    /**初始化 */
    public OnInit(data?: any): void {
        super.OnInit(data);
        if (data == null) return;
        this._obj = data;
        this._obj_model = this._obj.getChildByName("Role") as Laya.Sprite3D;
        // this._trans = this._obj.transform;
        this._characterCtrl = this._obj.getComponent(Laya.CharacterController) as Laya.CharacterController;
        this._anim = UnityUtil.GetChildByName(this._obj, "Animator").getComponent(Animator) as Animator;

        this._readyAnim = true;

        // 跳跃默认为不跳
        this._moving = false;
        this._jumpReady = false;
        this._jumping = false;
    }

    public Update(): void {

    }

    public LateUpdate(): void {
        this.doMove();
    }

    public FixedUpdate(): void {
    }

    /**移动*/
    private doMove() {
        if (this._moving) {
            if (this._jumpReady) {
                this._jumpReady = false;
                this.PlayJumpAnim();
                let jumpvec = new Laya.Vector3(0, this.jumpSpeed, 0);
                this._characterCtrl.jump(jumpvec);
                this._jumping = true;
            }
            else if (!this._jumping) {
                // 播放移动动画
                this.PlayAnim();
                if (!this.checkNeedMove()) {
                    this.MoveFinish();
                    return;
                }
            }

            //一帧移动的距离
            let offset =this._velocity;
            if (this._tarPos != null) {
                this._characterCtrl.move(offset);
                if (!Vec3Util.IsZero(this._tarPos)) {
                    this.checkNextMove();
                }
                if (this.MoveCallback != null) this.MoveCallback.Invoke();
            }
        }
        if (this._jumping) {
            this.updateJumpShadow();// 刷新阴影
            // 检测回落到底面
            if (this._characterCtrl.isGrounded) {//回到地面
                this._jumping = false;
                if (this.jumpCompback) this.jumpCompback.Invoke();
            }
        }
    }

    /**开始移动 */
    public DoMove(v: Vector3, tarPos: Vector3, tarEuler: Vector3, complete?: Callback, moveCallback?: Callback) {
        this._velocity = v;
        this.MoveCallback = moveCallback;

        if (Vec3Util.IsZero(tarPos)) {
            this._tarPos = Vec3Util.ZERO;
            this._tarEuler = Vec3Util.ZERO;
        }
        else {
            this._lstTarPos.push(tarPos);
            this._lstTarEuler.push(tarEuler);
            if (this._tarPos == null) {
                this._tarPos = this._lstTarPos[0];
                this._tarEuler = this._lstTarEuler[0];
            }
        }
        this._moving = true;
    }

    /**检测是否需要移动 */
    private checkNeedMove() {
        if (this._velocity && !Vec3Util.IsZero(this._velocity)) {
            if (this._tarPos != null) {
                if (this._lstTarPos.length > 0) {
                    return true;
                }
                else if (Vec3Util.Equals(this._tarPos, Vec3Util.ZERO)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**检测移动完成 */
    private checkNextMove() {
        if (!Vec3Util.Equals(this._lstTarPos[0], Vec3Util.ZERO)) {
            let dis = MathUtil.DistanceV2(
                this._obj.transform.localPosition.x, this._obj.transform.localPosition.z,
                // this._lstTarPos[0].x, this._lstTarPos[0].z
                this._tarPos.x, this._tarPos.z
            );
            if (dis > 0.05) {// 距离大于0.1
                this._obj.transform.localPosition = new Laya.Vector3(this._tarPos.x, this._tarPos.y, this._tarPos.z);
                // this._trans.localPosition = new Laya.Vector3(this._lstTarPos[0].x, this._lstTarPos[0].y, this._lstTarPos[0].z);
            }
            this._obj_model.transform.localRotationEuler = new Laya.Vector3(0, this._tarEuler.y, 0);

            ListUtil.RemoveAt(this._lstTarPos, 0);// 移除第一个点
            ListUtil.RemoveAt(this._lstTarEuler, 0)// 移除第一个点
            if (this._lstTarPos.length > 0) {
                this._tarPos = this._lstTarPos[0];
                this._tarEuler = this._lstTarEuler[0];
            }
            else {
                this._tarPos = null;
                this._tarEuler = null;
            }
        }
    }

    /**移动结束 */
    private MoveFinish() {
        if (this._jumping) {
            return;
        }
        this._moving = false;
        this._characterCtrl.move(Vec3Util.ZERO);
        this.StopAnim();
    }

    //#region 移动过程中的跳跃
    private _jumpReady: boolean = false;// 开始跳跃
    private _jumping: boolean = false;// 跳跃中
    private jumpSpeed: number = 11;
    private jumpCompback: Callback;
    /**移动期间跳跃 */
    public DoJump(complete: Callback) {
        if (this._jumping) return;
        this.jumpCompback = complete;
        this._jumpReady = true;
        this._jumping = false;
    }

    /**刷新阴影 */
    private updateJumpShadow() {
        if (!this._obj_shadow) {
            this._obj_shadow = UnityUtil.GetChildByName(this._obj, "Shadow") as Sprite3D;
            return;
        }
        this._obj_shadow.transform.position = new Laya.Vector3(this._obj_shadow.transform.position.x, 0.1, this._obj_shadow.transform.position.z);
    }
    //#endregion

    //#region 动画相关
    /**播放动画 */
    private PlayAnim() {
        if (!this._readyAnim) return;
        this._readyAnim = false;
        if (!this._anim) return;
        this._anim.play(TextDefine.AnimName.Run, 0, 0);
    }

    /**停止动画 */
    private StopAnim() {
        if (!this._anim) return;
        this._anim.play(TextDefine.AnimName.Idle, 0, 0);
        this._readyAnim = true;
    }

    /*跳跃动画 */
    private PlayJumpAnim() {
        this._anim.play(TextDefine.AnimName.RunJump, 0, 0);
        this._readyAnim = true;
    }
    //#endregion
}