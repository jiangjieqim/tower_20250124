import { MonsterBirth_revc, MonsterWalk_revc, stMonsterBirth, stMonsterWalk } from "../../../../../network/protocols/BaseProto";
import { MainModel } from "../../../main/model/MainModel";
import { ComposeModel } from "../../ComposeModel";
import { FightUtils } from "../../FightUtils";
// import { t_Monster } from "../../t_Monster_Template";
import { FightValueConfig } from "../../vos/FightValueConfig";

/**行走测试 */
export class DebugFightWalk {
    private get model() {
        return ComposeModel.Ins;
    }
    private readonly monsterId: number = 1;
    private bornTime:number[] = [];
    private speed:number;
    private readonly _monsterCount:number = 1;
    private get maxIndex(){
        let ml = FightUtils.curMoveList;
        let fullVal:number = (ml.length - 1) * FightValueConfig.DEV_COUNT;//一圈的值
        return fullVal;
    }
    constructor() {
        // E.ViewMgr.Close(EViewType.FuncCard2);
        //=====================================

        LogSys.Log(`maxIndex:${this.maxIndex}`);

        let revc: MonsterBirth_revc = new MonsterBirth_revc();
        // revc.serverTime = TimeUtil.serverTimeMS/1000;
        
        revc.datalist = [];
        for (let i = 0; i < this._monsterCount; i++) {
            let maxBlood = 1000;//waveVo.maxBlood;
            let _monsterId: number = this.monsterId;
            let cell = new stMonsterBirth();
            cell.fid = _monsterId;//waveVo.monsterId;
            cell.playerId = MainModel.Ins.mRoleData.AccountId;//playerId;
            cell.curBlood = maxBlood;
            cell.blood = maxBlood;

            // let _monsterCfg = t_Monster.Ins.getCfgMonsterid(waveVo.monsterId);
            // let _monsterTempCfg = t_Monster_Template.Ins.getMonsterTemplate(_monsterCfg.f_monster_template_id);
            // let _speed:number = parseInt(_monsterTempCfg.f_10003.split(":")[1]);

            let _speed: number = this.model.fightTypeAdaper.monsterCfg.getTempSpeed(_monsterId);
            this.speed = _speed;
            cell.time = i * _speed;
            cell.index = 0;
            cell.uid = i + 1;//this.createMonsterUID();
            // this.addMonsterBirth(cell.uid, this.curMs + cell.time, maxBlood);
            this.bornTime.push(Laya.timer.currTimer/1000);
            revc.datalist.push(cell);
        }
        this.model.sceneInfo.monsters = this.model.sceneInfo.monsters.concat(revc.datalist);
        this.model.onMonsterBirth(revc);
        Laya.timer.once(this.speed, this, this.onLoop);
    }

    walkoffset(uid: number, offset: number) {
        let avatar =  this.model.fightView.monsterList.find(o=>o.vo.uid == uid);
        if(!avatar){
            return;
        }
        let _walkList: stMonsterWalk[] = [];
        let walkVo = new stMonsterWalk();
        let _speed: number = this.model.fightTypeAdaper.monsterCfg.getTempSpeed(this.monsterId);
        let _targetIndex:number =  avatar.curPosIndex+offset;
        if(_targetIndex >= this.maxIndex){
            _targetIndex = 0;
        }
        walkVo.index = _targetIndex;
        walkVo.uid = uid;
        walkVo.time = _speed;
        _walkList.push(walkVo);
        if (_walkList.length > 0) {
            let walkRevc = new MonsterWalk_revc();
            walkRevc.datalist = _walkList;
            this.model.onMonsterWalk(walkRevc);
        }
    }

    walkset(uid:number,_targetIndex:number){
        let avatar =  this.model.fightView.monsterList.find(o=>o.vo.uid == uid);
        if(!avatar){
            return;
        }
        let _walkList: stMonsterWalk[] = [];
        let walkVo = new stMonsterWalk();
        let _speed: number = this.model.fightTypeAdaper.monsterCfg.getTempSpeed(this.monsterId);
        // let _targetIndex:number =  avatar.curPosIndex+offset;
        if(_targetIndex >= this.maxIndex){
            _targetIndex = 0;
        }
        walkVo.index = _targetIndex;
        walkVo.uid = uid;
        walkVo.time = _speed;
        _walkList.push(walkVo);
        if (_walkList.length > 0) {
            let walkRevc = new MonsterWalk_revc();
            walkRevc.datalist = _walkList;
            this.model.onMonsterWalk(walkRevc);
        }
    }

    private onLoop(){
        this.walkoffset(1,100);
        Laya.timer.once(this.speed, this, this.onLoop);
    }
}