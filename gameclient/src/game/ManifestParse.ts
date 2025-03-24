import { InitConfig } from "../InitConfig";
import { EMsgBoxType, EViewType } from "./common/defines/EnumDefine";
import { E } from "./G";
import { ResItemGroup } from "./resouce/ResItemGroup";
import { EResPath, Path } from "./resouce/ResPath";
function addVersionPrefix(url: string) {
    let key = Laya.ResourceVersion.manifest;
    let arr = url.split("?");
    if (arr.length > 1) {
        url = arr[0];
    }
    if (url && key[url]) {
        let u;
        if (arr.length > 1) {
            u = key[url] + "?" + arr[1];
        } else {
            u = key[url];
        }
        // return `${ResVer.G}/${u}`;
        return "e/" + u  + "/" + url;
    }
    return url;
}
// export class ManifestParse {
//     private _end: Laya.Handler;
//     private mManifestUrl: string;
//     constructor(end: Laya.Handler) {
//         this._end = end;
//         let fManifestUrl: string = `${InitConfig.getAsset()}manifest.json?${Math.random()}`;
//         this.mManifestUrl = fManifestUrl;
//         LogSys.Log("fManifestUrl:"+fManifestUrl);

//         Laya.loader.load(fManifestUrl, new Laya.Handler(this, this.onLoadComplete), null, Laya.Loader.JSON);
//     }
//     private onLoadComplete() {
//         let data = Laya.Loader.getRes(this.mManifestUrl);
//         // LogSys.Log("load end:"+JSON.stringify(data));

//         Laya.ResourceVersion.manifest = data;
//         Laya.URL.customFormat = addVersionPrefix;
        
//         E.sdk.loadFont(data,new Laya.Handler(this,this.onEndHandler));
//     }

//     private onEndHandler(){
//         this._end.run();
//     }
// }

export class LoadMainnfestParse{
    private _end: Laya.Handler;
    public data:string;
    private mManifestUrl: string;
    constructor(end: Laya.Handler) {
        this._end = end;
        let fManifestUrl: string = `${InitConfig.getAsset()}manifest.json?${Math.random()}`;
        this.mManifestUrl = fManifestUrl;
        LogSys.Log("fManifestUrl:"+fManifestUrl);

        // Laya.loader.load(fManifestUrl, new Laya.Handler(this, this.onLoadComplete), null, Laya.Loader.JSON);
    
        let _defaultRes = new ResItemGroup();
        _defaultRes.Add(fManifestUrl,Laya.Loader.JSON);
        E.ViewMgr.Loading(_defaultRes,new Laya.Handler(this,this.onLoadComplete));
    }
    private onLoadComplete() {
        
        let data = Laya.Loader.getRes(this.mManifestUrl);
        if(!data){
            E.ViewMgr.Open(EViewType.MsgBoxNormal,null,"网络异常")
            return;
        }

        data["o/config/game.json"] = null;
        data[EResPath.LANG_CN] = null;
        // LogSys.Log("load end:"+JSON.stringify(data));
        this.data = data;
        Laya.ResourceVersion.manifest = data;
        Laya.URL.customFormat = addVersionPrefix;
        
        // E.sdk.loadFont(data,new Laya.Handler(this,this.onEndHandler));
        this._end.runWith(this);
    }
}