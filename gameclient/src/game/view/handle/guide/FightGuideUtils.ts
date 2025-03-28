import { E } from "../../../G";
import { ComposeUpdate_revc, FCardInnerChange_revc, FCardInnerInit_revc, FightSceneInfo_revc, Gamble_revc, MonsterBirth_revc, PvPRoomInfo_revc, stCellValue, stElement, stFCardInner, stMonsterBirth, stPlayerInRoom, ValChanel_revc, WatchHero_revc } from "../../../network/protocols/BaseProto";
import { ComposeConfig } from "../compose/ComposeConfig";
import { ComposeModel } from "../compose/ComposeModel";
import { t_Battle_Config, EBattle_Config, EMonsterType } from "../compose/t_Battle_Config";
import { EComposeUpdateType } from "../compose/vos/EComposeUpdateType";
import { ClientMonsterBirthVo, EFightMode, EHeroClone } from "../compose/vos/EFightEnum";
import { FightValueConfig } from "../compose/vos/FightValueConfig";
import { EFuncCardUsed } from "../compose/vos/FuncCardVo";
import { EGambleType } from "../compose/vos/GambleCfgVo";
import { ItemViewFactory } from "../main/model/ItemViewFactory";
import { MainModel } from "../main/model/MainModel";
import { ItemProxy } from "../main/proxy/ItemProxy";
import { ECellType } from "../main/vos/ECellType";
import { TowertMainModule } from "../towertmain/TowertMainModule";
import { ETowerAttr } from "../towertmainhero/proxy/HeroProxy";
import { FightGuideWaveVo } from "./FightGuide";
import { EActionType, IGuideCreateRoom } from "./guideaction/actionMgr";
import { EGuideEvent, GuideModel } from "./GuideModel";
import { t_FightGuideConfig, EFightGuide } from "./t_FightGuideConfig";
/**引导工具类 */
export class FightGuideUtils {
    private static _cardUID:number = 0;
    private static _initUid: number = 0;

    /**初始化UID构建器 */
    static clearUID() {
        this._initUid = 0;
        this._cardUID = 0;
    }

    /**添加怪物出生信息 */
    static addMonsterBirth(_brithInfoList: ClientMonsterBirthVo[], uid: number, _birthTime: number, curBlood: number) {
        let vo = _brithInfoList.find(o => o.uid == uid);
        if (!vo) {
            vo = new ClientMonsterBirthVo();
            vo.uid = uid;
            vo.curBlood = curBlood;
            _brithInfoList.push(vo);
        }
        vo.birthTime = _birthTime;
    }

    private static get model() {
        return ComposeModel.Ins;
    }

    /**
     * 为指定的玩家创建波次怪物
     * 
     * @param curMs 当前的游戏时钟
     * @param playerId 玩家id
     * @param wave 当前波次
     * @param _brithInfoList 出生数据存储列表
     * @param waveList 波次数据
     */
    static createBirthMonster(curMs: number, playerId: number, wave: number, _brithInfoList: ClientMonsterBirthVo[], waveList: FightGuideWaveVo[]) {

        // this.updateWave(wave);
        // let wave = this.curWave;

        // let _gapTime = parseInt(t_FightGuideConfig.Ins.getValueById(EFightGuide.BirthMonsterMS));
        let waveVo = waveList.find(o => o.wave == wave);
        if (!waveVo) {
            LogSys.Error(`波次数异常`);
            return;
        }

        /*
        let revc: MonsterBirth_revc = new MonsterBirth_revc();
        // revc.serverTime = TimeUtil.serverTimeMS/1000;
        revc.datalist = [];

        for (let i = 0; i < waveVo.monsterCount; i++) {
            let maxBlood = waveVo.maxBlood;
            let cell = new stMonsterBirth();
            cell.fid = waveVo.monsterId;
            cell.playerId = playerId;
            cell.curBlood = maxBlood;
            cell.blood = maxBlood;

            // let _monsterCfg = t_Monster.Ins.getCfgMonsterid(waveVo.monsterId);
            // let _monsterTempCfg = t_Monster_Template.Ins.getMonsterTemplate(_monsterCfg.f_monster_template_id);
            // let _speed:number = parseInt(_monsterTempCfg.f_10003.split(":")[1]);

            let _speed: number = this.model.fightTypeAdaper.monsterCfg.getTempSpeed(waveVo.monsterId);

            cell.time = i * _speed;
            cell.index = 0;
            cell.uid = this.createMonsterUID();
            FightGuideUtils.addMonsterBirth(this._brithInfoList, cell.uid, this.curMs + cell.time, maxBlood);
            revc.datalist.push(cell);
        }
        this.model.sceneInfo.monsters = this.model.sceneInfo.monsters.concat(revc.datalist);
        this.model.onMonsterBirth(revc);

        */
        this.createBirMonstersCell(curMs, playerId, waveVo, _brithInfoList)
    }

