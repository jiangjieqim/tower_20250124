import { E } from "../../game/G";
import { GameImage, GameList, GamePanel, GameTex } from "./GameList";

export function overrideCore() {
    // Laya.Panel.prototype['__defineSetter__']("disableScroll", function (value: boolean) {
    //     this._disableScroll = value;
    //     // console.log(`Set disableScroll is ${value}`);
    // });

    // Laya.Panel.prototype['__defineGetter__']("disableScroll", function () {
    //     // console.log(`Get disableScroll is ${this._disableScroll}`);
    //     return this._disableScroll;
    // });

    // Laya.List.prototype['__defineSetter__'] = function (value: boolean) {
    //     this._disableScroll = value;
    // }

    // Laya.List.prototype['__defineGetter__'] = function () {
    //     return this._disableScroll;
    // }
    Laya.ClassUtils.regClass("GameList", GameList);
    Laya.ClassUtils.regClass("GamePanel", GamePanel);
    Laya.ClassUtils.regClass("GameImage", GameImage);
    Laya.ClassUtils.regClass("GameTex", GameTex);

    //#region spine
    function loadTextureSucceed(that, path, success) {
        let texture = that.textureLoader(Laya.loader.getRes(path));
        that.assets[path] = texture;
        that.toLoad--;
        that.loaded++;
        if (success) {
            success(path, texture);
        }
    }

    /** 
     * 重写Spine接口   spine-core-3.8.js --->loadTexture line:2249
     * 原因 spine的loadTexture未检查Laya缓存中是否有纹理数据
     * 解决重复加载纹理 缓存池的BUG
    */
    spine.AssetManager.prototype.loadTexture = function (path, success = null, error = null) {
        path = this.pathPrefix + path;
        this.toLoad++;

        let res = Laya.loader.getRes(path);
        if (res) {
            loadTextureSucceed(this, path, success);
            return;
        }

        Laya.loader.load([{ type: Laya.Loader.IMAGE, url: path }], Laya.Handler.create(this, (re) => {
            if (re) {
                loadTextureSucceed(this, path, success);
            } else {
                this.errors[path] = `Couldn't load image ${path}`;
                this.toLoad--;
                this.loaded++;
                if (error)
                    error(path, `Couldn't load image ${path}`);
            }
        }));
    }
    //#endregion


    function refreshImage(_url:string){
        if(E.ViewMgr){
            let obj = {url:_url};
            E.EventMgr.emit(EventID.TextureDestroy,obj);
        }
    }

    /**
     * Laya.Image 引用的texture如果在其他地方被释放 就会一同被释放掉,它们用的是同一个引用
     */

    /*
        重写laya.core.js line 7835 Laya.Texture.destory(...)方法
    */
    Laya.Texture.prototype.destroy = function(force = false) {
        if (!this._destroyed) {
            this._destroyed = true;
            var bit = this._bitmap;
            let _needRefresh:boolean = false;
            if (bit) {
                bit._removeReference(this._referenceCount);
                if (bit.referenceCount === 0 || force){
                    bit.destroy();
                    //引用计数器为0,真正销毁纹理
                    if(this.url){
                        _needRefresh = true;
                    }
                }
                bit = null;
            }
            if (this.url && this === Laya.loader.getRes(this.url)){
                Laya.Loader.clearRes(this.url);
            }
            if(_needRefresh){
                refreshImage(this.url);
            }
        }
    }
    
    Laya.Loader.cacheRes = function(url:string,data){
        url = Laya.URL.formatURL(url);
        if (Laya.Loader.loadedMap[url] != null) {
            if(debug){
                console.warn("Resources already exist,is repeated loading:", url);
            }
        }
        else {
            if (data instanceof Laya.Texture) {
                Laya.Loader.loadedMap[url] = data.bitmap;
                Laya.Loader.textureMap[url] = data;
            }
            else {
                Laya.Loader.loadedMap[url] = data;
            }
        }
    }

    /**重构精灵裁剪算法 */
    Laya.RenderSprite.prototype._clip = function(sprite, context, x, y){
        var next = this._next;
        if (next == Laya.RenderSprite.NORENDER)
            return;
        var r = sprite._style.scrollRect;
        var width = r.width;
        var height = r.height;
        if (width === 0 || height === 0) {
            return;
        }
        context.save();

        let oy = sprite.parent ? (sprite.parent.mClipY || 0) : 0;

        context.clipRect(x, y+oy, width, height-oy);
        next._fun.call(next, sprite, context, x - r.x, y - r.y);
        context.restore();
    }
}

