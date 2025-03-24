import { InitConfig } from "../../../../../InitConfig";
import { IWeixin_ext } from "../vos/Iweixin_ext";

class CellVo{
    // https://winserver.game.wanhuir.com:8002/project1/Client/trunk/rev_out/e/1675669008/remote/font/yourfont.ttf
    //remote/font/yourfont.ttf
    url:string;

    //1675669008
    key:string;
    public get fontName(){
        let arr = this.url.split("/");
        let a = arr[arr.length-1];
        return a.split(".")[0];
    }

    public get fontUrl(){
        let asset:string = InitConfig.getAsset();
        let a = "";
        if(this.key){
            a = `e/${this.key}/`;
        }
        let u = `${asset}${a}${this.url}`;
        return u;
    }
}
export class FontLoad extends Laya.EventDispatcher{
    public fontKey = {};
    public wx_ext:IWeixin_ext;
    private l:CellVo[] = [];
    public load(_jsonData:any,url:string){
        let key:string = _jsonData[url];
        let vo = new CellVo();
        vo.key = key;
        vo.url = url;
        this.l.push(vo);
    }

    public start(){
        if(this.l.length > 0){
            let vo = this.l.shift();
            let that = this;
            this.wx_ext.loadFont(vo.fontUrl,vo.fontName,(outFontName)=>{
                let t:FontLoad = that;
                t.fontKey[vo.fontName] = outFontName;
                t.start();
            })
        }else{
            LogSys.Log("FontLoad start:["+JSON.stringify(this.fontKey)+"]");
            this.event(Laya.Event.COMPLETE);
        }
    }
}