import { FSMState } from "../base/FsmState";

/**待机状态*/
export class FSM_Idle<T> extends FSMState<T> {

    constructor() {
        super();
        this.StateID = 1;
    }

    public Enter() {
        console.log("Enter idle");

    }

    public Update() {
        console.log("Update idle");

    }

    public Exit() {
        console.log("Exit idle");

    }

    public Destroy() {
        console.log("Destroy idle");

    }

}