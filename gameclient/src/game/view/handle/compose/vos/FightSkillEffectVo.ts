import { E } from "../../../../G";
import { stFightSkillEffect } from "../../../../network/protocols/BaseProto";
import { ISkillClientEffectCfg, SkillListProxy, t_Skill_Skin } from "../../skill/proxy/SkillProxy";
export enum EFightSkillActionType{
    /**技能类型 */
    Skill = 1
}
export class FightSkillEffectVo {
    private vo: stFightSkillEffect;
    /**攻击间隔 越大速度越快 */
    atktime:number = 0;
    skillCfg:Configs.t_Skill_dat;
    constructor(_vo: stFightSkillEffect) {

        if(Laya.Utils.getQueryString("skillid")){
            _vo.params = [parseInt(Laya.Utils.getQueryString("skillid"))];
        }

        this.vo = _vo;
        if(_vo.type == EFightSkillActionType.Skill){
            let skillId:number = _vo.params[0];
            let cfg = SkillListProxy.Ins.getCfgById(skillId);
            if(cfg){
                this.skillCfg = cfg;
                if(_vo.params.length > 1){
                    let val:number = _vo.params[1];
                    if(val > 0){
                        this.atktime = _vo.params[1] / 10;
                    }
                }
            }
        }
    }
    /**转化为皮肤技能特效 */
    convertSkillCfg(f_skinid:number):ISkillClientEffectCfg{
        if(f_skinid!=0){
            let tb:t_Skill_Skin = E.tableMgr.getTable(t_Skill_Skin.NAME);
            if(tb){
                let cfg = tb.getCfg(f_skinid,this.skillCfg.f_skillid);
                if(cfg){
                    return cfg;
                }
            }
        }
        return this.skillCfg;
    }
    /**攻击者索引 */
    get index() {
        if (this.vo) {
            return this.vo.index;
        }
        return 0;
    }
}