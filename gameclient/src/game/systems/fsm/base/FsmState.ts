
/**状态类*/
export abstract class FSMState<T> {
    public StateID: number = 0;
   
    /**进入状态*/
    public abstract Enter(owner: T);
    /**执行状态*/
    public abstract Update(owner: T);
    /**离开状态*/
    public abstract Exit(owner: T);
    /**销毁*/
    public abstract Destroy();

}