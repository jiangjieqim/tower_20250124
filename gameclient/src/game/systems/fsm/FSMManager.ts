import {FSMSingle} from "./base/FSMSingle";
import {FSMBase} from "./base/FsmBase";
import { FSMState } from "./base/FsmState";
// import {Dictionary} from "../../../frame/structure/Dictionary";

/**状态机管理类*/
export class FSMManager {

    static _ins: FSMManager;
    static get Ins() { if (this._ins == null) this._ins = new FSMManager(); return this._ins; }

    private _fsmDic: Dictionary<number, FSMBase>;   //所有状态机
    private _fsmId: number = 0;                     //自增id

    constructor() {
        this._fsmDic = new Dictionary<number, FSMBase>();
        this._fsmId = 0;
    }

    /**创建状态机
     * @param startState 起始状态
     * @param owner 归属
     * @param states 状态列表
    */
    public Create<T>(startState: number, owner: T, states: FSMState<T>[]): FSMSingle<T> {
        this._fsmId += 1;
        let fsm = new FSMSingle<T>(startState, this._fsmId, owner, states);
        this._fsmDic.Add(this._fsmId, fsm);
        return fsm;
    }

    /**销毁状态机
     * @param fsmId 状态机Id
    */
    public DestroyFSM(fsmId: number): void {
        let fsm = null;
        if (this._fsmDic.Value(fsmId)) {
            fsm = this._fsmDic.Value(fsmId);
            fsm.ShutDown();

            this._fsmDic.Remove(fsmId);
        }
    }

    public static Test() {
        // let role = new RoleEntity();
        // let fsm = this.Ins.Create(1, role, [
        //     new FSM_Idle<RoleEntity>(),
        //     new FSM_Run<RoleEntity>(),
        // ]);

        // let counter = 0;
        // Laya.timer.frameLoop(1, this, () => {
        //     counter++;
        //     fsm.Update();
        //     if (counter % 10 == 1) {
        //         fsm.ChangeState(1);
        //     }
        //     else if (counter % 10 == 2) {
        //         fsm.ChangeState(2);
        //     }
        //     else if (counter == 300) {
        //         Laya.timer.clearAll(this);
        //         this.Ins.DestroyFSM(fsm.FSMId);
        //     }
        // });
    }
}
