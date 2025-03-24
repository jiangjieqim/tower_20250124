import { BTAI_Base } from "./BTAI_Base";
import { BTAI_Behaviour } from "./BTAI_Behaviour";

// <summary>
// 节点：对象工厂
// </summary>
export class BT {

    private constructor() { }
    public static Root(): BTAI_Base.Root {
        return new BTAI_Base.Root();
    }

    public static Sequence(): BTAI_Base.Sequence {
        return new BTAI_Base.Sequence();
    }

    public static Selector(shuffle: boolean): BTAI_Base.Selector {
        return new BTAI_Base.Selector(shuffle);
    }

    public static Call(fn: Function): BTAI_Base.Action {
        return new BTAI_Base.Action(fn);
    }

    public static If(fn: Function): BTAI_Base.ConditionalBranch {
        return new BTAI_Base.ConditionalBranch(fn);
    }

    public static While(fn: Function): BTAI_Base.While {
        return new BTAI_Base.While(fn);
    }

    public static Condition(fn: Function): BTAI_Base.Condition {
        return new BTAI_Base.Condition(fn);
    }

    public static Repeat(count: number): BTAI_Base.Repeat {
        return new BTAI_Base.Repeat(count);
    }

    public static RandomSequence(weights: number[] = null): BTAI_Base.RandomSequence {
        return new BTAI_Base.RandomSequence(weights);
    }

    public static Wait(seconds: number): BTAI_Behaviour.Wait {
        return new BTAI_Behaviour.Wait(seconds);
    }

    public static Terminate(): BTAI_Behaviour.Terminate {
        return new BTAI_Behaviour.Terminate();
    }

    public static Log(msg: string): BTAI_Behaviour.Log {
        return new BTAI_Behaviour.Log(msg);
    }

    public static Move(): BTAI_Behaviour.Move {
        return new BTAI_Behaviour.Move();
    }

    // public static MoveToBornPos(ctrl: RoleCtrl): BTAI_Behaviour.MoveToBornPos {
    //     return new BTAI_Behaviour.MoveToBornPos(ctrl);
    // }

    // public static MoveToTarget(ctrl: RoleCtrl): BTAI_Behaviour.MoveToTarget {
    //     return new BTAI_Behaviour.MoveToTarget(ctrl);
    // }

    //#region 元宇宙AI
    // public static MetaMove(ctrl: AICtrl): BTAI_Behaviour.MetaMove {
    //     return new BTAI_Behaviour.MetaMove(ctrl);
    // }

    // public static MetaIdle(ctrl: AICtrl): BTAI_Behaviour.MetaIdle {
    //     return new BTAI_Behaviour.MetaIdle(ctrl);
    // }
    // //#endregion

    //     //#region 矿场
    // //矿车移动
    // public static MineCarMove(ctrl: AICtrl): BTAI_Behaviour.MineCarMove {
    //     return new BTAI_Behaviour.MineCarMove(ctrl);
    // }
    //#endregion

}