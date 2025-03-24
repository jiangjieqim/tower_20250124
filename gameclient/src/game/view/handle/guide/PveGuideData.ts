import { E } from "../../../G";
import { BaseCfg } from "../../../static/json/data/BaseCfg";
import { t_FightStyle } from "../compose/adapter/FightTypeAdapter";
import { EBattle_Config, t_Battle_Config } from "../compose/t_Battle_Config";
import { EFightMode } from "../compose/vos/EFightEnum";
import { ItemViewFactory } from "../main/model/ItemViewFactory";
import { MainModel } from "../main/model/MainModel";
import { ECellType } from "../main/vos/ECellType";
import { BaseGuide } from "./BaseGuide";
import { FightGuideUtils } from "./FightGuideUtils";
import { FightStopMgr } from "./FightStopMgr";
import { GuideModel } from "./GuideModel";
class t_PVE_Guide_Init extends BaseCfg {
    GetTabelName() {
        return "t_PVE_Guide_Init";
    }
    private static _ins: t_PVE_Guide_Init;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_PVE_Guide_Init();
        }
        return this._ins;
    }

    getVal(id:number){
        return (this.GetDataById(id) as Configs.t_PVE_Guide_Init_dat).f_param;
    }
}

export interface IPveGuideData{
    guideTableName:string;
    selfId:number;
    enemyId:number;
    dispose();
    taskId: number;

    init();

    check(ms:number);

    sommonPriceItemId:number;
    // waveConfigStr:string;
    sommonPriceInitVal:number;
    sommonOffsetPrice:number;
    // ownerHerosPool:stElement[];

    //===========================================
    heroMythosConfigStr:string;
    composeHeroConfigStr:string;
    target:BaseGuide;
}

export class t_GuideChapter extends BaseCfg{
    static NAME:string = "t_GuideChapter";
    public GetTabelName(): string {
        return t_GuideChapter.NAME;
    }
}

// 64-fairyBtn|11-chatcon|11-banner|11-top_container-child0-leftplayer|11-top_container-child0-rightplayer
export class PveGuideData implements IPveGuideData{
    target:BaseGuide;
    // proxy:t_Tasks_Guide;
    /**神话的位置 */
    // fairyPos:string = ""
    /**引导流程配置 */
    guideTableName:string;
    /**波次数据  波次总时间-怪物id-怪物数量-出生间隔毫秒(默认不填使用速度)*/
    // waveConfigStr: string = "12-10001-20";
    
    /**英雄卡池数据  
     * 己方召唤英雄的卡池  
     * [heroid-xy坐标-num英雄数量-uid流水号]	
    */
    private heroPoolConfigStr:string = "";//"1-02-1-1|5-01-1-2|1-02-2-1|1-02-3-1";

    /**己方初始化货币数据 */
    // selfMoneyConfigStr:string =  `6-1000|7-4`;

    /**合成的英雄池子 */
    composeHeroConfigStr:string = `7-02-1-5`;

    // 14	0|15-22-1-8|0	获取的英雄(0代表此祈愿功能不可用)-x-y-uid,祈愿意获得1个英雄		
    /**祈愿卡池 */					
    // gambleConfigStr:string = `9-21-1-8|11-22-1-9|0`;

    //祈愿卡池数组
    gambleConfigArr1:string[]=[];
    gambleConfigArr2:string[]=[];
    gambleConfigArr3:string[]=[];


    /**神话英雄配置 */
    heroMythosConfigStr:string = "";//"02-8";
    // private table:string = "";
    //=============================================================

    /**每次召唤的价格 */
    sommonOffsetPrice;
    /**召唤的道具id */
    sommonPriceItemId: number;
    /**召唤初始值 */
    sommonPriceInitVal: number;


    //================================================================================
    selfId:number;
    enemyId:number;
    // curWave: number;
    taskId: number;
    private fightStopMgr:FightStopMgr;
    // 7	12-10001-20|11-10002-20|18-10003-1	波次需要的时间-怪物id-怪物数量							
    constructor() {
        //英雄卡池
        // 5	7-02-1-1|1-01-1-2|4-00-1-3|9-12-1-4|2-11-1-6|11-10-1-7	己方召唤英雄的卡池--->fid(t_Hero配置的f_heroid)-xy坐标-num英雄数量-uid流水号							
    }

    dispose(){
        if(this.fightStopMgr){
            this.fightStopMgr.dispose();
            this.fightStopMgr = null;
        }
    }
    private initGambleArr(s:string){
        let a1 = s.split(";");
        for(let i = 0;i < a1.length;i++){
            if(!StringUtil.IsNullOrEmpty(a1[i])){
                let a2 = a1[i].split("|");
                for(let n = 0;n < a2.length;n++){
                    if(!StringUtil.IsNullOrEmpty(a2[n])){
                        this[`gambleConfigArr${(i+1)}`].push(a2[n]);
                    }
                }
            }
        }
    }

    private clearMoney(){
        let list = ItemViewFactory.convertCellList(`${ECellType.FIGHT_MONEY}-0|${ECellType.FIGHT_STONE}-0`);
        FightGuideUtils.setMoney(list);
    }

