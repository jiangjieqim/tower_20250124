import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { ComposeUpdate_revc, FCardInnerChange_revc, FuncardDanMu_revc, MonsterAttack_revc, MonsterRemove_revc, RougeChoose_revc, stElement, stFCardInner, stFightSkillEffect, stFuncCardEffect, stHero, StrengthenUpdate_revc, stStrengthenItem } from "../../../../network/protocols/BaseProto";
import { FightGuide } from "../../guide/FightGuide";
import { FightGuideUtils } from "../../guide/FightGuideUtils";
import { EGuideEvent, GuideModel, IGuideModel } from "../../guide/GuideModel";
import { HeroHurtPer } from "../../guide/HeroAi";
import { EFightGuide, ETemplateCardId, t_FightGuideConfig } from "../../guide/t_FightGuideConfig";
import { MainModel } from "../../main/model/MainModel";
import { ItemVo } from "../../main/vos/ItemVo";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { ETowerAttr, HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { FightUtils } from "../FightUtils";
import { EBattle_Config, EMonsterType, t_Battle_Config } from "../t_Battle_Config";
import { t_Herosummon_Rate } from "../t_Herosummon_Rate";
// import { t_Monster } from "../t_Monster_Template";
import { EComposeUpdateType } from "../vos/EComposeUpdateType";
import { EEffectStatus, EEffectTarget, EHeroClone, IUpdateHero } from "../vos/EFightEnum";
import { ESkillId } from "../vos/ESkillId";
import { FightValueConfig } from "../vos/FightValueConfig";
import { EFuncCardUsed, FuncCardVo } from "../vos/FuncCardVo";
import { EGambleType } from "../vos/GambleCfgVo";
import { IFightMainView } from "../vos/IFightMainView";
import { FightAdapter } from "./FightAdapter";
// class SwitchHeroVo{
//     uid1:number;
//     x1:number;
//     y1:number
//     uid2:number;
//     x2:number;
//     y2:number;
//     constructor(uid1:number,uid2:number){
//         this.uid1 = uid1;
//         this.uid2 = uid2;
//     }
// }

class MoveAction{
    uid:number;
    x:number;
    y:number;
}

/**战斗引导适配器 */
export class FightAdapterGuide extends FightAdapter {

    // mDrag:boolean = true;
    // mUseCard:boolean = true;
    get wave():number{
        return this.guide.curWave;
    }
    isGuide:boolean = true;
    waveCd: boolean = false;
    showSell: boolean = false;
    bMythosShow: boolean = false;
    // useCD:boolean = false;
    initUseCd: boolean = false;
    // disableInitiativeSkill: boolean = true;

    get cardMoveTime() {
        return 0;
    }

    private curTime:number = 0

    fresh() {
        // if(Laya.timer.currTimer - this.curTime < 1000){
        //     LogSys.Log(`点击过快...`);
        //     return;
        // }
        // this.curTime = Laya.timer.currTimer;
        this.guide.clientFresh();
    }
    heroUpgrade(uid: number) {
        // this.guide.clientHeroUpgrade(uid);
        FightGuideUtils.clientHeroUpgrade(this.guide.selfId,uid,"7-02-1-5");
    }

    /**客户端模拟执行卡牌效果 */
    private clientUseActionCard(fCardId:number){
        let params: number[] = [];
        let cardcfg = t_Function_Card.Ins.getCfgById(fCardId);
        switch (cardcfg.f_card__templateid) {
            // case ECardId.KillAll:
            case ETemplateCardId.KillBoss:
                let monsters = this.model.fightView.monsterList;
                let _uids: number[] = [];
                for (let i = 0; i < monsters.length; i++) {
                    let monster = monsters[i];
                    if (monster.vo.playerId == this.guide.selfId && this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(monster.vo.fid).f_monster_type == EMonsterType.Monster) {
                        _uids.push(monster.vo.uid);
                    }
                }
                while (_uids.length > 0) {
                    let remove = new MonsterRemove_revc();
                    remove.targetUid = _uids.shift();
                    this.model.onMonsterRemove(remove);
                }
                this.model.playCardOnce(0, cardcfg.f_cardid, EEffectTarget.Hero, this.guide.selfId, 0);
                break;

            case ETemplateCardId.StealMoney:
                // let eff: string[] = card.cfg.f_card_effect.split("|");
                // let moneyId: number;
                // switch (eff[1]) {
                //     case "1":
                //         moneyId = ECellType.FIGHT_MONEY;
                //         break;
                //     case "2":
                //         moneyId = ECellType.FIGHT_STONE;
                //         break;
                // }
                // let val = parseInt(eff[2]) / 10000;
                // if (eff[0] == "1") {
                //     //窃取
                //     let cell = this.guide.enemyMoney.find(o => o.id == moneyId);
                //     if (cell) {
                //         let stealVal:number = cell.count * val;
                //         params.push(stealVal);
                //         let serverVo = new stCellValue();
                //         serverVo.count = Math.ceil(MainModel.Ins.mRoleData.getVal(moneyId) + stealVal);
                //         serverVo.id = moneyId;
                //         FightGuideUtils.setMoney([serverVo]);
                //     }
                // }
                // break;
                return;

            // case ECardId.Fire:
            case ETemplateCardId.FireHero:
                //消灭敌方最后一个召唤出来的英雄
                // let list1 = this.guide.enemyHeros;
                // let vo = list1[list1.length - 1];
                // if (vo) {
                //     let _findEnemy = this.model.fightView.gridItemList.find(o => o.data.fid == vo.heroId && o.data.playerId == this.guide.enemyId);
                //     if (_findEnemy) {
                //         let revc = new ComposeUpdate_revc();
                //         revc.datalist = [];
                //         revc.serialNum = card.data.serialNum;
                //         revc.cardId = card.data.fCardId;
                //         revc.dellist = [_findEnemy.data.uid];
                //         revc.type = EComposeUpdateType.FuncCard;
                //         this.model.onComposeUpdate(revc);
                //     }
                // }
                // break;
                return;

            case ETemplateCardId.GetMoney:
                //种钱得钱
                this.onGetMoney(cardcfg);
                break;

            case ETemplateCardId.GetEnemyHero:
                //ACTION已经实现
                return;

            case ETemplateCardId.Modify_Hero_Attr:
                this.modifyHeroAttr(cardcfg);
                break;
            default:
                LogSys.Error(`引导未实现卡牌${fCardId}逻辑`);
                return;
        }

        // ======================================================
        let cfg = t_Function_Card.Ins.getCfgById(fCardId);
        if (cfg && !cfg.f_direct_broadcast) {
            //模拟后端 推送弹幕消息
            let msg: FuncardDanMu_revc = new FuncardDanMu_revc();
            msg.cardId = fCardId;
            msg.playerId = this.guide.selfId;
            msg.datalist = params;

            // let hideTime:number = 0;
            // if(autoHideMsg){
            // hideTime = this.model.curAdapter.clockTimeMs + 500;
            // }
            let vo1 = this.model.createMsg(msg, this.model.curAdapter.clockTimeMs + FightValueConfig.MsgHideTimeOffsetMs);
            this.model.msgList.push(vo1);
            E.ViewMgr.Open(EViewType.CardMsgView);
        }
        //======================================================
    }

    private actionCardUse(card:FuncCardVo,fIndex:number) {

        let _cfg: Configs.t_Tasks_Guide_dat = this.guidemodel.preCfg;
        if (!_cfg) {
            // if(debug) E.ViewMgr.ShowMidError(`引导功能卡异常${card.data.fCardId}`);
            if (debug) E.ViewMgr.ShowMidError(`不存在功能卡:${card.data.fCardId}`);
            return;
        }
        let autoHideMsg: boolean = false;
        let cardstr = _cfg.f_fight_cardId;
        if (!StringUtil.IsNullOrEmpty(cardstr)) {
            let cardArr = cardstr.split("|");
            let cardId: number = parseInt(cardArr[0]);
            autoHideMsg = parseInt(cardArr[1]) == 1;

            if (cardId != card.data.fCardId) {
                if (debug) E.ViewMgr.ShowMidError(`引导功能卡异常:${card.data.fCardId}`);
                return;
            }
        }

        this.model.cardList.splice(fIndex, 1);
        let revc = new FCardInnerChange_revc();
        revc.playerId = this.model.ownerPlayer.playerId;
        revc.cards = [];
        let o = new stFCardInner();
        o.fCardId = card.cfg.f_cardid;
        o.pos = card.data.pos;
        o.used = EFuncCardUsed.Used;
        o.serialNum = card.data.serialNum;
        revc.cards.push(o);
        this.model.onFCardInnerChange(revc);

        FightGuideUtils.updateMoney(card.cfg.f_card_price);
        this.clientUseActionCard(o.fCardId);
    }
    useCard(uid: number,needItem:ItemVo) {
        if(!this.mUseCard){
            LogSys.Log(`当前卡牌使用已经被禁用`);
            return;
        }
        if(MainModel.Ins.mRoleData.getVal(needItem.cfgId) < needItem.count){
            E.ViewMgr.ShowMidLabel(E.getLang(`itemnotenough`,needItem.getName()));
            return;
        }

        /**使用功能卡 */
        // clientUseCard(uid:number){
        //删除掉已经用掉的卡
        let fIndex: number = this.model.cardList.findIndex(o => o.data.serialNum == uid);
        if (fIndex == -1) {
            return;
        }
        let card = this.model.cardList[fIndex];
        if(card){
            this.actionCardUse(card,fIndex);
        }
    }
    /**
     * 
     * @param s 
*26	1006	29		1|20002|1|10000|0	锋锐	我方所有英雄伤害+20%，持续15秒	{-1}使用【锋锐】，后续15秒所有英雄的伤害+20%。	1		3002	1	2	2	3	6-50	3000	41	1		87-1	抽取获得	1			
*98	1007	29		1|20002|1|10000|0	愤怒烈焰	我方所有英雄的攻击力永久+10%	{-1}使用【愤怒烈焰】，所有英雄的攻击力永久+10%。	1		3002	1	2	2	2	6-80	3000	2016	1		87-5	抽取获得	1			
*99	1008	12		0|6|100|0|0	锦缎布币	立即获得100铜钱	{-1}鸿运当头!获得布币x100!			3002	26	3	2	3	6-10	3000	2008	1		87-30	抽取获得	1			

     */
    private modifyHeroAttr(cfg:Configs.t_Function_Card_dat){
        let s:string = cfg.f_card_effect;
        
        // 1|20007|1|10000|15000
        //降低对手/提高自己所有英雄的伤害10%，持续15秒
        /*
        a：作用目标 1自己所有英雄 2敌方所有英雄
        b：改变的属性id
        c：增加还是减少 1增加 2减少
        d：改变的数值大小
        e：持续的时长（毫秒）（0代表永久）
        */
        let arr = s.split("|");
        let owner:number = parseInt(arr[0]);
        if(owner = 1){
            //己方
            let attrId:number = parseInt(arr[1]);
            if(attrId == ETowerAttr.AtkPer){
                let vo = new HeroHurtPer();
                vo.playerId = this.model.ownerPlayer.playerId;
                let p:number = parseInt(arr[2]) == 1 ? 1 : -1;
                vo.hurtPer = p * parseInt(arr[3]);
                let ms:number = parseInt(arr[4])//buff的时间

                this.guidemodel.event(EGuideEvent.HeroHurtPer,vo);


                let _cardVo = new stFuncCardEffect();
                _cardVo.cardId = cfg.f_cardid;
                _cardVo.playerId = this.model.ownerPlayer.playerId;
                _cardVo.state = EEffectStatus.Open;
                _cardVo.type = EEffectTarget.Hero;
                _cardVo.uids = [];
                let list = this.model.refreshList;
                for(let i = 0;i < list.length;i++){
                    let hero = list[i];
                    if(hero.playerId == vo.playerId){
                        _cardVo.uids.push(hero.uid);
                    }
                }
                this.guidemodel.event(EGuideEvent.ParseCardCell,_cardVo);
            }
        }else if(owner == 1){
            //敌方

        }
    }
    private get guidemodel():IGuideModel{
        return GuideModel.Ins;
    }
    private onGetMoney(cfg:Configs.t_Function_Card_dat){
        let s:string = cfg.f_card_effect;
        let arr = s.split("|");
        // 0|6|100|0|0
        /*
        a:生效间隔（波次）：0立即 ≥1具体的回合数(包含本回合）
        b：自己获得的道具id
        c：自己获得的数量
        d：对手获得的道具id
        e：对手获得的数量
        */
        let type = parseInt(arr[0]);
        if(type == 0){
            //己方获得

            let itemId:number = parseInt(arr[1]);
            let count:number = parseInt(arr[2]);
            FightGuideUtils.updateMoney(`${itemId}-${count}`,true);

            //播放特效
            let _cardVo = new stFuncCardEffect();
            _cardVo.cardId = cfg.f_cardid;
            _cardVo.playerId = this.model.ownerPlayer.playerId;
            _cardVo.state = EEffectStatus.Open;
            _cardVo.type = EEffectTarget.CampTarget;
            _cardVo.uids = [];
            this.guidemodel.event(EGuideEvent.ParseCardCell,_cardVo);
        }
    }

    watchHero(uid: number) {
        // this.guide.clientWatchHero(uid);
        FightGuideUtils.clientWatchHero(uid);
    }

    move(uid: number, x: number, y: number) {

        let cfg = this.guidemodel.curCfg;
        if (!cfg) {
            return;
        }
        if (!cfg.f_grid) {
            
            LogSys.Log(`f_grid is null...`);
            return;
        }

        let arr: string[] = cfg.f_grid.split("|");

        let oldArr: string[] = arr[0].split("-");
        // this.model.fightView.gridItemList.find() 
        let posArr: string[] = arr[1].split("-");

        let pos = new Laya.Point(parseInt(posArr[0]), parseInt(posArr[1])) //this.guide.dragPos;
        let _status: boolean = false;
        if (x == pos.x && y == pos.y) {
            let grid = this.model.fightView.gridItemList.find(o => o.uid == uid);
            if (grid) {
                let oldx: number = parseInt(oldArr[0]);
                let oldy: number = parseInt(oldArr[1]);
                let data = grid.data;
                if (data.x == oldx && data.y == oldy) {
                    let cell = new stElement();
                    cell.uid = uid;
                    cell.num = data.num;
                    cell.playerId = data.playerId;
                    cell.fid = data.fid;
                    cell.x = x;
                    cell.y = y;
                    let revc = new ComposeUpdate_revc();

                    revc.datalist = [cell];
                    revc.dellist = [];
                    this.model.onComposeUpdate(revc);
                    this.guidemodel.nextGuideStep();
                    _status = true;
                }
            }
        }
        if (!_status) {
            // E.ViewMgr.ShowMidError(E.getLang("guideErr1"));
        }
    }

    /**强化 */
    streng(pos: number) {
        // let req:StrengthenUpdate_req = new StrengthenUpdate_req();
        // req.pos = pos;
        // SocketMgr.Ins.SendMessageBin(req);
        let vo = this.model.strengthenList.find(o => o.pos == pos);
        if (vo) {
            let needStr: string = ""
            if (pos <= 2) {
                let max = parseInt(t_Battle_Config.Ins.getValueById(EBattle_Config.STRNG_MAX_LIMT + pos * 3));
                if (vo.level + 1 > max) {
                    return;
                }
                let price: number = EBattle_Config.STRNG_PRICE + pos * 3;
                let cost: number = EBattle_Config.STRNG_COST + pos * 3;
                let arr = t_Battle_Config.Ins.getValueById(price).split("-");
                let id = parseInt(arr[0]);
                let num = parseInt(arr[1]);
                let addNum = parseInt(t_Battle_Config.Ins.getValueById(cost).split("-")[1]);

                let need = num + (vo.level - 1) * addNum;

                needStr = `${id}-${need}`;

            } else {
                let nextCfg = t_Herosummon_Rate.Ins.getCfgByLv(vo.level + 1);
                if (!nextCfg) {
                    return;
                }
                let cfg = t_Herosummon_Rate.Ins.getCfgByLv(vo.level);
                let arr = cfg.f_consume.split("-");
                let id = parseInt(arr[0]);
                let num = parseInt(arr[1]);
                needStr = `${id}-${num}`;
            }

            if (!TowerMainModel.Ins.isItemEnoughSt(needStr, true)) {
                return;
            }
            //============================================
            let cell = new stStrengthenItem();
            cell.level = vo.level + 1;
            cell.pos = pos;

            let revc = new StrengthenUpdate_revc();
            revc.data = cell;
            this.model.onStrengthenUpdate(revc);

            FightGuideUtils.updateMoney(needStr);
        }
    }

    /**祈愿*/
    gamble(type: EGambleType,need:number) {
        /*
        //1,2,3
        //  0|23-52-1-6|0
        let arr = t_FightGuideConfig.Ins.getValueById(EFightGuide.Gamble).split("|");
        let str1 = arr[type - 1];
        if (str1 == "0") {
            return;
        }

        let vo = this.model.gambleVoList.find(o => o.type == type);
        if (vo) {
            // let _heroVo: stElement = this.guide.createSelfHero(str1);
            // let _seachVo = this.model.fightView.gridItemList.find(o => o.data.playerId == this.guide.selfId && o.data.fid == _heroVo.fid);
            // if (_seachVo) {
            //     // E.ViewMgr.ShowMidError("已经有了改英雄了");
            //     return;
            // }
            let _heroVo = this.checkCreateHero(str1);
            if (_heroVo) {
                FightGuideUtils.addHero(_heroVo);
                FightGuideUtils.updateMoney(vo.priceStr);

                let revc:Gamble_revc = new Gamble_revc();
                revc.flag = type;
                revc.success = 1;
                revc.heroId = _heroVo.fid;
                this.model.onGamble(revc);
            }
        }
        */
        FightGuideUtils.gamble(this.guide.selfId,t_FightGuideConfig.Ins.getValueById(EFightGuide.Gamble),type,need);
    }

    protected get heroMythos(){
        return t_FightGuideConfig.Ins.getValueById(EFightGuide.SummonHeroResult);
    }


    
    /**
     * 神话召唤 
     * 
     * 备注
     * 1.如果目标召唤的位置有英雄 先移动本位置的英雄到其他地方去
    */
    summonHero(heroId: number) {
        // SummonHeroResult
        let str1 = this.heroMythos;

        //00-8 ---------------- x:0 y:0 uid:8
        let arr = str1.split("-");

        let pos:string = arr[0];
        let uid:number = parseInt(arr[1]);

        let posX:number = parseInt(pos[0]);
        let posY:number = parseInt(pos[1]);
        // 

        let playerId:number = this.guide.selfId;
        // FightValueConfig.MOVE_GRID_TIME
        let _oldHero = this.model.fightView.gridItemList.find(o => o.data.playerId == playerId && o.data.x == posX && o.data.y == posY);

        if(_oldHero){
            //移动到可使用的位置
            let _newPos = FightGuideUtils.findCanEmptyGrid(playerId);
            if(_newPos){
                // LogSys.Log(`找到一个新位置${JSON.stringify(_newPos)}`);
                // let  this.model.refreshList.find(o=>o.uid == _oldHero.uid);
                this.updateMove(this.model.fightView,_oldHero.data.uid,_newPos.x,_newPos.y);
                this.onSummonHero(heroId,posX,posY,uid);
            }else{
                LogSys.Warn(`找不到可用位置!`);
            }
        }else{
            this.onSummonHero(heroId,posX,posY,uid);
        }
    }

    /**召唤神话英雄 */
    private onSummonHero(heroId:number,x:number,y:number,uid:number){

        // let _newStr: string = `${heroId}-${pos}-1-${heroUID}`;
        let _newStr:string = `${heroId}-${x}${y}-1-${uid}`;

        let _heroVo: stElement = this.guide.createSelfHero(_newStr);

        let cfg = HeroListProxy.Ins.getCfgById(_heroVo.fid);
        if (!StringUtil.IsNullOrEmpty(cfg.f_composed)) {
            FightGuideUtils.updateMoney(cfg.f_composed);
        }
        if (!StringUtil.IsNullOrEmpty(cfg.f_synthesis)) {

            let arr: string[] = cfg.f_synthesis.split("|");
            let uids: number[] = [];

            for (let i = 0; i < arr.length; i++) {
                let __heroid: number = parseInt(arr[i]);
                let cell = this.model.fightView.gridItemList.find(o => o.data.fid == __heroid && o.data.playerId == this.guide.selfId);
                if (cell) {
                    uids.push(cell.uid);
                }
            }
            if (uids.length > 0) {
                let vo = new ComposeUpdate_revc();
                vo.type = EComposeUpdateType.Compose;
                vo.datalist = [_heroVo];
                vo.dellist = uids;
                this.model.onComposeUpdate(vo);
            }
        }
    }

    get mythos() {
        let _myThosList: stHero[] = [];
        let arr = t_FightGuideConfig.Ins.getValueById(EFightGuide.MythosHero).split("|");
        let vo = new stHero();
        vo.id = parseInt(arr[0]);
        vo.level = parseInt(arr[1]);
        _myThosList.push(vo);
        return _myThosList;
    }
    private updateMove(fightView: IFightMainView, uid: number, x: number, y: number) {
        // super.clientHeroMove(fightView,uid,x,y);
        let _grid = fightView.gridItemList.find(o => o.uid == uid);
        if (_grid) {
            let st = FightUtils.cloneStElement(_grid.data);
            // _grid.data;//FightUtils.cloneStElement();
            st.x = x;
            st.y = y;
            let o: IUpdateHero = {} as IUpdateHero;
            o.vo = st;
            fightView.onHeroUpdate(o);

            //设置源数据
            let _vo = this.model.refreshList.find(o => o.uid == uid);
            if (_vo) {            
                _vo.x = x;
                _vo.y = y;
            }
        }
    }
    clientHeroMove(fightView: IFightMainView, uid: number, x: number, y: number) {
        if (this.guidemodel.isWeak) {
            //弱引导移动
            // LogSys.Trace(`clientHeroMove 英雄移动${uid} x:${x} y:${y}`);
            this.updateMove(fightView, uid, x, y);
        }else{
            LogSys.Log(`强引导中不可以移动`);
        }
    }
    readyComplete() {

    }

    get clockTimeMs(){
        return FightGuide.Ins.curMs;
    }

    /**使用主动技能 23-50-1-9  分身*/
    useMainSkill(uid:number){
        let playerId = this.guide.selfId;
        //23-50-1-9
        let str = t_FightGuideConfig.Ins.getValueById(EFightGuide.CloneHero);
        let _seachVo = this.model.fightView.gridItemList.find(o => o.data.playerId == playerId && o.data.uid == uid);
        if(!_seachVo){
            LogSys.Error(`引导流水号有误:${uid}`)
            return;
        }
        let cfg:Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(_seachVo.data.fid);
        if (StringUtil.IsNullOrEmpty(cfg.f_active_skills_consume)) {
            LogSys.Error(`引导英雄主动技能消耗配置有误uid:${uid}`)
            return;
        } else {
            FightGuideUtils.updateMoney(cfg.f_active_skills_consume);
        }

        let _skillVo = this.createMonkeySkill(uid);
        this.model.onMonsterAttack(_skillVo);
        
        let vo = FightGuideUtils.createHeroVo(str, playerId, EHeroClone.IsClone);
        FightGuideUtils.addHero(vo);
    }

    /**猴子猴孙技能 */
    private createMonkeySkill(uid:number){
        let atk_revc = new MonsterAttack_revc();
        atk_revc.datalist = [];
        let skillEffect:stFightSkillEffect = new stFightSkillEffect();
        skillEffect.attackerUid = uid;
        skillEffect.index = 0;
        skillEffect.params = [ESkillId.MonkeyChildren];
        skillEffect.targetUids = [];
        skillEffect.type = 1;
        atk_revc.datalist.push(skillEffect);
        return atk_revc;
    }

    /**怪物的波次时间 */
    getDisappearTime(monsterId:number){
        return this.guide.curWaveSec;
    }
    // private time:number  = 0;
    private _switchList:MoveAction[] = [];
    /**交换英雄 */
    switchHero(uid1: number, uid2: number,x1,y1,x2,y2) {
        // let cell1 = new MoveAction();
        // cell1.x = x1;
        // cell1.y = y1;
        // cell1.uid = uid1;
        // this._switchList.push(cell1);
        // let cell2 = new MoveAction();
        // cell2.uid = uid2;
        // cell2.x = x2;
        // cell2.y = y2;
        // this._switchList.push(cell2);
        // return true;

        //禁用交换英雄
        this.model.fightView.clearTopDragLayer();
        return false;
    }

    frameLoop() {
        if (this._switchList.length) {
            if (this.model.fightView) {
                let cell = this._switchList.shift();
                let _agrid = this.model.refreshList.find(o => o.uid == cell.uid);
                if (_agrid) {
                    // LogSys.Log(`移动行为 ${JSON.stringify(cell)}`);
                    this.model.curAdapter.clientHeroMove(this.model.fightView, cell.uid, cell.x, cell.y);
                    this.model.fightView.clearTopDragLayer();
                }
            }
        }
    }
    reset(){
        this._switchList = [];
    }

    rougeSel(id:number){
        let revc = new RougeChoose_revc();
        revc.playerId = this.model.ownerPlayer.playerId;
        revc.fid = id;
        this.model.onRougeChoose(revc);
    }
}