    private static createBirMonstersCell(curMs: number, playerId: number, waveVo: FightGuideWaveVo, _brithInfoList: ClientMonsterBirthVo[]) {
        if (!this.model.sceneInfo) {
            //LogSys.Error(`sceneInfo已经被销毁`);


            let revc = new FightSceneInfo_revc();
            revc.heros = [];
            revc.mode=0;
            revc.monsters = [];
            revc.status = 0;
            // return;
            this.model.sceneInfo = revc;
        }
        let revc: MonsterBirth_revc = new MonsterBirth_revc();
        // revc.serverTime = TimeUtil.serverTimeMS/1000;
        revc.datalist = [];
        for (let i = 0; i < waveVo.monsterCount; i++) {
            // let maxBlood = waveVo.maxBlood;
            let cell = new stMonsterBirth();
            cell.fid = waveVo.monsterId;
            let maxBlood: number = this.model.fightTypeAdaper.monsterCfg.getMonsterAttrVal(waveVo.monsterId, ETowerAttr.BloodVal);//当前的血量值
            if(maxBlood <= 0){
                LogSys.Warn(`${waveVo.monsterId}'s blood is 0!`);
            }
            cell.playerId = playerId;
            cell.curBlood = maxBlood;
            cell.blood = maxBlood;

            // let _monsterCfg = t_Monster.Ins.getCfgMonsterid(waveVo.monsterId);
            // let _monsterTempCfg = t_Monster_Template.Ins.getMonsterTemplate(_monsterCfg.f_monster_template_id);
            // let _speed:number = parseInt(_monsterTempCfg.f_10003.split(":")[1]);

            let _speed: number = waveVo.birthOffsetMS;
            if(!_speed){
               _speed = this.model.fightTypeAdaper.monsterCfg.getTempSpeed(waveVo.monsterId);
            }
            let cfg = this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(cell.fid);
            if(!cfg){
                LogSys.Error(`找不到f_monsterid:${cell.fid}`);
            }
            let monsterType = cfg.f_monster_type;
            if (monsterType == EMonsterType.Boss || monsterType == EMonsterType.LimitTimeBoss) {
                cell.disappearTime = this.model.curAdapter.clockTimeMs/1000 + FightValueConfig.WaveSec;
            }
            cell.time = i * _speed;
            cell.index = 0;
            cell.uid = this.createMonsterUID();
            LogSys.Log(`创建怪物出生信息:`+JSON.stringify(cell));
            FightGuideUtils.addMonsterBirth(_brithInfoList, cell.uid, curMs + cell.time, maxBlood);
            revc.datalist.push(cell);
        }
        this.model.sceneInfo.monsters = this.model.sceneInfo.monsters.concat(revc.datalist);
        this.model.onMonsterBirth(revc);
    }
    /**创建一个怪物uid */
    static createMonsterUID() {
        this._initUid++;
        return this._initUid;
    }

    /**创建波次数据 */
    static createWaves(str: string) {
        //波次数据
        let wave: string[] = str.split("|");
        let waveList: FightGuideWaveVo[] = [];
        // this.waveList = [];
        //时间(秒)-怪物id-怪物血量-怪物数量
        for (let i = 0; i < wave.length; i++) {
            let o = wave[i].split("-");
            let cell: FightGuideWaveVo = new FightGuideWaveVo();
            cell.wave = i + 1;
            cell.sec = parseInt(o[0]);
            cell.monsterId = parseInt(o[1]);

            // let bloodVal: number = this.model.fightTypeAdaper.monsterCfg.getMonsterAttrVal(cell.monsterId, ETowerAttr.BloodVal);//当前的血量值

            // cell.maxBlood = bloodVal;//parseInt(o[2]);
            cell.monsterCount = parseInt(o[2]);
            if(o[3]){
                cell.birthOffsetMS = parseInt(o[3]);
            }
            // cell.birthOffsetMS = o[3] ? parseInt(o[3]) : 1;
            
            // cell.gapTime = parseInt(o[3]);
            waveList.push(cell);
        }
        return waveList;
    }

