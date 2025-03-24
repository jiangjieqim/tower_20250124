import { BaseCfg, BaseCfgConstuctor } from "../../../static/json/data/BaseCfg";
import { ComposeModel } from "../compose/ComposeModel";
import { EMonsterPos } from "../compose/vos/FightValueConfig";
import { GuideUtils } from "./GuideUtils";

enum EFightGuideStopType{
    /**
     * 执行到多少毫秒后触发 
     **/
    Time = 0,
    
    /**
     * 怪物坐标 
     **/
    Monster = 1,
    /**
     * 流水号|坐标索引|阵营(0己方 1敌方) 
     **/
    MonsterUID = 2,

    /**
     * 怪物死亡触发
     * 怪物流水号
     */
    MonsterDeadUID = 3,

    /**
     * 所有怪物死亡 
     */
    AllMonsterDead = 4,

    /**
     * UI组件显示 
    */
    UIChildShow = 5,

    /**Boss出生的时候触发*/
    BossBirth = 6,

    /**Boss停止行为 */
    BossStopMove = 7,

    /**8 
     * 某一方出现指定的HeroId的英雄 */
    HeroCreate = 8,

    /**9 怪物uid出生*/
    MonsterBirth = 9
}

class FightGuideStopVo{
    private _cfg:Configs.t_FightGuideStop_dat;
    private monsterID:number;
    private monsterPosIndex:number;

    private monsterUID:number;
    private f_owner:number;

    constructor(cfg:Configs.t_FightGuideStop_dat){
        this._cfg = cfg;
        this.parse();
    }

    private parse(){
        switch(this._cfg.f_type){
           
            case EFightGuideStopType.Monster:
                let monster = this._cfg.param.split("|");
                //this._cfg.f_monster.split("-");
                this.monsterID = parseInt(monster[0]);
                this.monsterPosIndex = parseInt(monster[1]);
                this.f_owner = parseInt(monster[2]);
                break;

            case EFightGuideStopType.MonsterUID:
                let arr1 = this._cfg.param.split("|");
                this.monsterUID = parseInt(arr1[0]);
                this.monsterPosIndex = parseInt(arr1[1]);
                this.f_owner = parseInt(arr1[2]);
                break;

            case EFightGuideStopType.MonsterDeadUID:
                //f_type:3 param:20
                this.monsterUID =  parseInt(this._cfg.param);
                break;

            case EFightGuideStopType.AllMonsterDead:
                this.f_owner = parseInt(this._cfg.param);
                break;
        }
    }

    private get model() {
        return ComposeModel.Ins;
    }

