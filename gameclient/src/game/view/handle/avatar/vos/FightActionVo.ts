/**
 * 动作类型
 */
// export enum EActionType{
    // Move = 1,//移动
    // Skill = 2,//技能触发
// }

import { EMsgBoxType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
export enum ESkillId{
    /**暴击伤害扣血时候的的技能id */
    CriticalStrike = 10000,
}

/**
 * Recover 恢复 和 PassiveHurtBlood 减血做预判
 */
export enum EServerSkillType{
    /**
     * 普通攻击
     */
    NormalAttack = 1,

    /**
     * 吸血
     */
    SuckBlood = 2,

    /**
     * 暴击
     */
    CriticalStrike = 3,

    /**
     * 受击闪避
     */
    PassiveDodge = 4,

    /**
     * 受击动作 受到普攻0 受到暴击1 受到眩晕2
     */
    PassiveAnim = 5,

    /**
     * 受击伤害减血
     */
    PassiveHurtBlood = 6,

    /**
     * 一方动作结束,一个回合2个结束动作  (0回到自己的位置 1冲向对方阵地)
     */
    Move = 8,

    /**
     * 回合数
     */
    Round = 9,

    /**死亡 */
    Dead = 10,

    /*血量恢复*/
    Recover = 11,

    /**连击反击 */
    SkillType = 12,

    /**
     * 重置为站立动作
     */
    ResetStand = 13,
    /**复活后设置血量 */
    ReviveSetBlood = 14,

    // SkillStart = 15,
    // SkillEnd = 16,
    // /**神兵 val代表神兵id*/
    // Shengbin = 17,

    // DeadStart = 18,
    // DeadEnd= 19,

    /**技能 */
    Skill = 20,
    /**远程攻击*/
    RemoteAttack = 21,


    BuffStart = 22,

    BuffEnd = 23,
    
    /**格挡 */
    ShoveAside = 24,

      /** 远程普攻 */
    RemoteServerAtk = 25,
    
      /** 远程暴击 */
    RemoteServerCsAtk = 26,
}

export  enum EActionSkill{


    /**
     * 死亡(失败方最终状态)
     */
    ClientDie = -2,

    //移动
    ClientMove = -1,

    /**
     * 普通攻击
     */
    NormalAttack = 1,

    /**
     * 吸血
     */
    SuckBlood = 2,

    /**
     * 暴击攻击
     */
    CriticalStrike = 3,

    /**
     * 受击闪避
     */
    PassiveDodge = 4,

    /**
     * 受击动作
     * val 受到普攻0 受到暴击1 受到眩晕2
     */
    PassiveAnim = 5,

    /**
     * 受击伤害减血
     */
    PassiveHurtBlood = 6,


    /**
     * 受击暴击
     */
    // PassiveCriticalStrike = 7,

    /**
     * 向前向后移动
     */
    // End = 8,

    //受击动作
    HurtAnim = 10,

    //回合
    Round = 11,

    /**播放恢复动画 回复血量*/
    Recover = 12,

    /**连击 */
    LianJi = 13,
    
    /**重置为待机动作 */    
    ResetStand = 13.5,

    /**复活重置血量 */
    ReviveSetBlood = 14,

    // /**技能开始 */
    // SkillStart = 15,

    // /**技能结束 */
    // SkillEnd = 16,
	// /*死亡开始*/
    // DeadStart = 18,
	// /*死亡结束*/
    // DeadEnd= 19,


    /**反击 */
    StrikeBack = 20,
    /**技能 */
    Skill = 20.5,
    
    /**远程攻击 */
    RemoteAttack = 21,

    /**连击,反击 */
    SkillType = 22,

    BuffStart = 22.5,

    BuffEnd = 22.75,
    /**格挡触发 */
    ShoveAside = 24,

    /** 远程普攻 */
    RemoteServerAtk = 25,

    /** 远程暴击 */
    RemoteServerCsAtk = 26,
}

export class FightActionVo{
    /**服务器数据 */
    public serverData;//:stFightAction;
    public serverSkillId:number;
    /**服务器序列 */
    // public serverOrder:number;
    public onceActionList:FightActionVo[];//同时并发的action
    /*神兵id（type是log时有，其他情况传0）*/
	// public log_artifactId:number;

	/*技能id（type是log时有，其他情况传0）*/
	// public log_skillId:number;
    // public animEndTime:number
    public isUsed:boolean = false;
    /*动作序号*/
    public order:number = 0;
    /**当前所在回合 */
    public round:number = 0;
    /**前置 */
    public front:FightActionVo;
    public back:FightActionVo;
    /**
     * 技能id
     */
    public skillID:EActionSkill = 0;

    private _index:number;

    /**
     * 1,2,3,4,5,6 表示战斗中的角色站位,从1开始
     */
    public get index():number{
        return this._index;
    }

    public set index(v:number){
        this._index = v;
    }
    
    // get index(){
    //     let l = this.targetList;
    //     if(l.length > 0){
    //         return l[0].target;
    //     }
    //     else{
    //         if(E.Debug){
    //             throw Error("==============>");
    //         }
    //         return 1;
    //     }
    // }

    public targetList;//:stFightData[];
    
    /**
     * 对象索引 0 表示己方 1 敌方,
     */
    // public get owner():number{
    // return this.index > AvatarFactory.maxSideCount ? 1 : 0;
    // }

    // public get color(){
        // if(this.skillID ==  EActionSkill.SkillStart || this.skillID == EActionSkill.SkillEnd){
        // return "color:#0000ff";
        // }
        // return this.owner == 1 ? "color:#ff0000" : "color:#000000";
    // }

    /**
     * 移动的目标坐标
     */
    // public targetX:number = 0;

    /**需要移动到的索引 */
    // public movePosIndex:number = 0;

    /*是否是后移,回到原站位的位置*/
    // public isBack:boolean = false;

    public delayTime0:number = 0;
    // public delayTime1:number = 0;
    /**
     * 值
     */
    // public val: number = 0;
    private getSkillName(){
        switch(this.skillID){
            case EActionSkill.ClientDie:
                return "死亡";
            case EActionSkill.ClientMove:
                return "Client移动";
            case EActionSkill.NormalAttack:
                return "普攻";
            case EActionSkill.SuckBlood:
                return "吸血";
            case EActionSkill.CriticalStrike:
                return "暴击";
            case EActionSkill.PassiveDodge:
                return "受击闪避";
            case EActionSkill.PassiveAnim:
                // 受到普攻0 受到暴击1 受到眩晕2
                let str = "";
                // switch(this.val){
                //     case 0:
                //         str = "普攻";
                //         break;
                //     case 1:
                //         str = "暴击";
                //         break;
                //     case 2:
                //         str = "眩晕";
                //         break;
                // }
                return "受击动作"+":"+str + ",动作值:";
            case EActionSkill.PassiveHurtBlood:
                return "受击伤害减血";
            // case EActionSkill.End:
                // return "移动";
            case EActionSkill.HurtAnim:
                return "受击动作";
            case EActionSkill.Round:
                return "回合";
            case EActionSkill.LianJi:
                return "连击";
            case EActionSkill.Recover:
                return "回复血量";
            // case EActionSkill.SkillStart:
                // return "技能开始:" + this.skinName;
            // case EActionSkill.SkillEnd:
                // return "技能结束:" + this.skinName;
            case EActionSkill.StrikeBack:
                return "反击";
            case EActionSkill.Skill:
                return "指定技能->" + this.skinName;
        }
    }

    private get skinName() {
        // let skillcfg: Configs.t_Skill_EffectT_dat = t_Skill_Effect.Ins.getBySkillID(this.val);
        // let s: string = "";
        // if (skillcfg) {
        //     s = this.val + "|" + skillcfg.f_SkillName;
        // } else {
        //     s = this.val.toString();
        // }
        // return s;
        return "";
    }

    public toString() {
        let s = "";//( this.isBack ? "向后":"向前") + " delayTime:" + this.delayTime;
        if(this.skillID!=EActionSkill.ClientMove){
            // s = "";
        }else{
            s = "移动";
        }
        // let owner:string = "";//this.owner == 0  ? "己":"敌";

        let p = "";
        // if(this.log_artifactId){
        //     p+="神兵id:"+this.log_artifactId+"\t";
        // }
        // if(this.log_skillId){
        // p+="Server-SkillId:"+this.log_skillId+"\t";
        // }
        s+=p;
        let _serverData="";
        if(this.serverData){
            _serverData = "服务器数据:["+JSON.stringify(this.serverData)+"]";
        }

        let s1 = Laya.timer.currTimer + _serverData + "\n|round:" + this.round + "\t client_order:" + this.order + "\n|"  + "Client-skillID:" + this.skillID + "\t" + this.getSkillName()  + "\tmoveIndex:"  + "\t" + s;
        let sign = "+";
        for(let i = 0;i < s1.length/2;i++){
            sign+="-";
        }
        sign+="+"
        return sign+"\n|"+s1+"\n"+sign;
    }
    constructor(index:number=0,id:EActionSkill,round:number = 0){
        this.index = index;
        this.skillID = id;
        // this.val = val;
        this.round=round;//设置回合数
    }

    // /**
    //  * 对方的前置攻击行为是否是暴击
    //  */
    // public getCsFrontCell(){
    //     let l = [];
    //     let front = this.front;
    //     while(front && front.round == this.round){
    //         if(front.index!=this.index){
    //             l.push(front);
    //         }
    //         front = front.front;
    //     }
    //     for(let i = 0;i < l.length;i++){
    //         let cell:FightActionVo = l[i];
    //         if(cell.skillID == EActionSkill.NormalAttack||
    //             cell.skillID == EActionSkill.CriticalStrike
    //             )
    //         {
    //             return cell;
    //         }
    //     }
    //     return;
    // }

    /**本回合内对方后置动作类型 */
    // public getOtherBackCell(type:EActionSkill){
    //     let l = [];
    //     let back = this.back;
    //     while(back && back.round == this.round){
    //         if(back.index!=this.index){
    //             l.push(back);
    //         }
    //         back = back.back;
    //     }
    //     for(let i = 0;i < l.length;i++){
    //         let cell:FightActionVo = l[i];
    //         if(
    //             cell.skillID == type
    //             // cell.skillID == EActionSkill.PassiveHurtBlood ||
    //             // cell.skillID == EActionSkill.PassiveAnim
    //             ){
    //             return cell;
    //         }
    //     }
    //     return;
    // }
    /**自己位置的下一个动作 */
    public getBackNext():FightActionVo{
        let l = this.getBackList();
        if(l.length > 0){
            let cell = l[0];
            return cell;
        }
        return;
    }

    /**本轮前置移动动作 */
    // public frontMove(){
    //     let l = [];
    //     let front = this.front;
    //     while(front && front.round == this.round){
    //         if(front.index==this.index){
    //             l.push(front);
    //         }
    //         front = front.front;
    //     }
    //     for(let i = 0;i < l.length;i++){
    //         let cell:FightActionVo = l[i];
    //         if(cell.skillID == EActionSkill.ClientMove)
    //         {
    //             return cell;
    //         }
    //     }
    //     return;
    // }

    // public getRountFrontCell(){
    //     let l = [];
    //     let front = this.front;
    //     while(front && front.round == this.round){
    //         if(front.index!=this.index){
    //             l.push(front);
    //         }
    //         front = front.front;
    //     }
    //     for(let i = 0;i < l.length;i++){
    //         let cell:FightActionVo = l[i];
    //         if(cell.skillID == EActionSkill.PassiveAnim||
    //             cell.skillID == EActionSkill.CriticalStrike
    //             )
    //         {
    //             return cell;
    //         }
    //     }
    //     return;
    // }

    /**
     * 前置动画结束时间戳(毫秒), 用于验证 前置动作是否播放完成了
     */
    // public getFrontAniEndTime(){
    //     let l = [];
    //     let front = this.front;
    //     while(front && front.round == this.round){
    //         if(front.index==this.index){
    //             l.push(front);
    //         }
    //         front = front.front;
    //     }
    //     let val:number = 0;
    //     for(let i = 0;i < l.length;i++){
    //         let cell:FightActionVo = l[i];
    //         if(cell.animEndTime && val < cell.animEndTime){
    //             val = cell.animEndTime;
    //         }
    //     }
    //     return val;
    // }
    /**当前回合的前置列表 */
    public getFrontList(){
        let l = [];
        let front = this.front;
        while(front && front.round == this.round){
            if(front.index==this.index){
                l.push(front);
            }
            front = front.front;
        }
        return l;
    }

    /**当前觉得的回合前置节点*/
    public get roundFront():FightActionVo{
        let l = this.getFrontList();
        if(l.length > 0){
            return l[0];
        }
    }

    // public getFront(){
    //     let l = this.getFrontList();
    //     if(l.length > 0){
    //         return l[0];
    //     }
    // }

    /**当前回合的后置列表 */
    public getBackList(){
        let l = [];
        let back = this.back;
        while(back && back.round == this.round){
            if(back.index==this.index){
                l.push(back);
            }
            back = back.back;
        }
        return l;
    }
    public hasVal(val:number){
        for(let i =  0;i < this.targetList.length;i++){
            let cell = this.targetList[i];
            if(cell.val == val){
                return true;
            }
        }
    }

    public checkTarget(){
        if(this.targetList.length <=0){
            // if(this.skillID == EActionSkill.Skill){
            //     this.targetList = [];
            //     let cell = new stFightData();
            //     cell.target = this.index;
            //     cell.val = this.serverData.skillId;
            //     this.targetList.push(cell);
            // }else{
            //     console.warn(this);
            // }
            console.warn(this);
            if(debug){
                E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,"fight err");
            }
        }else{
         
        }
    }
    
}