    /**
    * @param str heroId-pos-num-uid
    */
    static createHeroVo(str: string, playerId: number, clone: EHeroClone = EHeroClone.None) {
        let b = str.split("-");
        let _heroVo = new stElement();
        _heroVo.fid = parseInt(b[0]);
        let pos: string = b[1];
        _heroVo.num = parseInt(b[2]);
        _heroVo.uid = parseInt(b[3]);
        _heroVo.playerId = playerId;//MainModel.Ins.mRoleData.AccountId;
        _heroVo.clone = clone;
        _heroVo.x = parseInt(pos[0]);
        _heroVo.y = parseInt(pos[1]);
        return _heroVo;
    }

    /**添加英雄 */
    static addHero(cell: stElement,sync:boolean = false) {
        let vo = new ComposeUpdate_revc();
        vo.datalist = [];
        vo.dellist = [];
        vo.datalist.push(cell);
        this.model.onComposeUpdate(vo,sync);
    }

    /**设置货币 */
    static setMoney(list1:stCellValue[]){
        let valRevc: ValChanel_revc = new ValChanel_revc();
        valRevc.itemList = list1;
        TowertMainModule.Ins.onValChanel(valRevc);
    }

    /**
     *自己消耗 或者增加 
     * @param f_card_price id-count
     */
    static updateMoney(f_card_price: string, isAdd: boolean = false) {
        let serverList: stCellValue[] = [];
        let cells = ItemViewFactory.convertCellList(f_card_price);
        for (let i = 0; i < cells.length; i++) {
            let o = cells[i];
            let obj = new stCellValue();
            if (isAdd) {
                obj.count = MainModel.Ins.mRoleData.getVal(o.id) + o.count;
            } else {
                obj.count = MainModel.Ins.mRoleData.getVal(o.id) - o.count;
            }
            obj.id = o.id;
            serverList.push(obj);
        }
        this.setMoney(serverList);
    }

    private static findUseGird(cell: stElement) {
        let playerId: number = cell.playerId;//目标阵营

        let find: boolean = false;
        for (let i = 0; i < ComposeConfig.mapW - 1; i++) {
            for (let n = ComposeConfig.mapH - 1; n >= 0; n--) {
                let isox: number = i;
                let isoy: number = n;
                let ftarget = this.model.refreshList.find(o => o.playerId == playerId && o.x == isox && o.y == isoy);
                if (!ftarget) {
                    find = true;
                    cell.x = isox;
                    cell.y = isoy;
                    LogSys.Log(`clientFresh======找到可用的空格子...isox ${isox} isoy ${isoy}`);
                    return;
                }
            }
        }
        if (!find) {
            LogSys.Warn(`clientFresh======未找到能用的格子...`);
        }
    }

    /**找到可用的格子坐标 */
    static findCanEmptyGrid(playerId:number){
        for (let i = 0; i < ComposeConfig.mapW - 1; i++) {
            for (let n = ComposeConfig.mapH - 1; n >= 0; n--) {
                let isox: number = i;
                let isoy: number = n;
                let ftarget = this.model.refreshList.find(o => o.playerId == playerId && o.x == isox && o.y == isoy);
                if (ftarget) {

                }else{
                    return new Laya.Point(isox,isoy);
                }
            }
        }
    }


    /**动态适配构建英雄 */
    static adapterHero(cell:stElement){
        let playerId:number = cell.playerId;//目标阵营

        let _mapHero = this.model.refreshList.find(o => o.playerId == playerId && o.uid == cell.uid);
        if (_mapHero) {
            //更新原英雄
            cell.x = _mapHero.x;
            cell.y = _mapHero.y;
        } else {
            let otherHero = this.model.refreshList.find(o => o.playerId == playerId && o.x == cell.x && o.y == cell.y);
            if (otherHero) {
                if (otherHero.uid == cell.uid) {
                    //更新数量
                    LogSys.Log(`clientFresh======更新数量`);
                } else {
                    //目标坐标有英雄
                    this.findUseGird(cell);
                }
            } else {
                LogSys.Log(`clientFresh=====新位置生成英雄...isox ${cell.x} isoy ${cell.y}`);
            }
        }
    }

