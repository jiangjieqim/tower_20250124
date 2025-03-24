import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { EViewType } from "../../../common/defines/EnumDefine";
import { SkillTip } from "./view/SkillTip";

export class SkillModule extends BaseModel{
    private static _ins:SkillModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new SkillModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new SkillTip(EViewType.SkillTip));
    }
}