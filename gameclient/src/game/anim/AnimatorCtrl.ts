import { IdleStateScript } from "./IdleStateScript";
import { RunStateScript } from "./RunStateScript";
import Animator = Laya.Animator;

/**动画控制器*/
export class AnimatorCtrl {

    private _animator: Animator;    //动画机
    private _aniNames: string[];    //所有动画名称

    constructor(animator: Animator, aniNames: string[]) {
        this._animator = animator;
        this._aniNames = aniNames;

        // this.addStateScript();
        //目前所有的动画都在unity animator 中放置好,这里可以从animator获取animatorstate
        //通过代码逻辑控制切换

    }

    //todo:由于动画脚本不能实例-目前先不处理
    // /**给每个动画状态添加动画状态脚本*/
    // private addStateScript(): void {
    //     if (this.animIsNull()) return;

    //     for (let i: number = 0; i < this._aniNames.length; i++) {
    //         let state = this.getState(this._aniNames[i]);
    //         if (state != null) {
    //             if (this._aniNames[i] == TextDefine.ani_idle)
    //                 state.addScript(IdleStateScript);
    //             else if (this._aniNames[i] == TextDefine.ani_run)
    //                 state.addScript(RunStateScript);
    //             //
    //         }
    //     }
    // }

    /**是否有动画机*/
    private animIsNull(): boolean {
        return this._animator == null;
    }

    /**是否有指定动画状态*/
    private animStateIsNull(aniName: string): boolean {
        return this.getState(aniName) == null;
    }

    /**当前动画状态*/
    private curStateEquals(aniName: string): boolean {
        let state = this._animator.getControllerLayer(0).getCurrentPlayState();
        if (state == null) return false;

        return (state.animatorState.name == aniName);
    }

    /**获取动画状态*/
    private getState(aniName: string): Laya.AnimatorState {
        return this._animator.getControllerLayer(0).getAnimatorState(aniName);
    }


}