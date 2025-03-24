import { ScreenAdapter } from "../../../../../G";

interface IMainViewSkin {
    /** 适配中心容器 其他UI子对象以此为参考进行适配*/
    bottomAdaptation: Laya.Sprite;
    adb:Laya.Sprite;
    bg:Laya.Image;
}

/**主界面适配 */
export class MainViewAdaptation {
    private _pos: Laya.Point;
    /**适配中心容器的偏移值 */
    private initY: number;
    skin: IMainViewSkin;

    private bgOffsetY:number;
    init() {
        this.initY = this.skin.bottomAdaptation.y;
        this.bgOffsetY = this.skin.bg.y - this.skin.bottomAdaptation.y; 
    }

    layout() {
        
        let pos = (this.skin.adb.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.skin.adb.x, this.skin.adb.y));
        if (!this._pos) {
            this._pos = pos;
        }
        // LogSys.Log("pos===>" + JSON.stringify(this._pos));
        if (Laya.stage.height > ScreenAdapter.DefaultHeight) {
            let offsetY:number = 49;//底部控制的高度
            this.skin.bottomAdaptation.y =  this.initY + this._pos.y - ScreenAdapter.DefaultHeight - Math.abs(offsetY);
        }

        this.skin.bg.y = this.skin.bottomAdaptation.y + this.bgOffsetY;
    }

    private getTabBarHeight(){
        let systemInfo = wx.getSystemInfoSync()
        // px转换到rpx的比例
        let pxToRpxScale = ScreenAdapter.RefWidth / systemInfo.windowWidth;
        // 状态栏的高度
        let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale;
        // 导航栏的高度
        let navigationHeight = 44 * pxToRpxScale;
        // window的宽度
        let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
        // window的高度
        let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
        // 屏幕的高度
        let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
        // 底部tabBar的高度
        let tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight;
        return tabBarHeight;
    }
}