    private initDebugParam(){
        let _id:number;
        if(Laya.Utils.getQueryString("pveChapterId")){
            _id = parseInt(Laya.Utils.getQueryString("pveChapterId"));
        }

        if(initConfig.pveChapterId){
            _id = initConfig.pveChapterId;
        }
        if(_id){
            MainModel.Ins.pveChapterId = _id;
        }
    }

    init() {
        
        //================================
        this.initDebugParam();

        let chapterId:number = MainModel.Ins.pveChapterId;
        let chaperCfg:Configs.t_GuideChapter_dat = E.tableMgr.getTable(t_GuideChapter.NAME).GetDataById(chapterId);
        if(!chaperCfg){
            LogSys.Error(`chapterId:${chapterId}配置异常`);
            return;
        }

        this.guideTableName = chaperCfg.f_flow;//`t_PVE_Tasks_Guide${chapterId}`;
        // let stopTableName = chaperCfg.f_stop_check;//`t_PVE_Guide_Next${chapterId}`;
        // this.fairyPos = "";
        // this.selfMoneyConfigStr = "";
        this.taskId = 0;

        this.clearMoney();

        switch(chapterId){
            case 1:
                this.heroPoolConfigStr = t_PVE_Guide_Init.Ins.getVal(2);//"1-02-1-1|5-01-1-2|1-02-2-1|1-02-3-1";
                this.composeHeroConfigStr = t_PVE_Guide_Init.Ins.getVal(3);//`7-02-1-5`;
                this.initGambleArr(t_PVE_Guide_Init.Ins.getVal(4));
                break;
            case 2:
                // this.waveConfigStr = t_PVE_Guide_Init.Ins.getVal(5);//"12-10019-2-1000|18-10-1-1000";

                // 2,7，2,2,15，1,6,3,4,8,10,11,13,12,14


                // 当进行5次召唤后，任务面板会更新（召唤的英雄id：2,7，2,2,15，1,6,3,4,8,10,11,13,12,14,）
                this.heroPoolConfigStr = t_PVE_Guide_Init.Ins.getVal(6);//"2-02-1-1|7-02-1-2|2-02-2-1|15-02-1-3|9-02-1-4|2-02-3-1|6-02-1-5|3-02-1-6";
                
                // this.selfMoneyConfigStr = "";//"6-200";//|7-4
                this.composeHeroConfigStr = t_PVE_Guide_Init.Ins.getVal(7);//`7-02-1-5`;

                /*
                蓝色祈愿英雄池：10,8,10
                紫色祈愿英雄池：13,12,14
                橙色祈愿英雄池：19,18,17
                */  
                this.initGambleArr(t_PVE_Guide_Init.Ins.getVal(8));
                this.heroMythosConfigStr = t_PVE_Guide_Init.Ins.getVal(9);//"00-8";//"02-8";//
                // this.fairyPos = "00";
                break;
            case 4:
                // sommonMoneyConfigId = 60;
                break;
            default:
                LogSys.Log(`使用章节引导id${chaperCfg}`);
                break;
        }
        //召唤价格的配置
        
        

        //================================
        if(!StringUtil.IsNullOrEmpty(chaperCfg.f_stop_check)){
            this.fightStopMgr = new FightStopMgr();
            this.fightStopMgr.init(chaperCfg.f_stop_check);
        }
        //===============================================
        this.refresh();
    }

    private refresh(){
        let proxy = GuideModel.Ins.getTable(this.guideTableName);
        this.selfId =  MainModel.Ins.mRoleData.AccountId;
        this.enemyId = this.selfId + 1;
        this.target.createHeroPool(this.heroPoolConfigStr);
        GuideModel.Ins.proxy = proxy;
        GuideModel.Ins.taskId = this.taskId;
        // FightGuideUtils.createRoomInfo(this.selfId,this.enemyId,EFightMode.PVE);

        //============================================= 创建房间
        let cfg: Configs.t_Tasks_Guide_dat = proxy.List[0];
        if (cfg.f_param) {
            let obj = FightGuideUtils.createRoom(cfg.f_param);
            if(obj){
                this.initSommon(obj.mode);
                FightGuideUtils.createRoomInfo(this.selfId, this.enemyId, obj.mode, obj.lv, obj.nickName, obj.trophy, obj.headUrl,obj.ownerMonsterMaxCount,obj.enemyMonsterMaxCount);
            }else{
                LogSys.Error(`${proxy.GetTabelName()} 第一条数据必须为房间信息`);
            }
        }
    }

    private initSommon(mode:EFightMode){
        let cfg:Configs.t_FightStyle_dat = E.tableMgr.getTable(t_FightStyle.NAME).GetDataById(mode);
        let sommonMoneyConfigId:number = cfg.f_sommon_id;//EBattle_Config.SommonMoney;
        let itemArr = t_Battle_Config.Ins.getValueById(sommonMoneyConfigId).split("-");
        let itemonceArr = t_Battle_Config.Ins.getValueById(sommonMoneyConfigId+1).split("-");
        this.sommonOffsetPrice = parseInt(itemonceArr[1]);
        this.sommonPriceItemId = parseInt(itemArr[0]);
        this.sommonPriceInitVal = parseInt(itemArr[1]);
    }

    check(ms:number){
        return this.fightStopMgr && this.fightStopMgr.check(ms);
    }
}