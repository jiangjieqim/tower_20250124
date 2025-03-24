
import { InitConfig } from "../../InitConfig";
import { E } from "../G";
import { ResItemGroup } from "../resouce/ResItemGroup";
import { EResPath } from "../resouce/ResPath";
import { ZipJson } from "./ZipJson";

interface Ijszip {
    files;
}

// export let JSZip = window["JSZip"];
/**配置表数据管理器
 * -所有读取的配表数据都在这里声明一个实例进行缓存，统一走这里调用
*/
export class StaticDataMgr extends Laya.EventDispatcher{
    // uiLoaded:boolean = false;
    public jsonList: ZipJson[] = [];
    public isLoaded:boolean = false;
    private bList: ByteCfg[] = [];
    private static _ins: StaticDataMgr;
    public static get Ins() {
        if (!this._ins) this._ins = new StaticDataMgr();
        return this._ins;
    }

    constructor() { 
        super();
    }

    private parseBs(bs: Laya.Byte) {
        let cnt = bs.readUint32();
        let list2 = [];
        for (let i = 0; i < cnt; i++) {
            // console.log("pos:",bs.pos);
            let len = bs.readUint32();
            let ns = new Laya.Byte();
            let ba = bs.readArrayBuffer(len);//bs.readUint8Array(bs.pos,len);//
            ns.writeArrayBuffer(ba);
            let b = new ByteCfg();
            b.init(ns);
            list2.push(b);
            // console.log(ns.length);
        }
        // if(HrefUtils.getHref("debug")=="1"){
            // console.log("parseBs:",cnt);
            // console.log(list2);
        // }
        this.bList = list2;
    }

    public getData(url) {
        let arr = url.split("/");
        let name = arr[arr.length - 1];
        let mName = name.split('.')[0];
        let node = this.haveName(mName);
        if (node) {
            return node;
        }
        for (let i = 0; i < this.jsonList.length; i++) {
            let jn: ZipJson = this.jsonList[i];
            if (jn.name == name) {
                return jn.getJson();
            }
        }
        return null;
    }

    private haveName(mName: string) {
        for (let i = 0; i < this.bList.length; i++) {
            let node:ByteCfg = this.bList[i];
            if (`cfg_${node.tableName}` == mName) {
                return node;
            }
        }
        return false;
    }
    public moduleJson:string;
    // public gameJson:string;
    private uiBin:string = "";
    private allBin:string = "";
    // private hashURL:string = "";
    public hasVal:string = "";
    public information:string = "";

    private checkConfig(bs:Laya.Byte){
        if(bs.length > bs.pos){
            //获取信息
            let branchname = bs.readUTFString();
            let writetime = bs.readInt32();
            // let _checkObj = JSON.parse(bs.readUTFString());
            // let hash = bs.readUTFString();
            this.information = JSON.stringify({name:branchname,time:writetime});
            console.log("branch:"+this.information);
            // let _platform = initConfig.platform;
            // if(_checkObj[_platform]){
            // let l:string[] = _checkObj[_platform];
            // if(l.indexOf(branchname) == -1){
            // E.debugMsgBox(`platform:${_platform},${branchname}配置错误`);
            // }
            // }
        }
    }
    private onLoadComplete(){
        this.isLoaded = true;
        let all = Laya.loader.getRes(this.allBin);

        // let gj = Laya.loader.getRes(StaticDataMgr.Ins.gameJson);
        // MainModel.Ins.gamejsonData = gj;

        LogSys.Log("StaticDataMgr onLoadComplete...");

        let data = all;
        
        let zip: Ijszip = JSZip(all);
        let buffer = zip.files['all.bin'].asArrayBuffer();
        data = buffer;

        let hash = zip.files['hash'].asArrayBuffer();
        
        if(hash){
            let _hashBs = new Laya.Byte();
            _hashBs.endian = Laya.Byte.LITTLE_ENDIAN;
            _hashBs.writeArrayBuffer(hash);
            _hashBs.pos = 0;
            let _hashStr =  _hashBs.readUTFBytes();
            console.log("hash:"+_hashStr);
            this.hasVal = _hashStr;
        }
        for (let i in zip.files) {
            if (i.indexOf('.json') != -1) {
                this.jsonList.push(new ZipJson(i, zip.files[i]));
            }
        }
        // LogSys.Log(`### moduleCfg:[${JSON.stringify(LoadUtil.GetJson(this.moduleJson))}]`);
     
        let bs = new Laya.Byte();
        bs.endian = Laya.Byte.LITTLE_ENDIAN;
        bs.writeArrayBuffer(data);
        bs.pos = 0;
        this.parseBs(bs);
        this.checkConfig(bs);
        //ui
        this.parseUI(this.uiBin);

        // let obj = Laya.Loader.getRes(this.gameJson);

        // this.hasVal = Laya.Loader.getRes(this.hashURL);
        // console.log(hash);

        this.event(Laya.Event.COMPLETE);

        E.MsgMgr.reset();
    }
    public langKey:string = "";
    
    public Init() {
        let asset: string = InitConfig.getAsset();
        this.allBin = E.all_bin+"?"+Math.random();
        this.uiBin = `${asset}${EResPath.UI}?${Math.random()}`;
        this.langKey = `${asset}${EResPath.LANG_CN}?${Math.random()}`;
        LogSys.Log("StaticDataMgr Init");
        // ResPath.Font.Lang + 
        /*
        let resList = [   { url: this.langKey, type: Laya.Loader.JSON },
            { url: this.allBin, type: Laya.Loader.BUFFER },
            { url: this.uiBin, type: Laya.Loader.BUFFER },
            // { url: this.gameJson, type: Laya.Loader.JSON },
            // { url: this.hashURL, type: Laya.Loader.TEXT },
        ];
        Laya.loader.load(resList,new Laya.Handler(this, this.onLoadComplete));
        */

        let _defaultRes = new ResItemGroup();
        _defaultRes.Add(this.langKey, Laya.Loader.JSON);
        _defaultRes.Add(this.allBin, Laya.Loader.BUFFER);
        _defaultRes.Add(this.uiBin, Laya.Loader.BUFFER);

        E.ViewMgr.Loading(_defaultRes, new Laya.Handler(this, this.onLoadComplete));

    }

    //解析ui
    private parseUI(ui_path:string){
        let uifile = Laya.loader.getRes(ui_path);
        let zip: Ijszip = JSZip(uifile);
        for(let fileName in zip.files){
            let _zipfile = zip.files[fileName];
            if(_zipfile._data){
                let _zipJson:ZipJson =  new ZipJson(fileName, _zipfile);
                _zipJson.isUI = true;
                let basePath =  Laya.URL.basePath;
                let uiURL = `${basePath}views${fileName}`
                Laya.Loader.loadedMap[uiURL] = _zipJson.getJson();//设置资源池
            }
        }

        // console.log(1);
        // this.uiLoaded = true;
    }
}