import { ISpineTempletTower } from "./spine/ISpineTemplet";
import { IMSpineRegions, SubBitmapUtils, TextureAtlasReader } from "./SpineSwitchSkin";


class MAssetManager extends spine.AssetManager{
    succeed:boolean = false;
    private _newTex:Laya.Texture;
    constructor(textureLoader, pathPrefix = ""){
        super(textureLoader,pathPrefix);
    }

    // parseWidthHeight(text){
    //     let lines = text.split(/\r\n|\r|\n/);
    // }

    public get mPathPrefix(){
        return this['pathPrefix'];
    }

    public get mAssets(){
        return this['assets'];
    }
    //override
    loadTextureAtlas(path) {
        // console.log(path);
        path = this.mPathPrefix + path;
        let atlasData = Laya.loader.getRes(path);
        if(!atlasData){
            // throw new Error("atlasData cannot be null.");
            console.error("atlasData cannot be null.");
            return;
        }
        this.succeed = true;
        // console.log(path);

        // let reader = new TextureAtlasReader(atlasText);
        let reader = new TextureAtlasReader(atlasData);
        reader.readLine();
        reader.readLine();

        let tuple = new Array(4);
        if (reader.readTuple(tuple) == 2) {
            let atlas = new spine.TextureAtlas(atlasData, (path) => {
                return this.loadTextureV(path, parseInt(tuple[0]),parseInt(tuple[1]));
            });
            this.mAssets[path] = atlas;
        }
       
    }

    public loadTextureV(path:string,w:number,h:number) {

        //188,492
        // super.loadTexture(path,success,error);

        path = this.mPathPrefix + path;
        // let storagePath = path;
        // if(this)
        // console.log(this.getToLoad());
        // this['toLoad']--;
        // this['loaded']++;

        //构建一个自定义纹理
        // let w = this.mWidth;
        // let h = this.mHeight;
    
        // let ftex:Laya.Texture = Laya.loader.getRes(`res/spine_export/hero/hero.png`);//模板纹理
        
        //构建一个纹理
        let tex:Laya.Texture = new Laya.Texture();
        
        // tex.bitmap = new Laya.Texture2D(ftex.)
        
        tex.bitmap = new Laya.Texture2D(w,h,Laya.TextureFormat.R8G8B8A8,false);
        this._newTex = tex;
        
        // let texData = ftex.getPixels(0,0,ftex.width,ftex.height);

        // let texData = ftex.getTexturePixels(0, 0, ftex.width, ftex.height);
        // let t1 = ftex.getPixels(0, 0, ftex.width, ftex.height);
        
        let ret = new Uint8Array(w * h * 4);
        tex.bitmap.setPixels(ret);//t1  填充像素数据
        
        // tex.bitmap.setSubPixels(0,0,ftex.width,ftex. ,texData,1);

        // tex
        let texture = this['textureLoader'](tex);

        //################################################
        /*
        let sp:Laya.Sprite = new Laya.Sprite();
        sp.graphics.drawRect(0,0,tex.width,tex.height,null,"#ff0000",1);
        sp.texture = texture;
        sp.alpha = 0.5;
        sp.x = Math.random() * Laya.stage.width;
        // sp.graphics.drawTexture(tex,0,0,ftex.width,ftex.height);
        Laya.stage.addChild(sp);
        */
        //################################################
        //let texture = this['textureLoader'](Laya.loader.getRes(path));
        this.mAssets[path] = texture;
        // if(success){
            // success(path,texture);
        // }
        // tex.disposeBitmap();//销毁纹理数据
        return texture;
    }

    // public disposeTex(){
    //     if(this._newTex){
    //         this._newTex.destroy();
    //     }
    // }
    
}


//自定义Spine模板
export class SpineTemplet_3_8_v1 extends Laya.SpineTempletBase implements ISpineTempletTower{
    public mUrl:string;
    public used:boolean  =false;//是否使用中
    public jsonOrSkelUrl:string;
    private assetManager:MAssetManager;
    private _textureDic;
    private clientId:string;
    private atlasUrl:string;
    private skeletonBinary:spine.SkeletonBinary;
    // private skeletonJson:spine.SkeletonJson;
    private fileName:string;
    private _sourceUrlList:string[] = [];
    constructor() {
        super();
        // this._textureDic = {};
        // console.log(1);
    }

    loadAni(jsonOrSkelUrl:string) {
        this.mUrl = jsonOrSkelUrl;
        let splitIndex = jsonOrSkelUrl.lastIndexOf("/") + 1;
        let clientId = jsonOrSkelUrl.slice(0, splitIndex);
        jsonOrSkelUrl = jsonOrSkelUrl.slice(splitIndex);
        let atlasUrl = jsonOrSkelUrl.replace(".json", ".atlas").replace(".skel", ".atlas");
        this._textureDic.root = clientId;
        this.clientId = clientId;
        this.atlasUrl = atlasUrl;
        this.jsonOrSkelUrl = jsonOrSkelUrl;
        this.fileName = jsonOrSkelUrl.split(".")[0];
        this.assetManager = new MAssetManager(this._textureLoader.bind(this), clientId);
        
        this.assetManager.loadTextureAtlas(atlasUrl);
        if(this.assetManager.succeed){
            Laya.timer.frameOnce(1, this, this.loop);
        }
    }

