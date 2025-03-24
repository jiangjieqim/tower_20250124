import { EViewType } from "../../../../../common/defines/EnumDefine";
// import { EventID } from "../../../../../event/EventID";
import { E } from "../../../../../G";
import { LayerMgr } from "../../../../../layer/LayerMgr";
import { CommonClaimRewards_req, FightWin_req, MonsterEffect_revc, MonsterScale_revc, RougeList_revc, stBattleBuff, stCommonTimes, stElement, stFCard, stFuncCardEffect, stHero, stMonsterEffect, stMonsterEffectTarget, stMonsterScale, WatchCommonRankDetail_req, WaveSettleReward_revc } from "../../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { BaseCfgConstuctor } from "../../../../../static/json/data/BaseCfg";
import { FightGuideUtils } from "../../../guide/FightGuideUtils";
import { EGuideEvent, FuncOpenData, GuideModel } from "../../../guide/GuideModel";
import { GameEvent } from "../../../main/model/GameEvent";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { MainModel } from "../../../main/model/MainModel";
import { TowertMainCardModel } from "../../../towertmaincard/model/TowertMainCardModel";
import { t_Function_Card } from "../../../towertmaincard/proxy/t_Function_Card";
import { HeroListProxy } from "../../../towertmainhero/proxy/HeroProxy";
import { ComposeMythosVo } from "../../adapter/FightAdapter";
import { ComposeEvent } from "../../ComposeEvent";
import { ComposeModel } from "../../ComposeModel";
import { EResKey, FightFactory } from "../../FightFactory";
import { t_Monster_Template } from "../../t_Monster_Template";
import { ECreateHero, EEffectTarget } from "../../vos/EFightEnum";
import { FightValueConfig } from "../../vos/FightValueConfig";
import { BaseAdmissionShow, SlotImgs } from "../BaseAdmissionShow";
import { wingm } from "../FightDebugView";
import { FrameMonster } from "../FrameAvatar";
import { IPvproundResult } from "../PvproundResult";
import { DebugClientCmdBase } from "./DebugClientCmdBase";
import { DebugFightWalk } from "./DebugFightWalk";
import { IDebugDecorator } from "./DebugTxtShow";

//#region 塔防客户端GM和URL参数
/** 

========================================= URL参数 =========================================



*/
//#endregion
export class DebugClientCmd extends DebugClientCmdBase {

    constructor(target?: IDebugDecorator) {
        super(target);
        //=====================================================
        this.regFunc(this.help,`
        openui 56 1-20     heroid = 20
        openui 56 2-10     t_Monster_Template的f_monster_template_id = 10
        openui 56 3-2006   文件resource/o/spineframe/2006 resource/res/atlas/hero/2006
        `);
        this.regFunc(this.createHero);
        this.regFunc(this.watch_memory,"查看内存");
        this.regFunc(this.closeAll);
        this.regFunc(this.gc);
        this.regFunc(this.setCanHero);
        this.regFunc(this.clearTex);
        this.regFunc(this.delUid,"删除英雄");
        this.regFunc(this.table);
        this.regFunc(this.Stat);
        this.regFunc(this.StatHide);
        this.regFunc(this.openui);
        this.regFunc(this.closeui);
        this.regFunc(this.setFightStatus);
        this.regFunc(this.end,"结束战斗");
        this.regFunc(this.createMythos,"召唤神话");
        this.regFunc(this.open_pvpround_result);
        this.regFunc(this.composeMythos);
        this.regFunc(this.setPvpRoundStatus,"设置pvp回合制战斗状态");
        this.regFunc(this.updatePvpRoundStatus);
        this.regFunc(this.buffer);
        this.regFunc(this.iceMy);
        this.regFunc(this.on_pvp_round_reward);
        this.regFunc(this.onKickNtf);
        this.regFunc(this.pushCommonTimes);
        this.regFunc(this.throwErr);
        this.regFunc(this.createMonsters);
        this.regFunc(this.createAllHeros);
        this.regFunc(this.selfInfo);
        this.regFunc(this.playServerCard)
        this.regFunc(this.scaleMonster);
        // this.regFunc(this.showHeroId,"显示英雄");
        // this.regFunc(this.showMonsterTempId,"显示怪物");
        this.regFunc(this.monsterEffect,
`属性效果测试
attrid  uid     type
40003   21      1        ------>monster uid为21的怪物触发技能40003
40005   3       2    20  ------>hero uid为3的英雄触发技能40005  触发此技能的怪物uid为20
40006   1       2        ------>hero uid为1的英雄触发技能40006
40007   16000   3        ------>阵营playerid 为 16000的棋盘格触发技能40006

`);

        this.regFunc(this.setFps,"设置序列帧的fps");
    }

