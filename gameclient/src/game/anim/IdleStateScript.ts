
/**动画状态脚本*/
export class IdleStateScript extends Laya.AnimatorStateScript {

    private aniName: string = "Idle";

    constructor() {
        super();

    }

    onStateEnter() {
        console.log("动画开始播放,aniName:" + this.aniName);

    }

    onStateUpdate() {
        console.log("动画正在更新,aniName:" + this.aniName);

    }


    onStateExit() {
        console.log("动画结束播放,aniName:" + this.aniName);

    }

}