    _textureLoader(tex) {
        let tTexture = this._textureDic[this.fileName+".png"] = new Laya.SpineGLTexture(tex.bitmap);
        return tTexture;
    }
    loop() {
        if (this.assetManager.isLoadingComplete()) {
            this.parseSpineAni();
            return;
        }
        if (this.assetManager.hasErrors()) {
            this.event(Laya.Event.ERROR, "load failed:" + this.assetManager.getErrors());
            return;
        }
        Laya.timer.frameOnce(1, this, this.loop);
    }
    parseSpineAni() {
        if (this.isDestroyed) {
            this.destroy();
            return;
        }
        let atlas = this.assetManager.get(this.atlasUrl);
        let atlasLoader = new spine.AtlasAttachmentLoader(atlas);
        // if (this.jsonOrSkelUrl.endsWith(".skel")) {
        this.skeletonBinary = new spine.SkeletonBinary(atlasLoader);
        // let temp =  this.assetManager.get(this.jsonOrSkelUrl);
        let buffer = Laya.loader.getRes(this.clientId+this.jsonOrSkelUrl);
        this.skeletonData = this.skeletonBinary.readSkeletonData(new Uint8Array(buffer));
        // }
        // else {
        //     this.skeletonJson = new spine.SkeletonJson(atlasLoader);
        //     this.skeletonData = this.skeletonJson.readSkeletonData(this.assetManager.get(this.jsonOrSkelUrl));
        // }
        this.event(Laya.Event.COMPLETE, this);
    }
    buildArmature() {
        return super.buildArmature();
    }
    getAniNameByIndex(index) {
        return super.getAniNameByIndex(index);
    }
    getSkinIndexByName(skinName) {
        return super.getSkinIndexByName(skinName);
    }
    destroy() {
        // this.assetManager.disposeTex();
        super.destroy();
    }

    //清理一个部位 avatar.templet.clearPart("weapon");
    public clearPart(part:string){
		SubBitmapUtils.ClearPart(this.assetManager,this.fileName,part);
    }

    private onLoadComplete(fileList,sourceUrl:string,part:string,callBack:Laya.Handler){
        let index:number = this._sourceUrlList.indexOf(sourceUrl);
        if(index!=-1){
            this._sourceUrlList.splice(index,1);
        }
        let sourceBitmap:Laya.Texture = Laya.Loader.getRes(sourceUrl);//set can read 这里的sourceBitmap的_canRead属性是false 会触发laya.core.js 7752 pix = tex2d.getPixels()的异常。
        SubBitmapUtils.Build(this.assetManager,this.fileName,sourceBitmap,fileList,part,part);
        if(callBack){
            callBack.run();
        }
    }

    /**
     * 替换一个部位的纹理
     * @param part 
     */
    public setSkin(fileList: IMSpineRegions[], sourceUrl: string, part: string, callBack: Laya.Handler = null) {
        let sourceBitmap:Laya.Texture = Laya.Loader.getRes(sourceUrl);
        this._sourceUrlList.push(sourceUrl);
        if(!sourceBitmap){
            Laya.loader.load(sourceUrl,new Laya.Handler(this,this.onLoadComplete,[fileList,sourceUrl,part,callBack]),null,Laya.Loader.IMAGE);
        }else{
            this.onLoadComplete(fileList,sourceUrl,part,callBack);
        }
    }
    public get tex():Laya.SpineGLTexture{
        return this._textureDic[this.fileName+".png"];
    }
    public set tex(v:Laya.SpineGLTexture){
        this._textureDic[this.fileName+".png"] = v;
    }
    public fillSkin(pixel:Uint8Array,part:string){
        SubBitmapUtils.Fill(this.assetManager,this.fileName,part,pixel);
    }

    public fillRect(pixel:Uint8Array,x:number,y:number,w:number,h:number){
        let targetBitmap = this.assetManager.get(`${this.fileName}.png`).bitmap;
		// let target:IMSpineRegions = this.getTarget(asset,key,part);
		targetBitmap.setSubPixels(x,y,w,h,pixel);
    }

    private onLoadUrlComplete(sourceUrl:string,part:string,callBack:Laya.Handler){
        let _tex:Laya.Texture = Laya.loader.getRes(sourceUrl);
        if(_tex){
            this.fillSkin(_tex.getPixels(0,0,_tex.width,_tex.height),part);
        }
        if(callBack){
            callBack.run();
        }
    }

    public fillSkinByUrl(sourceUrl:string,part:string,callBack:Laya.Handler){
        let sourceBitmap:Laya.Texture = Laya.Loader.getRes(sourceUrl);
        if(!sourceBitmap){
            Laya.loader.load(sourceUrl,new Laya.Handler(this,this.onLoadUrlComplete,[sourceUrl,part,callBack]),null,Laya.Loader.IMAGE);
        }else{
            this.onLoadUrlComplete(sourceUrl,part,callBack);
        }
    }
}