    // private showHeroId(p1:string){
    //     wingm(`openui 56 1-${parseInt(p1)}`);//heroId
    // }
    // private showMonsterTempId(p1:string){
    //     wingm(`openui 56 2-${parseInt(p1)}`) // 10代表tempId
    // }
    private setFps(p1:string){
        FightValueConfig.debugDelayMS = 1000/parseInt(p1);
    }
    private monsterEffect(p1:string,p2:string,p3:string,p4:string){
        let revc = new MonsterEffect_revc();
        let o = new stMonsterEffect();
        o.attrId = parseInt(p1);
        o.monsterUid = parseInt(p4||"0");
        let cell = new stMonsterEffectTarget();
        cell.uid = parseInt(p2);
        cell.type = parseInt(p3);
        o.datalist = [cell];
        revc.datalist = [o];
        this.model.onMonsterEffect(revc);
    }
    private scaleMonster(p1:string,p2:string){
        let revc = new MonsterScale_revc();
        revc.datalist = [];
        let vo = new stMonsterScale();
        vo.uid = parseInt(p1);
        vo.scale = parseInt(p2);
        revc.datalist.push(vo);
        E.EventMgr.emit(GameEvent.MonsterScale,revc);
    }

    private playServerCard(p1:string,p2:string){
        let playerId:number = p2 == "0" ? this.model.enemyPlayer.playerId : this.model.ownerPlayer.playerId;
        this.model.playCardOnce(parseInt(p1),98,EEffectTarget.Grid,playerId,0,22);
    }

