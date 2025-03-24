// import {Dictionary} from "../../../frame/structure/Dictionary";
import { ActionAbility } from "./abilitys/ActionAbility";
import { IdleAbility } from "./abilitys/IdleAbility";
import { JumpAbility } from "./abilitys/JumpAbility";
import { MoveAbility } from "./abilitys/MoveAbility";
import { AbilityBase, EAbility } from "./base/AbilityBase";

/**能力管理器 */
export class AbilityManager {

    public Init() {
        this._abilityDic = new Dictionary<EAbility, typeof AbilityBase>();
        this.regAbility(EAbility.Move, MoveAbility);
        this.regAbility(EAbility.Jump, JumpAbility);
        this.regAbility(EAbility.Idle, IdleAbility);
        this.regAbility(EAbility.Action, ActionAbility);
    }

    private _abilityDic: Dictionary<EAbility, typeof AbilityBase>;

    /**注册能力类 */
    private regAbility(type: EAbility, ab: typeof AbilityBase) {
        if (this._abilityDic.HasKey(type)) {
            console.warn("regAbility error,hasreg type:" + type);
            return;
        }
        this._abilityDic.Add(type, ab);
    }

    /**获取能力类 */
    private getAbility(type: EAbility): typeof AbilityBase {
        if (this._abilityDic.HasKey(type))
            return this._abilityDic.Value(type);
        console.warn("getAbility error,unreg type:" + type);

        return null;
    }

    /**获取能力类 */
    public GetAbility(type: EAbility): typeof AbilityBase {
        return this.getAbility(type);
    }

}