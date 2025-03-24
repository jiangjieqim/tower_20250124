import { E } from "../../game/G";
import { AssetConfig } from "../../game/view/handle/avatar/spine/AssetConfig";

export class GameList extends Laya.List{
    /**裁剪Y偏移
     * 例如 -10在原height 高度向上偏移-10,裁剪区变大*/
    mClipY:number = 0;

    disableScroll:boolean = false;
    onScrollBarChange(e = null) {
        if(this.disableScroll){
            return;
        }
        super.onScrollBarChange(e);
    }
    constructor(){
        super();
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onUnDisplay(){
        this.disableScroll = false;
    }

    get cells(){
        return this._cells;
    }

    debugDrawRect(){
        DebugUtil.draw(this,"#ff0000",this.width,this.height-this.mClipY,0,this.mClipY);
    }
}

export class GamePanel extends Laya.Panel{
    disableScroll:boolean = false;
    constructor(){
        super();
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onUnDisplay(){
        this.disableScroll = false;
    }
}

/**该纹理对象会在引用计数器完成的时候 对ui进行重载 */
export class GameImage extends Laya.Image{
    constructor(){
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }
    private onDisplay(){
        E.EventMgr && E.EventMgr.on(EventID.TextureDestroy,this,this.onReloadImage);
    }

    private onReloadImage(obj){
        let url = obj.url;
        if(url == this.skin){
            // this.skin = null;
            this.clear();
            this.skin = url;
            LogSys.Log(`................TextureDestroy onReloadImage set url ${url}`);
        }
    }

    private onUnDisplay(){
        // Laya.Loader.clearTextureRes(this.skin);
        E.EventMgr && E.EventMgr.off(EventID.TextureDestroy,this,this.onReloadImage);
    }

    clear(){
        this.skin = "";
    }
}
export class GameTex extends Laya.Image{
    /**激活清理纹理 */
    enableClearTex:boolean = true;
    constructor(){
        super();
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
    }

    private onDisplay(){
        LogSys.Log(`${this.name}: ${this.skin} is display`);
    }
    private onUnDisplay() {
        this.clearTex();
    }

    clearTex() {
        // LogSys.Log(`${this.name}: clearTex ${this.skin}`);
        if (this.enableClearTex) {
            AssetConfig.clearTextureRes(this.skin);
        }
    }

}