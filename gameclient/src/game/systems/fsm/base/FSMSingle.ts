// import {Dictionary} from "../../../../frame/structure/Dictionary";
import {FSMBase} from "./FsmBase";
import { FSMState } from "./FsmState";

/**单个状态机*/
export class FSMSingle<T> extends FSMBase {

    private _stateDic: Dictionary<number, FSMState<T>>;       //状态字典
    private _curState: FSMState<T>;                         //当前状态

    /**初始化状态机
     * @param startState 起始状态
     * @param fsmId 状态机Id
     * @param owner 归属对象
     * @param states 状态列表
    */
    constructor(startState: number, fsmId: number, owner: T, states: FSMState<T>[]) {
        super(fsmId);
        this._stateDic = new Dictionary<number, FSMState<T>>();
        this.Owner = owner;

        for (let i in states) {
            let state = states[i];
            this._stateDic.Add(state.StateID, state);
        }

        this._curState = this.GetState(startState);
        if (this._curState == null) {
            console.log("获取当前状态失败");
            return;
        }
        this._curState.Enter(this.Owner);
    }

    /**获取当前状态
     * @param stateId 状态枚举
    */
    public GetState(stateId: number): FSMState<T> {
        let state = this._stateDic.Value(stateId);
        return state;
    }

    /**执行当前状态*/
    public Update() {
        if (this._curState) {
            this._curState.Update(this.Owner);
        }
    }

    /**切换当前状态
     * @param newState 新状态
    */
    public ChangeState(newState: number) {
        if (this._curState == this._stateDic.Value(newState)) {
            return;
        }

        if (this._curState != null) {
            this._curState.Exit(this.Owner);
        }
        this._curState = this._stateDic.Value(newState);

        //进入新状态
        this._curState.Enter(this.Owner);
    }

    /**关闭状态机*/
    public ShutDown() {
        if (this._curState != null) {
            this._curState.Exit(this.Owner);
        }

        this._stateDic.Values().forEach(value => {
            value.Destroy();
        });

        delete this._stateDic;
    }
}