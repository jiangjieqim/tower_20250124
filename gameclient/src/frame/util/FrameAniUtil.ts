
/**帧动画*/
export class FrameAniUtil {

    /**创建帧动画
     * @param path 路径
    */
    public static Create(path: string, loadedHandler?:Laya.Handler): Laya.Animation {
        let ani = new Laya.Animation();
        ani = ani.loadAtlas(path,loadedHandler
        //     Laya.Handler.create(this, () => {
        //     if (area && cb) cb.call(area);
        // })
        );
        return ani;
    }

    /**播放帧动画*/
    public static Play(ani: Laya.Animation, index: number = 1, loop: boolean = false) {
        ani.visible = true;
        ani.play(index, loop);

        // Laya.stage.addChild(parent);
    }

    /**结束帧动画*/
    public static Stop(ani: Laya.Animation, parent?) {
        ani.visible = false;
        ani.stop();
        // Laya.stage.removeChild(parent);
    }


}