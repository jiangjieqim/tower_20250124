
/**动画状态脚本*/
export class RunStateScript extends Laya.AnimatorStateScript {

    private aniName: string = "Run";

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