    canStop(curMs: number) {
        if(!this.model.fightView){
            return false;
        }
        let monsters = this.model.fightView.monsterList;

        switch (this._cfg.f_type) {
            case EFightGuideStopType.Time:
                if (curMs >= this._cfg.f_time) {
                    return true;
                }
                break;

            case EFightGuideStopType.Monster:
                // if (this.model.fightView) {
                    // let monsters = this.model.fightView.monsterList;
                    for (let i = 0; i < monsters.length; i++) {
                        let o = monsters[i];
                        if (o.isLoaded) {
                            if (o.vo.fid == this.monsterID ) {
                                
                                let playerid:number =  this.f_owner == 0 ? this.model.ownerPlayer.playerId : this.model.enemyPlayer.playerId;

                                if(playerid == o.vo.playerId && o.curPosIndex >= this.monsterPosIndex){
                                    LogSys.Log(`${this.toString()} 怪物位置检测 ${o.curPosIndex},${this.monsterPosIndex} 下一步引导...`);
                                    return true;
                                }
                            }
                        }
                    }
                // }
                break;

            case EFightGuideStopType.MonsterUID:
                // if (this.model.fightView) {
                {
                    // let monsters = this.model.fightView.monsterList;
                    for (let i = 0; i < monsters.length; i++) {
                        let o = monsters[i];
                        if (o.isLoaded) {
                            if (o.vo.uid == this.monsterUID) {
                                let playerid: number = this.f_owner == EMonsterPos.Owner ? this.model.ownerPlayer.playerId : this.model.enemyPlayer.playerId;
                                if (playerid == o.vo.playerId && o.curPosIndex >= this.monsterPosIndex) {
                                    LogSys.Log(`${this.toString()} 怪物 uid:${this.monsterUID} ,位置检测 ${o.curPosIndex},${this.monsterPosIndex} 下一步引导...`);
                                    return true;
                                }
                            }
                        }
                    }
                }
                // }
                break;

            case EFightGuideStopType.MonsterDeadUID:
                if(this.model.removeUIDs.indexOf(this.monsterUID) !=-1){
                    return true;
                }
                break;
            case EFightGuideStopType.AllMonsterDead:
                {
                    let monsterCount:number = 0;
                    // let monsters = this.model.fightView.monsterList;
                    for (let i = 0; i < monsters.length; i++) {
                        let o = monsters[i];
                        // if (o.isLoaded) {
                        let playerid: number = this.f_owner == EMonsterPos.Owner ? this.model.ownerPlayer.playerId : this.model.enemyPlayer.playerId;
                        if (playerid == o.vo.playerId) {
                            monsterCount++;
                        }
                        // }
                    }
                    if(monsterCount <=0){
                        LogSys.Log(`${this.toString()} 所有怪物死亡,触发下一步引导`)
                        return true;
                    }
                }
                break;

            case EFightGuideStopType.UIChildShow:
                let sp = GuideUtils.getUIByKeySt(this._cfg.param);
                if(sp && sp.visible){
                    LogSys.Log(`${this.toString()} UI组件显示,触发下一步引导`)
                    return true;
                }
                break;
            
            case EFightGuideStopType.BossBirth:
                {
                    for (let i = 0; i < monsters.length; i++) {
                        let _monster = monsters[i];
                        if(_monster.isLoaded && _monster.monsterType == parseInt(this._cfg.param)){
                            // if(_monster.bloodView && _monster.bloodView.parent){
                            LogSys.Log(`${this.toString()} boss类型${_monster.monsterType}出生 下一步引导...`);
                            return true;
                            // }
                        }
                    }
                }
                break;
            
            case EFightGuideStopType.BossStopMove:
                // 7 boss移动到所在位置 参数2,3代表boss类型
                // 2|1200
                let arr = this._cfg.param.split("|")
                let monsterType = parseInt(arr[0]);
                let pos:number = parseInt(arr[1]);
                for (let i = 0; i < monsters.length; i++) {
                    let _monster = monsters[i];
                    if(_monster.isLoaded && _monster.monsterType == monsterType){
                        if(_monster.curPosIndex >=pos){
                            LogSys.Log(`${this.toString()} 类型${monsterType}为BOSS 位置${pos}检测 下一步引导...`);
                            return true;
                        }
                    }
                }
                break;

            case EFightGuideStopType.HeroCreate:
                if(this.checkHeroHave()){
                    return true;
                }
                break;
            // case EFightGuideStopType.GambleCountCheck:
            //     let guide = GuideModel.Ins;
            //     let needCount:number = parseInt(this._cfg.param);
            //     if(guide && guide.gambleCounter && guide.gambleCounter.count >= needCount ){
            //         guide.gambleCounter.dispose();
            //         return true;
            //     }
            //     break;

            case EFightGuideStopType.MonsterBirth:
                {
                    let uid:number = parseInt(this._cfg.param);
                    for (let i = 0; i < monsters.length; i++) {
                        let _monster = monsters[i];

                        if(_monster.isLoaded && _monster.vo.uid == uid){
                            LogSys.Log(`${this.toString()} 怪物uid:${uid}出生 下一步引导...`);
                            return true;
                        }
                    }
                }
                break;
        }
        return false;
    }


    private checkHeroHave() {
        //23|0 己方阵营出现heroid 23英雄 23|1敌方阵营出现heroid23英雄
        let arr = this._cfg.param.split("|");
        let heroId: number = parseInt(arr[0]);
        let f_owner: number = parseInt(arr[1]);
        let playerid: number = f_owner == EMonsterPos.Owner ? this.model.ownerPlayer.playerId : this.model.enemyPlayer.playerId;
        let heros = this.model.fightView.gridItemList;
        for (let i = 0; i < heros.length; i++) {
            let _hero = heros[i];
            if (_hero.data.fid == heroId && playerid == _hero.data.playerId) {
                LogSys.Log(`${this.toString()} 阵营${f_owner}出现heroid ${heroId} 下一步引导...`);
                return true;
            }
        }
    }
    toString(){
        return `t_PVE_Guide_Next: f_id:${this._cfg.f_id} type:${this._cfg.f_type} param:${this._cfg.param} time:${this._cfg.f_time}`;
    }
}
export class FightStopMgr {
    stopList:FightGuideStopVo[] = [];
    private b:BaseCfg;
    constructor() {
        
    }
    dispose(){
        this.b && this.b.dispose();
        this.b = null;
    }
    init(table:string) {
        let b:BaseCfg = new BaseCfgConstuctor(table);
        let l = b.List;
        this.stopList = [];
        // let l = t_FightGuideStop.Ins.List;
        for(let i = 0;i < l.length;i++){
            let vo = new FightGuideStopVo(l[i]);
            this.stopList.push(vo);
        }
        // LogSys.Log(1);
    }

    check(curMs:number){
        if(this.stopList.length){
            let o = this.stopList[0];
            if(o.canStop(curMs)){
                this.stopList.shift();
                return true;
            }
        }
    }
}