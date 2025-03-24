// f_cooldown

import { ComposeModel } from "../compose/ComposeModel";
import { SkillListProxy } from "../skill/proxy/SkillProxy";

/**
 * 技能冷却检测
 */
export class SkillColdVo {
    /**英雄流水号id */
    uid: number;
    /**上次使用的技能id */
    private skillId: number;
    /**技能使用使用的时间戳 毫秒 */
    private time: number;
    check(dest: Configs.t_Skill_dat){
        let oldCfg = SkillListProxy.Ins.getCfgById(this.skillId);

        let sub = this.time + oldCfg.f_cooldown - this.clockTimeMs
        if(sub > 0){
            LogSys.Log( `uid: ${this.uid} 技能使用请求失败${dest.f_skillid} ${this.skillId} 技能冷却中..... 还需要${sub}毫秒...`);
            return false;
        }
        this.refreshSkillId(dest.f_skillid);
        return true;
    }

    refreshSkillId(skillId:number){
        this.skillId = skillId;
        this.time = this.clockTimeMs;
    }

    private get clockTimeMs(){
        return ComposeModel.Ins.curAdapter.clockTimeMs;
    }
}