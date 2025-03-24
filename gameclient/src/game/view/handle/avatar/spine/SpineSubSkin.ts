import { AssetConfig } from "./AssetConfig";
import { SpineLoadCell } from "./SpineManager";
/**gm("carddiscard 2 4 200 10") */
export class SpineSubSkin{
    // public skel:Laya.SpineSkeleton;
    // public slotName:string;
    // public useImgUV:boolean;
    // public skelurl:string;
    //=======================================================
    // private url:string;
    private isLoaded:boolean = false;
    private _destoryed:boolean = false;
    private _GID:number;
    private callBack:Function;
    private that;
    private vo:SpineLoadCell;
    constructor(){
        this._GID = Laya.Utils.getGID();
    }

    public load(that,callBack:Function,vo:SpineLoadCell){
        this.that = that;
        this.callBack = callBack;
        this.vo = vo;
        LogSys.Log(this.toString()+`load...`);

        // let url = Laya.URL.formatURL(vo.url);
        // if(Laya.Loader._imgCache[url]){
        //     LogSys.Warn(this.toString()+`已经在加载中...`);
        //     return;
        // }
        let res = Laya.loader.getRes(vo.url);
        if(res){
            // LogSys.Log(this.toString() + `已经有了该资源`);
            this.onLoadComplete();
        }else{
            Laya.loader.load(this.vo.url,new Laya.Handler(this,this.onLoadComplete));
        }
    }

    private onLoadComplete() {
        this.isLoaded = true;
        if(this._destoryed){
        //     LogSys.Error(`${this.url} is already dispose... dispose angin!!!`);
        //     this.dispose();
        //     return;
            let s = `${this._GID} is stop... ${this.vo ? JSON.stringify(this.vo):""}`;
            // throw new Error(s);
            LogSys.Warn(s);
            return;
        }
        LogSys.Log(this.toString() + `onLoadComplete...`);
        if(this.callBack){
            this.callBack.call(this.that,this.vo);
        }
    }

    toString(){
        return `SpineSubSkin GID:${this._GID} [${this.vo.toString()}] _destoryed:${this._destoryed} isLoaded:${this.isLoaded} `;
    }
    dispose(){
        LogSys.Log(this.toString()+`dispose...`);

        if(this._destoryed){
            return;
        }

        this._destoryed = true;

        if(!this.isLoaded){
            return;
        }

        if (!AssetConfig.freeSlot) {
            return;
        }
        this.callBack = null;
        this.that = null;
        let tex: Laya.Resource = Laya.loader.getRes(this.vo.url);
        if (tex) {
            tex.destroy();
        } else {
            // LogSys.Warn(this.toString()+`资源已经被释放,dispose未找到资源[${this.url}]`);
        }
    }
}