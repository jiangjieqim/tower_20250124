
/**事件条目*/
export class Callback {

    private _caller: any;//调用域
    private _callback: Function;//执行方法

    public static Create(caller: any, callback: Function): Callback {
        let func = new Callback();
        func._caller = caller;
        func._callback = callback;
        return func;
    }

    public get Caller() { return this._caller; }
    public get CallBack() { return this._callback; }

    public Clear() {
        this._caller = null;
        this._callback = null;
    }

    /**执行事件*/
    public Invoke(data?: any) {
        if (this._callback){
            return this._callback.call(this._caller, data);
        }
    }
}
