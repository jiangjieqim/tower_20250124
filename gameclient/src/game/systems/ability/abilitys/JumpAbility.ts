import Sprite3D = Laya.Sprite3D;
import Transform3D = Laya.Transform3D;
import Animator = Laya.Animator;

import { UnityUtil } from "../../../../frame/util/UnityUtil";
import { TextDefine } from "../../../common/defines/TextDefine";
import { ColChecker } from "../../../d3/collider/ColChecker";
import { AbilityBase, EAbility } from "../base/AbilityBase";

/**
 * 跳跃能力
 * -处理移动
 */
export class JumpAbility extends AbilityBase {
    protected _ability: EAbility = EAbility.Jump;

    private _obj: Sprite3D;//对象
    private _obj_model: Sprite3D;//对象模型
    private _obj_shadow: Sprite3D;//对象脚底阴影

    private _anim: Animator;

    //角色控制器
    private _characterCtrl: Laya.CharacterController;
    private _colliderShape: Laya.CapsuleColliderShape;
    public colChecker: ColChecker;

    private jumpSpeed: number = 11;
    private _readyAnim: boolean = false;// 准备动画
    private _jumpTimer: number = 0;
    private JumpCallback: Callback; //跳跃回调

    constructor() {
        super();

    }

    /**初始化 */
    public OnInit(data?: any): void {
        super.OnInit(data);
        if (data == null) return;
        this._obj = data;
        this._characterCtrl = this._obj.getComponent(Laya.CharacterController) as Laya.CharacterController;
        this._anim = UnityUtil.GetChildByName(this._obj, "Animator").getComponent(Animator) as Animator;

        this._readyAnim = true;
    }


    public Update(): void {

    }

    public LateUpdate(): void {
        this.doJump();

    }

    public FixedUpdate(): void {
    }

    private _jumping: boolean = false;// 正在跳跃
    public get IsJumping(): boolean {
        return this._jumping;
    }
    private _ready: boolean = false;// 准备跳跃
    private _up: number = 1;

    /**跳跃*/
    private doJump() {
        if (this._jumping) {
            this.updateShadow();// 刷新阴影
            // // 检测动画播放完成
            // this._jumpTimer += TimeUtil.DeltaTimeS;
            // if (this._jumpTimer >= this._anim.getControllerLayer(0).getCurrentPlayState().duration) {
            //     this.JumpFinish();
            // }
            // 检测回落到底面
            if (this._characterCtrl.isGrounded) {//回到地面
                console.log("");
                this.JumpFinish();
            }
        }
        else if (this._ready) {
            this._jumping = true;
            this.PlayAnim();
            let jumpvec = new Laya.Vector3(0, this.jumpSpeed, 0);
            this._characterCtrl.jump(jumpvec);
        }
    }

    /**跳跃 */
    public DoJump(complete: Callback) {
        if (this._jumping) return;// 正在跳 
        this.JumpCallback = complete;
        this._ready = true;
        this._readyAnim = true;
        this._jumping = false;
    }

    /**跳跃完成 */
    private JumpFinish() {
        this._jumping = false;
        this._ready = false;
        this._readyAnim = false;
        if (this.JumpCallback) this.JumpCallback.Invoke();
    }

    /**刷新阴影 */
    private updateShadow() {
        if (!this._obj_shadow) {
            this._obj_shadow = UnityUtil.GetChildByName(this._obj, "Shadow") as Sprite3D;
            return;
        }
        this._obj_shadow.transform.position = new Laya.Vector3(this._obj_shadow.transform.position.x, 0.1, this._obj_shadow.transform.position.z);
    }

    //#region 动画相关

    /**播放动画 */
    private PlayAnim() {
        if (!this._readyAnim) return;
        this._readyAnim = false;
        if (!this._anim) return;
        console.log("播放动画");
        this._jumpTimer = 0;
        
        this._anim.play(TextDefine.AnimName.Jump, 0, 0);//
    }

    //#endregion
}