import {EventCenter} from "./rb/EventCenter";
import { SoundManger } from "./rb/sound/SoundManager";

export class Global {

    

    private static _inst: Global;
    static get inst(): Global {
        if (!Global._inst) {
            Global._inst = new Global();
        }
        return Global._inst;
    }
    isTest = false;
    Version = '0.0.1';
    AppId = '';//wx7faac4c6b5328c46
    ServerUrl = "";// http://192.168.2.106:5564///"https://www.gdusoft.cn/saasApi/";//"https://newcar.51bkx.cn/"//"https://gtestsvr.kxtoo.com:1443/link/";"http://192.168.2.106:5564/"
  
    GameId = 719;
    CdnPath = '';//https://www.gdusoft.cn:8089/shejian/linshi/  

    static subPath = "embed/xiaogen/";//"embed/xiaogen/";//embed/shejian/ //https://y1ygame.oss-cn-shanghai.aliyuncs.com/front/atao/utils/linshi/embed/xiaogen

    static attachSubPath(res:any[]){
        for(let i=0;i<res.length;i++){
            res[i].url = Global.subPath + res[i].url;
        }
    }

    private constructor() {
        this.init();
        SoundManger.soundPath = Global.subPath;
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
    }

    init() {
        

    }

    dH = 1280;
    dW = 720;
    loadStartTime = 0;
    screenW: number;
    screenH: number;
   

    /**大于1表示设计宽高比大于实际宽高比 小于1表示相反 */
    DCompS = 1;

    whScale = 1;

    initScale(screenW: number, screenH: number) {
        this.onResize();
    }

    onResize() {

        // console.log(".........onstage resize");
        this.screenH = Laya.Browser.height;
        this.screenW = Laya.Browser.width;
        
        let sComp = this.screenW / this.screenH;
        let dComp = this.dW / this.dH;
       
        this.DCompS = dComp / sComp;

        if (this.DCompS < 1) {
            this.whScale = this.getRealH() / this.dH;
        }
        else {
            this.whScale = this.getRealW() / this.dW;
        }

        EventCenter.inst.event(EventCenter.ON_STAGE_RESIZE);
    }

    public getRealH(): number {
        if (this.DCompS < 1) {
            return Laya.stage.height;
        }
        else {
            return Laya.stage.height;//Laya.stage.width*this.dH/this.dW;
        }
    }

    public getRealW(): number {
        if (this.DCompS < 1) {
            return Laya.stage.width;//return Laya.stage.height * this.dW/this.dH;
        }
        else {
            return Laya.stage.width;
        }
    }

    

}