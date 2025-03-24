import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class SkillListProxy extends BaseCfg{
    private static _ins:SkillListProxy;

    public static get Ins(){
        if(!this._ins){
            this._ins = new SkillListProxy();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Skill";
    }

    public getCfgById(id:number):Configs.t_Skill_dat{
        let cfg = this.List.find(item => item.f_skillid == id);
        if(cfg){
            return cfg;
        }
        LogSys.Error(`getIconById 不存在t_Skill f_skillid ${id}`);
        return;
    }

    public getIconById(id:number){
        let cfg = this.getCfgById(id);
        if(cfg){
            return `o/skillicon/${cfg.f_skill_imageid}.png`;
        }
        return "static/question.png";
    }
    public getIconByType(cfg: Configs.t_Skill_dat) {
        if (cfg.f_type == 4) {
            return "remote/base/icon_zjjn.png";
        } else if (cfg.f_type == 6) {

            return "remote/base/icon_bd.png";
        } else {
            return "remote/base/icon_jn.png";
        }
    }
}
export interface ISkillClientEffectCfg{
    f_hit_animation_offset:string;
    f_skillid:number;
    f_hit_animation:number;
    f_hit_animation_type:number;
    f_hit_animation_scale:number;

    f_bullet_speed:number;
    f_bullet_spine_pass:number;
    f_bullet_pic:number;
    f_bullet_spine:number;
    f_skill_act:number;
}
/**皮肤技能特效 */
export class t_Skill_Skin extends BaseCfg{
    public GetTabelName(): string {
        return t_Skill_Skin.NAME;
    }
    static NAME:string = "t_Skill_Skin";

    getCfg(skinId:number,skillId:number){
        let l:Configs.t_Skill_Skin_dat[] = this.List;
        return l.find(o=>o.f_skinid ==skinId && o.f_skillid == skillId);
    }
}