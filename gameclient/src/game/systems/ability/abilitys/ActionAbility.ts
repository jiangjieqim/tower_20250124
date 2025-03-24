import Sprite3D = Laya.Sprite3D;
import Transform3D = Laya.Transform3D;
import Animator = Laya.Animator;

import { AbilityBase, EAbility } from "../base/AbilityBase";
import {UnityUtil} from "../../../../frame/util/UnityUtil";
import { TextDefine } from "../../../common/defines/TextDefine";
// import t_action_help from "../../../static/json/data/cfg_t_action";

/**
 * 动作能力
 */
export class ActionAbility extends AbilityBase {
    protected _ability: EAbility = EAbility.Action;

    private _obj: Sprite3D;//控制移动的对象
    private _anim: Animator;

    private _actionId: number = 0;
    private _readyAnim: boolean = false;// 准备动画

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
        this.updateAction();
    }

    public FixedUpdate(): void {
    }

    private updateAction() {
        this.PlayAnim();
    }

    /**做动作 */
    public DoAction(actionId: number) {
        this._actionId = actionId;
        this._readyAnim = true;
    }

    //#region 动画相关
    /**播放动画 */
    private PlayAnim() {
        if (!this._readyAnim) return;
        this._readyAnim = false;
        if (!this._anim) return;
        console.log("播放动画");
        // this._anim.play(t_action_help.Ins.GetAnim(this._actionId), 0, 0);

    }

    /**停止动画 */
    private StopAnim() {
        if (!this._anim) return;
        console.log("停止动画");
        this._anim.play(TextDefine.AnimName.Idle, 0, 0);
    }

    //#endregion
}