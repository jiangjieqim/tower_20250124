import Sprite3D = Laya.Sprite3D;
import Transform3D = Laya.Transform3D;
import Animator = Laya.Animator;

import { AbilityBase, EAbility } from "../base/AbilityBase";
import {UnityUtil} from "../../../../frame/util/UnityUtil";
import { TextDefine } from "../../../common/defines/TextDefine";
// import t_action_help from "../../../static/json/data/cfg_t_action";

/**
 * 站立能力
 */
export class IdleAbility extends AbilityBase {
    protected _ability: EAbility = EAbility.Idle;

    private _obj: Sprite3D;//控制移动的对象
    private _anim: Animator;

    private _ready: boolean = false;// 准备动作

    constructor() {
        super();

    }

    public OnInit(data?: any): void {
        super.OnInit(data);
        if (data == null) return;
        this._obj = data;
        this._anim = UnityUtil.GetChildByName(this._obj, "Animator").getComponent(Animator) as Animator;
    }

    public Update(): void {

    }

    public LateUpdate(): void {
        this.updateIdle();
    }

    public FixedUpdate(): void {
    }

    private updateIdle() {
        this.PlayAnim();
    }

    /**开始站立 */
    public DoIdle() {
        this._ready = true;
    }

    //#region 动画相关
    /**播放动画 */
    private PlayAnim() {
        if (!this._ready) return;
        this._ready = false;
        if (!this._anim) return;
        console.log("播放动画");
        this._anim.play(TextDefine.AnimName.Idle, 0, 0);

    }
    

    //#endregion
}