import { stMonsterEffect, stMonsterEffectTarget } from "../../../../network/protocols/BaseProto";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { ComposeEvent } from "../ComposeEvent";
import { EEffectPos } from "../decorator/EAttackPosType";
import { IComposeModel } from "../ICompose";
import { EAvatarLayar, EEffectTarget } from "../vos/EFightEnum";
import { t_Attribute } from "../vos/t_Attribute";
enum EServerEffectTarget{
    Monster = 1,
    Hero = 2,
    Grid = 3,
}
// #region params
/*
+-------------------------------+
| 配置表t_Attribute字段f_effect |
+-------------------------------+

特效路径 resource\o\spine\skill

1|2 怪物播放动作2

2|12 怪物播放spine特效一次 特效路径 12

3|12 英雄播放spine特效一次 特效路径 12

4|16 英雄播放spine特效循环 特效路径 16 怪物死亡之后销毁特效

5|16 怪物播放spine特效循环 特效路径 16

6|49 在目标阵营的棋盘格中间播放特效 49

7|12 英雄所在位置格子(当英雄移除的时候使用该配置)播放spine特效12

组合用;隔开 如  1|2;2|12
*/
// #endregion
abstract class AttrActionBase{
    abstract target:EServerEffectTarget;
    monsterUID:number;
    params:string;
    adp:IComposeModel;
    vo:stMonsterEffectTarget;
    // monserUID:number;
    abstract init();
    toString(){
        return `AttrAction.... type:${this.vo.type} uid:${this.vo.uid} params: ${this.params} `;
    }
    convertURL(id:number){
        return `o/spine/skill/${id}/${id}`
    }
}
/**
 * 1|2
 * 怪物动作表现行为
 */
class AttrMonsterPlayAnimAction extends AttrActionBase{
    target:EServerEffectTarget = EServerEffectTarget.Monster;
    init(){
        let arr = this.params.split("|");
        let anim = parseInt(arr[1]);
        // if(this.adp.fightView){
        // this.adp.fightView.monsterPlayAnimOnce(this.vo.uid,anim);
        // }
        this.adp.event(ComposeEvent.MonsterPlayOnceAnim,[this.vo.uid,anim]);
        LogSys.Log(this.toString()+`AttrMonsterPlayAnimAction`);
    }
}

/**2|12 怪物播放spine特效一次 特效路径 resource\o\spine\skill\12*/
class AttrMonsterPlayOnceSpine extends AttrActionBase{
    target:EServerEffectTarget = EServerEffectTarget.Monster;
    init(){
        let arr = this.params.split("|");
        let id = parseInt(arr[1]);
        this.adp.playEffectAvatar(EEffectTarget.Monster,this.convertURL(id),EAvatarLayar.Top,this.vo.uid);
        LogSys.Log(this.toString()+`AttrMonsterPlayOnceSpine`);
    }
}
/*
3|12 英雄播放spine特效一次 特效路径 resource\o\spine\skill\12
*/
class AttrHeroPlayOnceSpine extends AttrActionBase{
    target:EServerEffectTarget = EServerEffectTarget.Hero;
    init(){
        let arr = this.params.split("|");
        let id = parseInt(arr[1]);
        this.adp.playEffectAvatar(EEffectTarget.Hero,this.convertURL(id),EAvatarLayar.Top,this.vo.uid);
        LogSys.Log(this.toString()+`AttrHeroPlayOnceSpine`);
    }
}
// 4|16 英雄播放spine特效循环 怪物死亡之后销毁特效 特效路径 resource\o\spine\skill\16
class AttrHeroLoopSpine extends AttrActionBase{
    target:EServerEffectTarget = EServerEffectTarget.Hero;
    init(){
        let arr = this.params.split("|");
        let id = parseInt(arr[1]);
        this.adp.addLoopEffectLoop(EEffectTarget.Hero,this.monsterUID,this.vo.uid,this.convertURL(id));
        LogSys.Log(this.toString()+`AttrHeroLoopSpine`);
    }
}
// 5|17 怪物播放spine特效循环 特效路径 resource\o\spine\skill\17
class AttrMonsterLoopSpine extends AttrActionBase{
    target:EServerEffectTarget = EServerEffectTarget.Monster;
    init(){
        let arr = this.params.split("|");
        let id = parseInt(arr[1]);
        this.adp.addLoopEffectLoop(EEffectTarget.Monster,this.vo.uid,this.vo.uid,this.convertURL(id));
        LogSys.Log(this.toString()+`AttrMonsterLoopSpine`);
    }
}
/**
 * 6|49 在目标阵营的棋盘格中间播放特效 49
 */
