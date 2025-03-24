
export class AbilityBase {
    protected _ability: EAbility = EAbility.None;
    public get Ability(): EAbility { return this._ability; }

    public constructor() {

    }

    public OnInit(data?: any) { }
    public OnUsed() { }

    public Update() { }
    public LateUpdate() { }
    public FixedUpdate() { }

}

/**能力枚举 */
export enum EAbility {
    None,   //未定义
    Idle,   //站立
    Move,   //移动
    Jump,   //跳跃
    Action, //动作
}