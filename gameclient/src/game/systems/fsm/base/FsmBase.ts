/**状态机基类*/
export abstract class FSMBase {
    constructor(fsmId: number) {
        this.FSMId = fsmId;
    }

    public FSMId: number;       //状态机编号
    public Owner: any;          //状态机拥有者

    public abstract ShutDown(); //销毁
}