    /**客户端模拟召唤英雄 */
    static clientFresh(_ownerHerosPool:stElement[],that,costFunc:Function,succeedFunc?:Function){
        if(_ownerHerosPool.length > 0){
            let cell = _ownerHerosPool.shift();
            FightGuideUtils.updateMoney(`${ECellType.FIGHT_MONEY}-${this.model.getCost(ECellType.FIGHT_MONEY)}`);
            //=====================================================
            this.adapterHero(cell);
            LogSys.Log(`clienyFresh uid:${cell.uid}`);
            FightGuideUtils.addHero(cell,true);
            //=====================================================
            this.model.showEpic(cell.fid);

            if(that){
                costFunc.call(that);
            }
            if(that && succeedFunc){
                succeedFunc.call(that)
            }
            
        }else{
            LogSys.Warn(`英雄池子没有英雄了!`);
        }
    }

    /**合成 let str = "7-02-1-5";*/
    static clientHeroUpgrade(playerId:number,uid: number,str:string) {
        let vo1 = this.model.refreshList.find(o => o.uid == uid);
        if (vo1) {
            let vo = new ComposeUpdate_revc();
            vo.datalist = [];
            vo.dellist = [vo1.uid];

            //合成结果 召唤的英雄id--->fid-xy-num-uid  7-02-1-5
            // let str = "7-02-1-5";
            // t_FightGuideConfig.Ins.getValueById(EFightGuide.HeroUpgrade)
            // let hero = this.createSelfHero(str);
            let hero = this.createHeroVo(str,playerId);
            vo.datalist.push(hero);
            this.model.onComposeUpdate(vo);
        }
    }
    /**查看英雄 */
    static clientWatchHero(uid:number){
        let revc = new WatchHero_revc();
        revc.lv = 1;
        revc.datalist = [];
        revc.uid = uid;
        this.model.onWatchHero(revc);
    }


    /**祈愿*/
    static gamble(playerId:number,str:string,type: EGambleType,need:number) {
        //1,2,3
        //  0|23-52-1-6|0
        // let arr = t_FightGuideConfig.Ins.getValueById(EFightGuide.Gamble).split("|");
        let arr = str.split("|");
        let str1 = arr[type - 1];
        if (str1 == "0") {
            LogSys.Warn(`该池子未开启`);
            return;
        }

        this.gambleCreate(playerId,type,str1,need);
    }

    /**引导中的祈愿行为 */
    static gambleCreate(playerId:number,type: EGambleType,heroStr:string,need:number,succeed:number = 1) {
        let id:number = ECellType.FIGHT_STONE;
        if(MainModel.Ins.mRoleData.getVal(id) < need){
            E.ViewMgr.ShowMidError(E.getLang('itemnotenough',ItemProxy.Ins.getCfg(id).f_name));
            return;
        }

        if(StringUtil.IsNullOrEmpty(heroStr)){
            LogSys.Warn(`祈愿卡池为空!`)
            return;
        }

        let vo = this.model.fightTypeAdaper.gambleVoList.find(o => o.type == type);
        if (vo) {
            // let _heroVo: stElement = this.guide.createSelfHero(str1);
            // let _seachVo = this.model.fightView.gridItemList.find(o => o.data.playerId == this.guide.selfId && o.data.fid == _heroVo.fid);
            // if (_seachVo) {
            //     // E.ViewMgr.ShowMidError("已经有了改英雄了");
            //     return;
            // }
            //==================================================================
            let _heroVo = this.createHeroVo(heroStr, playerId);
            if(succeed){
                this.adapterHero(_heroVo);
                FightGuideUtils.addHero(_heroVo);
            }
            //==================================================================
            FightGuideUtils.updateMoney(vo.priceStr);

            let revc: Gamble_revc = new Gamble_revc();
            revc.flag = type;
            revc.success = succeed;
            revc.heroId = _heroVo.fid;
            this.model.onGamble(revc);
            GuideModel.Ins.event(EGuideEvent.GuideGambleSucceed);
        }else{
            LogSys.Warn(`祈愿配置异常`);
        }
    }


    // /**检测是否可以创建英雄 
    //  * 21-51-1-8
    //  * heroId-positionXY-num-uid
    //  */
    // private static checkCreateHero(playerId:number,str1: string) {
    //     let _heroVo: stElement = FightGuideUtils.createHero(str1,playerId);
    //     /*
    //     let _seachVo = this.model.fightView.gridItemList.find(o => o.data.playerId == playerId && o.data.fid == _heroVo.fid);
    //     if (_seachVo) {
    //         // E.ViewMgr.ShowMidError("已经有了改英雄了");
    //         LogSys.Error(`已经有了该英雄了:${str1}`);
    //         return;
    //     }
    //     */
    //     return _heroVo;
    // }