/**
 * @param curUnits "M" "K" "int"
 */
export function buildDebugStat(curUnits:string = "M") {
    Laya.Stat['_StatRender'].createUIPre = function
        createUIPre(x, y) {
        var pixel = Laya.Browser.pixelRatio;
        let StatUI = Laya.Stat['_StatRender'];
        let that = StatUI;

        that._width = pixel * 360;
        that._vx = pixel * 120;
        that._height = pixel * (that['_view'].length * 12 + 3 * pixel) + 4;
        StatUI._fontSize = 12 * pixel;
        for (var i = 0; i < that._view.length; i++) {
            that._view[i].x = 4;
            that._view[i].y = i * StatUI._fontSize + 2 * pixel;
        }
        if (!that._canvas) {
            that._canvas = new Laya.HTMLCanvas(true);
            that._canvas.size(that._width, that._height);
            that._ctx = that._canvas.getContext('2d');
            that._ctx.textBaseline = "top";
            that._ctx.font = StatUI._fontSize + "px Arial";
            that._canvas.source.style.cssText = "pointer-events:none;background:rgba(150,150,150,0.5);z-index:100000;position: absolute;direction:ltr;left:" + x + "px;top:" + y + "px;width:" + (that._width / pixel) + "px;height:" + (that._height / pixel) + "px;";
        }
        if (!Laya.Browser.onKGMiniGame) {
            Laya.Browser.container.appendChild(that._canvas.source);
        }
        that._first = true;
        that.loop();
        that._first = false;
    }
    // let su = Laya.StatUI;
    Laya.Stat['_StatRender'].show = function
        show(x = 0, y = 0) {
        let that = Laya.Stat['_StatRender'];
        if (!Laya.Browser._isMiniGame && !Laya.Render.isConchApp)
            that['_useCanvas'] = true;
        that['_show'] = true;
        Laya.Stat['_fpsData'].length = 60;
        that['_view'][0] = { title: "FPS(WebGL)", value: "_fpsStr", color: "yellow", units: "int" };
        that['_view'][1] = { title: "Sprite", value: "_spriteStr", color: "white", units: "int" };
        that['_view'][2] = { title: "RenderBatches", value: "renderBatches", color: "red", units: "int" };
        that['_view'][3] = { title: "SavedRenderBatches", value: "savedRenderBatches", color: "white", units: "int" };
        that['_view'][4] = { title: "CPU", value: "cpuMemory", color: "yellow", units: curUnits };
        that['_view'][5] = { title: "GPU", value: "gpuMemory", color: "yellow", units: curUnits };
        that['_view'][6] = { title: "Shader", value: "shaderCall", color: "white", units: "int" };
        that['_view'][7] = { title: "Canvas", value: "_canvasStr", color: "white", units: "int" };
        if (Laya.Render.is3DMode) {
            that['_view'][0].title = "FPS(3D)";
            that['_view'][8] = { title: "TriFaces", value: "trianglesFaces", color: "white", units: "int" };
            that['_view'][9] = { title: "FrustumCulling", value: "frustumCulling", color: "white", units: "int" };
            that['_view'][10] = { title: "OctreeNodeCulling", value: "octreeNodeCulling", color: "white", units: "int" };
        }
        if (that['_useCanvas']) {
            that['createUIPre'](x, y);
        }
        else
            that['createUI'](x, y);
        that.enable();
    }
}