class AttrGridPlaySpine extends AttrActionBase{
    target: EServerEffectTarget = EServerEffectTarget.Grid;
    init() {
        let arr = this.params.split("|");
        let id = parseInt(arr[1]);
        let o = this.adp.getTargetLayerXY(EEffectPos.GridCenter,this.vo.uid);
        if(o){
            SpineEffectMgr.playOnce(this.convertURL(id), o.layer,o.curX, o.curY, 0);
            LogSys.Log(this.toString()+`AttrGridPlaySpine`);
        }
    }
}

/*
 *7|12 英雄所在位置播放spine特效一次
 */
class AttrHeroPosPlayOnceSpine extends AttrActionBase{
    target:EServerEffectTarget = EServerEffectTarget.Hero;
    init(){
        let arr = this.params.split("|");
        let id = parseInt(arr[1]);
        this.adp.playEffectAvatar(EEffectTarget.Grid,this.convertURL(id),EAvatarLayar.Top,this.vo.uid);
        LogSys.Log(this.toString()+`AttrHeroPosPlayOnceSpine`);
    }
}

export class AttrAction{
    private _clsMap;
    constructor(){
        this.initClsMap();
    }
    private initClsMap() {
        this._clsMap = {};
        this.regCls(1,AttrMonsterPlayAnimAction);
        this.regCls(2,AttrMonsterPlayOnceSpine);
        this.regCls(3,AttrHeroPlayOnceSpine);
        this.regCls(4,AttrHeroLoopSpine);
        this.regCls(5,AttrMonsterLoopSpine);
        this.regCls(6,AttrGridPlaySpine);
        this.regCls(7,AttrHeroPosPlayOnceSpine);
    }
    private regCls(type: number, _cls) {
        if (this._clsMap[type]) {
            throw Error(`ActionMgr type:${type} is exist class`);
        } else {
            this._clsMap[type] = _cls;
        }
    }
    private parse(adp:IComposeModel,monsterUID:number,vo:stMonsterEffectTarget,s:string){
        let arr = s.split(";");
        
        for(let i = 0;i < arr.length;i++){
            let s1 = arr[i];
            if(!StringUtil.IsNullOrEmpty(s1)){
                let a1 = s1.split(";")[0];
                let type = parseInt(a1);
                let _cls1 = this._clsMap[type];
                if (!_cls1) {
                    LogSys.Error(`未实现类型${type}的AttrAction!`);
                } else {
                    let act: AttrActionBase = new _cls1();
                    act.params = a1;
                    act.monsterUID = monsterUID;
                    // act.monserUID = monserUID;
                    act.vo = vo;
                    act.adp = adp;
                    if(act.target == vo.type){
                        act.init();
                    }
                }
            }
        }
    }

    parseCell(adp:IComposeModel,vo:stMonsterEffect){
        LogSys.Log("AttrAction.parseCell...."+JSON.stringify(vo));
        let attrCfg:Configs.t_Attribute_dat = t_Attribute.Ins.getByAttributeId(vo.attrId);
        for(let i = 0;i < vo.datalist.length;i++){
            let cell:stMonsterEffectTarget = vo.datalist[i];
            this.parse(adp,vo.monsterUid,cell,attrCfg.f_effect);
        }
    }
}