    /**构建房间信息 */
    static createRoomInfo(selfId: number, enemyId: number,mode:EFightMode,
        lv?:number,
        nickName?:string,trophy?:number,headUrl?:string,
        ownerMonsterMaxCount?:number,
        enemyMonsterMaxCount?:number
        ) {

        let heroMax: number = parseInt(t_Battle_Config.Ins.getValueById(EBattle_Config.MAX_HERO_COUNT));
        let monsterMax: number = parseInt(t_Battle_Config.Ins.getValueById(EBattle_Config.MAX_MONSTER_COUNT));
        if(ownerMonsterMaxCount == undefined){
            ownerMonsterMaxCount = monsterMax;
        }
        if(enemyMonsterMaxCount == undefined){
            enemyMonsterMaxCount = monsterMax;
        }
        //====================================================================
        //己方
        let room = new PvPRoomInfo_revc();
        room.mode = mode;
        room.roomId = 0;
        room.datalist = [];
        let owner = new stPlayerInRoom();
        owner.playerId = selfId;
        owner.headUrl = MainModel.Ins.mRoleData.mPlayer.HeadUrl;//MainModel.Ins.mRoleData.headUrl;
        owner.maxHero = heroMax;
        owner.maxMonster = ownerMonsterMaxCount;
        owner.nickName = MainModel.Ins.mRoleData.NickName;
        owner.playerLevel = MainModel.Ins.mRoleData.lv;
        owner.trophy = 0;
        room.datalist.push(owner);

        //敌方
        let enemy = new stPlayerInRoom();
        enemy.playerId = enemyId;
        enemy.headUrl = headUrl || "";
        enemy.maxHero = heroMax;
        if(enemyId > 0){
            enemy.maxMonster = enemyMonsterMaxCount;
        }else{
            enemy.maxMonster = 0;
        }
        enemy.nickName = nickName || E.getLang("guidename1");
        enemy.playerLevel = lv||1;
        enemy.trophy = trophy || parseInt(t_FightGuideConfig.Ins.getValueById(EFightGuide.EnemyTrophy));
        room.datalist.push(enemy);

        this.model.onPvPRoomInfo(room);
    }

    /**初始化卡牌 */
    static createCards(str:string){
        let _cartRevc = new FCardInnerInit_revc();
        _cartRevc.cards = [];
        let _cards:string[] = str.split("|");//this.getFightCardIds();
        for (let i = 0; i < _cards.length;i++){
            let cardId:number = parseInt(_cards[i]);
            let o = new stFCardInner();
            o.fCardId = cardId;
            o.pos = i;
            o.serialNum = i + 1;
            o.used = 0;
            _cartRevc.cards.push(o);
        }
        this.model.onFCardInnerInit(_cartRevc);
    }

    /**卡牌变化 */
    static changeCards(str: string) {
        let _cartRevc = new FCardInnerChange_revc();
        _cartRevc.cards = [];
        this._cardUID||0;
        let _cards: string[] = str.split("|");
        for (let i = 0; i < _cards.length; i++) {
            let cardId: number = parseInt(_cards[i]);
            let o = new stFCardInner();
            o.fCardId = cardId;
            o.pos = i;
            this._cardUID++;
            o.serialNum = this._cardUID;
            o.used = EFuncCardUsed.NotUsed;;
            _cartRevc.cards.push(o);
        }
        this.model.onFCardInnerChange(_cartRevc);
    }

    static createRoom(s:string){
        let arr = s.split("|");
        if (parseInt(arr[0]) == EActionType.CreateRoom) {
            let obj: IGuideCreateRoom = {} as IGuideCreateRoom;
            obj.nickName = arr[1];
            obj.lv = parseInt(arr[2]);
            obj.trophy = parseInt(arr[3]);
            obj.headUrl = arr[4];
            obj.mode = parseInt(arr[5]);
            obj.ownerMonsterMaxCount = parseInt(arr[6]);
            obj.enemyMonsterMaxCount = parseInt(arr[7]);
            // LogSys.Log(this.toString()+`房间信息`);
            return obj;
        }
    }

    /**根据流水号删除英雄 */
    static delHeroByUID(uid:number){
        let vo = new ComposeUpdate_revc();
        vo.type = EComposeUpdateType.Compose;
        vo.datalist = [];
        vo.dellist = [uid];
        this.model.onComposeUpdate(vo);
    }
}