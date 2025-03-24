import { FSMState } from "../base/FsmState";

/**奔跑状态*/
export class FSM_Run<T> extends FSMState<T> {

    constructor() {
        super();
        this.StateID = 2;
    }

    public Enter() {
        console.log("Enter run");

    }

    public Update() {
        console.log("Update run");

    }

    public Exit() {
        console.log("Exit run");

    }

    public Destroy() {
        console.log("Destroy run");

    }

}