/**动画工具类*/
export class AniUtil {

    /**播放动画*/
    public static PlayAni(ani: Laya.AnimationBase, isLoop: boolean, isBack: boolean, area?: any, cb?: Function) {
        if (isBack)
            ani.wrapMode = Laya.AnimationBase.WRAP_REVERSE;
        else
            ani.wrapMode = Laya.AnimationBase.WRAP_POSITIVE;

        ani.play(0, isLoop);
        if (cb) {
            if (!ani.hasListener(Laya.Event.COMPLETE)) {
                ani.on(Laya.Event.COMPLETE, this, () => {
                    cb.call(area);
                });
            }
        }
    }

    /**停止播放动画*/
    public static CloseAni(ani: Laya.AnimationBase) {
        ani.stop();
    }

    /**渐变*/
    public static AniAlpha(box: Laya.Sprite, alpha: number, area?: any, cb?: Function) {
        box.mouseEnabled = false;
        box.visible = true;
        Laya.Tween.to(box, { alpha: alpha }, 300, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
            if (area != null && cb != null)
                cb.call(area);
            box.visible = alpha == 1 ? true : false;
            box.mouseEnabled = true;
        }));
    }

    /**缩放*/
    public static AniScale(box: Laya.Sprite, scale: Laya.Vector2, time = 500, area?: any, cb?: Function, disable = false) {
        if (!disable)
            box.mouseEnabled = false;
        box.visible = true;
        Laya.Tween.to(box, { scaleX: scale.x, scaleY: scale.y }, time, Laya.Ease.backInOut, Laya.Handler.create(this, () => {
            if (area != null && cb != null)
                cb.call(area);
            box.visible = scale.x != 0;
            if (!disable)
                box.mouseEnabled = true;
        }));
    }

    /**x 移动指定增量*/
    public static AniMoveAddX(box: Laya.Sprite, x: number, time = 500, ease = Laya.Ease.backInOut, area?: any, cb?: Function) {
        Laya.Tween.to(box, { x: x + box.x }, time, ease, Laya.Handler.create(this, () => {
            if (area && cb) cb.call(area);
            // box.mouseEnable=true;
        }));
    }

    /**y移动指定增量*/
    public static AniMoveAddY(box, y: number, time = 500, ease = Laya.Ease.backInOut, area?: any, cb?: Function) {
        Laya.Tween.to(box, { y: y + box.y }, time, ease, Laya.Handler.create(this, () => {
            if (area && cb) cb.call(area);
            // box.mouseEnable=true;
        }));
    }

    /**移动x到目标位置*/
    public static AniMoveToX(box, x: number, time = 200, ease = Laya.Ease.backInOut, area?: any, cb?: Function) {
        Laya.Tween.to(box, { x: x }, time, ease, Laya.Handler.create(this, () => {
            if (area && cb) cb.call(area);
        }));
    }

    /**移动y到目标位置*/
    public static AniMoveToY(box, y: number, time = 200, ease = Laya.Ease.backInOut, area?: any, cb?: Function) {
        Laya.Tween.to(box, { y: y }, time, ease, Laya.Handler.create(this, () => {
            if (area && cb) cb.call(area);
        }));
    }

    /**移动xy到目标位置*/
    public static AniMoveTo(box, vect: Laya.Vector2, time = 200, ease = Laya.Ease.backInOut, area?: any, cb?: Function) {
        Laya.Tween.to(box, { x: vect.x, y: vect.y }, time, ease, Laya.Handler.create(this, () => {
            if (area && cb) cb.call(area);
        }));
    }

    /**序列帧动画
     * @param filename 文件名
     * 
    */
    public static PlayFramesAniByFile(filename: string, x: number, y: number, frames, interval: number = 80) {

        let roleAni = new Laya.Animation();
        roleAni.loadAtlas(filename, Laya.Handler.create(this, () => {
            roleAni.interval = interval;
            roleAni.x = x;
            roleAni.y = y;
            //roleAni.play(0, false, name);
            roleAni.play(0, false);
            roleAni.addLabel("finish", frames);
            roleAni.on(Laya.Event.LABEL, this, (tag) => {
                if (tag == 'finish')
                    roleAni.removeSelf();
            });
        }));
        return roleAni;
    }

    /**旋转
     * @param box 旋转对象
     * @param rot 旋转角度
     * @param time 消耗时间
     * @param ease 缓动函数
     * 
     */
    public static AniRotate(box: Laya.Sprite, rot: number, time = 200, ease = Laya.Ease.linearNone, area?, cb?) {
        Laya.Tween.to(box, { rotation: rot }, time, ease,
            Laya.Handler.create(this, () => {
                if (area && cb) cb.call(area);
            })
        );
    }


}