import { GameConfig } from "../../../../../../GameConfig";
import { InitConfig } from "../../../../../../InitConfig";
import { E } from "../../../../../G";
import { GuideModel } from "../../../guide/GuideModel";
import { ERedEnum } from "../../../main/model/ERedEnum";
import { ECommonClaimType, MainModel } from "../../../main/model/MainModel";
import { ComposeModel } from "../../ComposeModel";

export abstract class IDebugDecorator {
    protected target: IDebugDecorator;
    abstract onLoop(): void;
    clientCmd(str: string): boolean{
        if(this.target){
            return this.target.clientCmd(str);
        }
        return true;
    }
    /**
     * 解析GM命令
     */
    abstract parseCmd(str: string): void;
    abstract init();
    constructor(target?: IDebugDecorator) {
        this.target = target;
    }
}

export class BaseDebugShow extends IDebugDecorator{

    onLoop(): void {
        // throw new Error("Method not implemented.");
        // this.target.onLoop();
    }
    parseCmd(str: string): void {
        // throw new Error("Method not implemented.");
        // this.target.parseCmd(str);
    }
    init() {
        // throw new Error("Method not implemented.");
        // this.target.init();
    }
}

export class DebugTxtShow extends IDebugDecorator {
    private readonly fontSize:number = 24;
    parseCmd(str: string): void {
        this.target.parseCmd(str);
    }

    private tf: Laya.HTMLDivElement;

    private createLb(str: string, color: string = "#ffffff") {
        return `<span style='font:${this.fontSize}px' color='${color}'>${str}</span>`;
    }
    private cellInfo(type:ECommonClaimType){
        let model = MainModel.Ins;
        if(model.commonTimes){
            let obj = model.commonTimes.find(o => o.flag == type);
            if(obj){
                return `${obj.flag}-${obj.times}`
            }
        }
        return "";

    }
    private get guideInfo() {
        let model = MainModel.Ins;
        let s: string = "";
        if (model.commonTimes) {
            let val = model.red.getValByID(ERedEnum.PVE_MAIN_GUIDE);
            return "#" + this.cellInfo(ECommonClaimType.USE_PVE_GUIDE)+ "|" + this.cellInfo(ECommonClaimType.PVE_GUIDE_STATUS) + "|" + val + "#";
        }
        return s;
    }
    private tfHeight:number;

    private get fightStr(){
        let model = ComposeModel.Ins;
        if(model && model.ownerPlayer){
            return `[playerID:${model.ownerPlayer.playerId}-${model.enemyPlayer.playerId}]`;
        }
        return ""
    }

    onLoop() {
        this.target.onLoop();
        // if (this.isDebug) {
        let time = TimeUtil.timestamtoTime(TimeUtil.serverTime * 1000);
        let guide = GuideModel.Ins;

        // <span style='font:${fontSize}px' color='#ff0000'>${E.all_bin}</span><br>config:${StaticDataMgr.Ins.information}]

        let timeScale = Laya.Utils.getQueryString("timeScale") || 1;

        // this.createLb(`stopList:` + FightGuide.Ins.fightStopMgr.stopList.length) 
        let server: string = this.createLb(`${InitConfig.getServerIp()}`, "#00ff00");
        let s: string = this.createLb(`timeScale:${timeScale}`, "#00ff00") + "<br>" +
            this.createLb(`openid:`) + this.createLb(`${E.sdk.getOpenId()}`, "#00ff00") + this.createLb(`isWhite:[${E.sdk.isWhite}]`) +
            "<br>platform:" + initConfig.platform + ` sdk_platform:${E.get_SDK_platform()}` +
            `<br>spineCache:${GameConfig.spineCache}` +
            `<br>${this.guideInfo}` +
            `<br>fps:${Laya.Stat.FPS}` +
            `<br>${this.createLb(`cpu:[${Laya.Stat.cpuMemory}]`,"#00ff00")}` +
            `<br>${this.createLb(`gpu:[${Laya.Stat.gpuMemory}]`,"#00ff00")}` + 
            `<br>${this.createLb(`${this.fightStr}`,"#00ff00")}`;

        let asset: string = initConfig.asset;
        let res = this.createLb(asset, "#00ff00");

        let hash:string = "";
        if(MainModel.Ins.hash){
            hash = MainModel.Ins.hash.val;
        }

        let fid:number = 0;
        let curCfg = guide.curCfg;
        if(curCfg){
            fid = curCfg.f_id;
        }
        let s1 = "[taskid:"+guide.taskId + ",index:" + guide.index + "]";
        // taskId:${guide.taskId} index:${guide.index}
        this.tf.innerHTML = `[hash:${hash}]<br>服务器:${server}<br>${time}<br>${res}<br>chapter ${MainModel.Ins.pveChapterId} guide fid :${fid} ${s1}<br>${s}`;
        // ,${guide.index},${ButtonCtl.disable}
        this.tf.width = Laya.stage.width;
        Laya.stage.addChild(this.tf);
        // }
        if(!this.tfHeight){
            this.tfHeight = this.tf.displayHeight;
            // console.log(`cur tf's height is ${this.tfHeight}`);
            if(initConfig.Stat || Laya.Utils.getQueryString("Stat")){
                Laya.Stat.show(0,300);
            }
        }
    }
    private initTf() {
        let _timeLabel: Laya.HTMLDivElement = new Laya.HTMLDivElement();
        // _timeLabel.style.width = '750px';
        // _timeLabel.size(Laya.stage.width, Laya.stage.height);
        // _timeLabel.style.align = "left";
        _timeLabel.style.fontSize = this.fontSize;
        _timeLabel.y = 50;
        _timeLabel.style.color = "#ff0000";
        // _timeLabel.style.stroke = 2;
        // _timeLabel.style.strokeColor = "#ffffff";
        _timeLabel.mouseEnabled = false;
        return _timeLabel;
    }
    init() {
        this.target.init();
        if (!this.tf) {
            this.tf = this.initTf();
        }
        Laya.timer.frameLoop(1,this,this.onLoop);
    }
}