    private selfInfo(){
        let req = new WatchCommonRankDetail_req();
        req.accountId = MainModel.Ins.mRoleData.AccountId;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private throwErr(){
        // throw new Error(`aaaaaaaaaaaaaaaaaaaaaaaaaaa`);
    //     let a;
    //     for(let i = 0;i < a.length;i++){
    //         console.log(a[i]);
    //     }
        Laya.Browser.window.onerror("aaaaaaaaaaaaaaa");    
    }

    private pushCommonTimes(p1:string,p2:string){
        let commonTimes = MainModel.Ins.commonTimes;
        let flag = parseInt(p1);
        let times = parseInt(p2);
        let vo = commonTimes.find(o=>o.flag == flag);
        if(vo){
            vo.times = times;
        }else{
            vo = new stCommonTimes();
            vo.flag = flag;
            vo.times = times;
            commonTimes.push(vo);
        }
    }

    private onKickNtf(p1:string){
        SocketMgr.Ins.KickNtfType = parseInt(p1);
        LayerMgr.Ins.onKickNtf();
    }
    private on_pvp_round_reward(p1:string,p2:string){
        let revc = new WaveSettleReward_revc();
        revc.wave = parseInt(p1);
        let list = ItemViewFactory.convertCellList(`6-2000|7-10000`);
        revc.itemlist = list;
        revc.win = parseInt(p2);
        E.ViewMgr.Open(EViewType.PvpRoundReward,null,revc);
    }


    private iceMy(p1:string){
        let o = new stFuncCardEffect();
        o.cardId = parseInt(p1);//6018;
        o.playerId = this.model.ownerPlayer.playerId;
        o.type= 3;
        o.uids = [];
        o.state = 1;
        o.serialNum = 1;
        this.model.parseCell(o);
    }

    private buffer() {
        let pvpRoundBuffs: stBattleBuff[] = [];
        for(let i = 0;i < 3;i++){
            let cell = new stBattleBuff();
            cell.attrId = 10000+i;
            cell.attrValue = 1;
            cell.operator = 1;
            pvpRoundBuffs.push(cell);
        }
        this.model.pvpRoundBuffs = pvpRoundBuffs;
        this.model.event(ComposeEvent.PvpTurnBasedBuffList);
    }
    private updatePvpRoundStatus(){
        this.model.event(ComposeEvent.PvpRoundStatusChange);
    }
    private setPvpRoundStatus(p1:string){
        // this.model.event(ComposeEvent.PvpTurnBasedBuffList);
        // console.log("pvpround:"+this.model.fightTypeAdaper.pvpRoundStatus);
        this.model.fightTypeAdaper.pvpRoundStatus = parseInt(p1);
        this.model.event(ComposeEvent.PvpRoundStatusChange);
    }
    private heroP1:string = "";
    private composeMythos(p1:string){
        this.heroP1 = p1;
        let that = this;
        this.model.curAdapter.composeMythos = function () {
            let arr = that.heroP1.split("|");
            let outList: ComposeMythosVo[] = [];
            for (let i = 0; i < arr.length; i++) {
                let s = arr[i];
                if (!StringUtil.IsNullOrEmpty(s)) {
                    let cell = new ComposeMythosVo();
                    cell.mythosHeroId = parseInt(s);
                    cell.check();
                    outList.push(cell);
                }
            }
            return outList;
        }
    }
    private help(){
        this.printFunc();
        // /project1/Client/doc/GM.md
        // let GMurl = `http://${window.location.host}/project1/Client/doc/GM.md`;
        // let URL = `http://${window.location.host}/project1/Client/doc/URL.md`;
        let towerGM = `http://${window.location.host}/project1/Client/doc/towerGM.ts`;
        Laya.loader.load([towerGM], new Laya.Handler(this, () => {
            console.log(Laya.loader.getRes(towerGM));
        }), null, Laya.Loader.TEXT);
    }
    private createMythos(){
        let l1 = HeroListProxy.Ins.List;
        // let s1 = "";
        for(let i = 0;i < l1.length;i++){
            let heroCfg:Configs.t_Hero_dat = l1[i];
            // if(heroCfg.f_qua == EHeroQua.Red){
                // s1+=`hero_inner ${heroCfg.f_heroid};`
                // let timer = new Laya.Timer();
                // timer.once(i * 1,this,()=>{
                    wingm(`createHero ${heroCfg.f_heroid} 0 0;`);
                // })
            // }
        }
        // wingm(s1);
    }

    private end() {
        let req = new FightWin_req();
        req.roomId = ComposeModel.Ins.room.roomId;
        req.playerId = MainModel.Ins.mRoleData.AccountId;
        SocketMgr.Ins.SendMessageBin(req);
    }
    private setFightStatus(p1:string){
        this.model.fightTypeAdaper.pvpRoundStatus = parseInt(p1);
        this.model.event(ComposeEvent.PvpRoundStatusChange);
    }

    private openui(p1:string,p2:string){
        E.ViewMgr.Open(parseInt(p1), null, p2);
    }

    private closeui(p1:string){
        E.ViewMgr.Close(parseInt(p1));
    }

    private open_pvpround_result(p1:string){
        let o = {} as IPvproundResult;
        o.max = 3;
        o.oldVal = 3;
        o.newVal = parseInt(p1);
        E.ViewMgr.Open(EViewType.PvproundResult,null,o);
    }

    private StatHide(){
        Laya.Stat.hide();
    }

    private Stat(p1:string,p2:string){
        Laya.Stat.show(p1 ? parseFloat(p1) * Laya.stage.width : 0, p2 ? parseFloat(p2) * Laya.stage.height : Laya.stage.height/2);
    }
    private delUid(p1:string){
        FightGuideUtils.delHeroByUID(parseInt(p1));
    }
    private gc(){
        Laya.Scene.gc();
    }




    private table(p1:string){
        let cfg = new BaseCfgConstuctor(p1);
        console.log(cfg.List);
    }
    private closeAll(){
        E.ViewMgr.CloseAll();
    }

    private clearTex(p1:string){
        Laya.Loader.clearTextureRes(p1);
    }
    private createHero(p1:string,p2:string,p3:string){
         // gm("createHero heroid x y");     -->gm("createHero 23 0 0")
         let hero = new stElement();
         hero.playerId = this.model.ownerPlayer.playerId;
         hero.fid = parseInt(p1);
         hero.num = 1;
         hero.uid = Laya.Utils.getGID();
         hero.x = parseInt(p2);
         hero.y = parseInt(p3);
         FightGuideUtils.adapterHero(hero);
         FightGuideUtils.addHero(hero);
    }
    private heros:string = "";
    private setCanHero(p1:string){
        this.heros = p1;
        // if(initConfig.mythos_heros){   
        // mythos = __myThosList;
        // }
        let that = this;
        this.model.canGetMythos = function(){
            let __myThosList: stHero[] = [];
            let arr = that.heros.split("|");
            for(let i = 0;i < arr.length;i++){
                let id = parseInt(arr[i]);
                let cell = new stHero();
                cell.id = id;
                cell.level = 1;
                cell.skins= [];
                __myThosList.push(cell);
            }
            return __myThosList;
        }
    }


    private _monsters:FrameMonster[] = [];
    debugWalk:DebugFightWalk;

    private watch_memory(){

        let cnt:number = 0;
        LogSys.Log('RES START==================================');
        let resMap = Laya.Resource['_idResourcesMap'];
        let useRes = [];
        let resList = [];
        for (var k in resMap) {
            var res = resMap[k];
            if (!res.lock && res._referenceCount === 0){
                // console.log("id:",k,res);
                resList.push(res);
                cnt++;
            }
            else{
                useRes.push(res);//'http://127.0.0.1:8001/Project1/Client/towertrunk/resource/static/bj.png'
            }
            // res.destroy();
        }
        console.log("Can Auto GC Start  :============================");
        console.log(resList);
        console.log(`Can Auto GC END    :count is ${resList.length}============================`);
        //console.log(useRes);

        useRes = useRes.sort((a,b)=>{
            if(a._gpuMemory > b._gpuMemory){
                return -1;
            }
            else if(a._gpuMemory < b._gpuMemory){
                return 1;
            }
            return 0;
        });

        console.log(`Other Res Start===============================================`);
        let _atlas:string = "";
        let _skillicon:string = "";
        let _atlasCnt:number = 0;
        for(let i = 0;i < useRes.length;i++){
            let o = useRes[i]
            if(o instanceof Laya.Texture2D){
                console.log(o);
                if(o.url){
                    if (o.url.indexOf("remote") != -1) {
                        _atlas += (o.url.replace(Laya.URL.basePath, "") + "\n");
                        _atlasCnt++;
                    } else if (o.url.indexOf("skillicon") != -1) {
                        _skillicon += (o.url.replace(Laya.URL.basePath, "") + "\n");
                    }
                }
            }
        }
        console.log(`Other Res End  ===============================================`);
        console.log(`skillicon:\n${_skillicon}`);
        console.log(`the number of atlas is ${_atlasCnt}\n******************************\n${_atlas}******************************\n`);
        LogSys.Log(`RES END useRes:${useRes.length}==================================`);
    }

    private createCards(){
        let l:stFCard[] = [];
        // let list = t_Function_Card.Ins.List;
        // for(let i = 0;i < list.length;i++){
        //     let cfg:Configs.t_Function_Card_dat = list[i];
        //     if(!StringUtil.IsNullOrEmpty(cfg.f_card_des)){
        //         let cell = new stFCard();
        //         cell.id = cfg.f_cardid;
        //         cell.num = 1;
        //         l.push(cell);
        //     }
        // }
        //
        let ids:number[] = [3, 6, 1001, 1003, 1009];
        for(let i = 0;i < ids.length;i++){
            let id = ids[i];
            let cell = new stFCard();
            cell.id = id;
            cell.num = 1;
            l.push(cell);
        }
        TowertMainCardModel.Ins.cardList = l;
    }

    onLoop(): void {
        // throw new Error("Method not implemented.");
        this.target.onLoop();
    }
    clientCmd(str: string): boolean{
        return this.checkCmd(str);
    }
    get model(){
        return ComposeModel.Ins;
    }

    private onPlayCard(p1:string,p2:string){
        let id = parseInt(p1 || "1");
        let eff = new BaseAdmissionShow();
        let qua = parseInt(p2 || "1");
        let quaURL:string = t_Function_Card.Ins.getQuaSkin(qua);
        eff.slots.push(new SlotImgs("Card_back_1", quaURL));
        // eff.slots.push(new SlotImgs("Card_back",`o/cardicon/${id}.png`));
        let k = "Card_invalid";
        let url = `o/spine/scene/${k}/${k}.skel`;
        eff.url = url;
        eff.load();
    }

    private check_guide(type:string){
        let proxy = new BaseCfgConstuctor("t_Main_Tasks_Guide");
        let list:Configs.t_Tasks_Guide_dat[] = proxy.List;
        for(let i = 0;i < list.length;i++){
            let cfg = list[i];
            if(cfg.f_GuidePosition.indexOf("guide_action")!=-1){
                if(cfg.f_param.indexOf(`${type}|`)!=-1){
                    LogSys.Error(`fid:${cfg.f_id}--->${JSON.stringify(cfg.f_param)}`);
                }
            }
        }
    }

    private playCard(p1: string, p2: string, p3: string,p4:string) {
        let n: number = parseInt(p3 || "1");
        let timeDelay:number = parseInt(p4 || "0");
        for (let i = 0; i < n; i++) {
            let timer = new Laya.Timer();

            timer.once(i * timeDelay,this,this.onPlayCard,[p1,p2]);
        }
    }
    private checkCmd(str:string){
        let arr = str.split(" ");

        let _cmdStr = arr[0];
        let p1 = arr[1];
        let p2 = arr[2];
        let p3 = arr[3];
        let p4 = arr[4];
        let that = this;
        if(_cmdStr == "finishguide"){
            // console.log(model.delFailUids);
            // console.log(model.removeUIDs);
            MainModel.Ins.finishGuideReward();
            return;
        }
        //  else if(_cmdStr == "card"){
            // FightFactory.createBossBannerShow(parseInt(p1),parseInt(p2));
            // let req = new GmInnerCard_req();
            // req.cardId = parseInt(p1);
            // SocketMgr.Ins.SendMessageBin(req);
            // let l = that.model.cardList;
            // let e = l.find(o=>o.data.fCardId == parseInt(p1));
            // if(e){
            //     that.model.useCard(e.data.serialNum);
            // }else{
            //     LogSys.Error(`未找到card${parseInt(p1)}`);
            // }
            // return;
        // }
        else if(_cmdStr == "finish_pveguide"){
            let req = new CommonClaimRewards_req();
            req.flag = 5;
            SocketMgr.Ins.SendMessageBin(req);
            E.ViewMgr.ShowMidLabel(_cmdStr);
            return;
        }
        else if(_cmdStr == "closesocket"){
            // TowerMainFightModel.Ins.popView();
            // GuideUtils.getUIByKeySt('4-sp-child0-panel')['disableScroll'] = parseInt(p1) == 1;
            
            SocketMgr.Ins.CloseSocket();
            return;
        }
        else if(_cmdStr == "debugview"){
            // MainModel.Ins.enterMainScene();
            // E.ViewMgr.ShowMidLabel('***********');
            E.ViewMgr.Open(EViewType.FightDebugView);
            return;
        }
        else if (_cmdStr == "funcopen") {
            let obj = new FuncOpenData();
            obj.img = "64-betterBtn";
            E.ViewMgr.Open(EViewType.FuncOpenView,null,obj);
            return;
        }
        else if(_cmdStr == "scene"){
            this.debugWalk = new DebugFightWalk();
            return;
        }
        else if(_cmdStr == "walkoffset"){
            this.debugWalk.walkoffset(1,parseInt(p1));
            return;
        }
        else if(_cmdStr == "walkset"){
            this.debugWalk.walkset(1,parseInt(p1));
            return;
        }
        else if(_cmdStr == "monster"){
            // let monster: TowerAvatarView = new TowerAvatarView();

            for(let i = 0;i < 3;i++){
                let _monster:FrameMonster;
                function onLoadComplete(){
                    Laya.stage.addChild(_monster.skeleton);
                    _monster.skeleton.pos(Laya.stage.width/2+i* 50,Laya.stage.height/2);
                }
                _monster = FightFactory.createFrameMonster(1,this,onLoadComplete,1.0);
                this._monsters.push(_monster);
            }
            return;
        }
        else if(_cmdStr == "delmonster"){
            if(this._monsters.length >0){
                this._monsters.shift().dispose();
            }
            return;
        }
        else if(_cmdStr == "aispeed"){
            // ResMgr.Ins.free();
            GuideModel.Ins.event(EGuideEvent.ChangeAiSpeed,parseInt(p1));
            return;
        }
        // else if(_cmdStr == "createAllHeros"){
        //     this.createAllHeros();
        //     return;
        // }
        // else if(_cmdStr == "createMonsters"){
        //     this.createAllMonsters();
        //     return;
        // }
        else if(_cmdStr == "mythors"){
            this.model.curAdapter.summonHero(parseInt(p1));
            return;
        }
        else if(_cmdStr == "opencard"){
            E.ViewMgr.Open(EViewType.CardTipsGuide,null,[1006,1007,1008]);
            // this.model.fightView.openHeroTips(parseInt(p1));
            return;
        }
        // else if(_cmdStr == "showeffect"){
        //     this.showEffect();
        //     return;
        // }else if(_cmdStr == "hideeffect"){
        //     if (this.effect) {
        //         // this.effect.dispose();
        //         // this.effect = null;
        //         while(this.effect.length){
        //             this.effect.shift().dispose();
        //         }
        //     }
        //     return;
        // }
        else if(_cmdStr == "guide_stat"){
            // console.log(PveGuide.Ins.curData['fightStopMgr'].stopList);
            // MainModel.Ins.event(TowerMainEvent.MainViewLayerChange);
            return;
        }
        else if(_cmdStr == "guide_goto"){
            // GuideModel.Ins.goto(parseInt(p1),parseInt(p2));
            GuideModel.Ins.gotoByfid(parseInt(p1));
            return;
        }

        else if(_cmdStr == "del_action"){
            GuideModel.Ins.actionMgr.del(parseInt(p1));
            return;
        }
        else if(_cmdStr == "heroList"){
            LogSys.Log("heroList:"+JSON.stringify(this.model.refreshList));
            return;
        }
        else if(_cmdStr == "isopen"){
            LogSys.Log(`isopen:${E.ViewMgr.isOpenReg(parseInt(p1))}`);
            return;
        }
        else if(_cmdStr == "heroopen"){
            for(let i = 0;i < 2;i++){
                let cell = new stElement();
                cell.fid = parseInt(p1) + i;
                FightFactory.createAdmission(cell);
            }
            return;
        }
        // else if(_cmdStr == "clearMainAtlas"){
            // this.model.clearMainAtlas();
            // return;
        // }
        else if(_cmdStr == "test"){
            if(p1 == "1"){
                E.ViewMgr.Open(EViewType.GiftViewPop);
            }else if(p1 == "2"){
                let revc = new RougeList_revc();
                revc.unix = TimeUtil.serverTime + 4;
                revc.datalist = [1, 2, 3];
                E.ViewMgr.Open(EViewType.GiftView, null, revc);
            }
            return;
        }
        else if(_cmdStr == "check_guide"){
            that.check_guide(p1);
            return;
        }
        // else if(_cmdStr == "bossbtn"){
        //     if(parseInt(p1)){
        //         that.model.bossMonsterId = 1;
        //         that.model.event(ComposeEvent.ShowHideBossBtn);
        //     }else{
        //         that.model.bossMonsterId = 0;
        //         that.model.event(ComposeEvent.ShowHideBossBtn);
        //     }
        //     return;
        // }
        else if(_cmdStr == "isopen"){
            LogSys.Log(E.ViewMgr.isOpenReg(parseInt(p1)));
            return;
        }
        else if(_cmdStr == "enter_pve_guide"){
            let id =  p1 ? parseInt(p1) : 1;
            initConfig.pveChapterId = id;
            // this.model.event(ComposeEvent.EnterBattle);
            GuideModel.Ins.event(EGuideEvent.Finish,id);
            return;
        }
        else if(_cmdStr == "enterMain"){
            delete initConfig.pveChapterId;
            this.model.event(ComposeEvent.EnterMainScene);
            return;
        }
        else if(_cmdStr == "createCards"){
            /*
            createCards
            enter_pve_guide 3
            enterMain
            */
            //创建卡牌
            this.createCards();
            return;
        }
        else if (_cmdStr == "up") {
            // this.model.curAdapter.pvpRoundStatus = parseInt(p1);
            // this.model.event(ComposeEvent.PvpRoundStatusChange);
            this.model.event(ComposeEvent.UpdateOwnerHeroCount);
            return;
        }
        // let func:Function = this.cmdRegMap[_cmdStr];
        // if(func){
        //     func.call(this,p1,p2,p3,p4);
        //     return;
        // }
        if(that.rumCmd2(_cmdStr,p1,p2,p3,p4)){
            return;
        }
        return true;
    }

    // private showEffect(){
        // GameConfig.spineCache = false;
            // this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/HSLY/HSLY`,Laya.stage,Laya.stage.width/2,Laya.stage.height/2);
            // this.effect = new DebugSpine();
            // this.effect = new DebugSkillEffect();
            // for(let n = 0;n < 10;n++){//多重资源加载的时候会内存泄漏
            //     // for(let i = 1;i <= 43;i++){
            //         this.effect.push(new DebugSpine());
            //     // }
            // }
    // }

    private effect:any[] = [];

    private hideLoginBg(){
        E.ViewMgr.Get(EViewType.LoginNew).UI['bg1'].skin = "";
    }
    private createMonsters(){
        this.hideLoginBg();
        let _list1 = t_Monster_Template.Ins.List;
        let k:number = 0;
        let oy: number = 0;
        const offset: number = 100;
        for (let i = 0; i < _list1.length; i++) {
            let _tempCfg: Configs.t_Monster_Template_dat = _list1[i];
            let hero: FrameMonster;
            function loadComplete() {
                Laya.stage.addChild(hero.skeleton);
                if (k % 10 == 0) {
                    k = 0;
                    oy += offset * 2;
                }
                k++;
                let ox = k * offset;
                hero.skeleton.pos(ox, oy);
            }
            hero = FightFactory.createFrameMonster(0,this,loadComplete,1,_tempCfg.f_monster_template_id) as any;
        }
    }
    private createAllHeros(){
        this.hideLoginBg();
        let _list1 = HeroListProxy.Ins.List;
        let k:number = 0;
        let oy: number = 0;
        const offset: number = 100;
        for (let i = 0; i < _list1.length; i++) {
            let heroCfg: Configs.t_Hero_dat = _list1[i];
            let hero: FrameMonster;
            function loadComplete() {
                Laya.stage.addChild(hero.skeleton);
                if (k % 10 == 0) {
                    k = 0;
                    oy += offset * 2;
                }
                k++;
                let ox = k * offset;
                hero.skeleton.pos(ox, oy);
            }
            hero = FightFactory.createHero(heroCfg.f_heroid, EResKey.Fight, 1.0, 0, this, loadComplete, ECreateHero.HeroId) as any;
        }
    }   
}