
/**定时器条目*/
export class TimerItem {

    private _caller: any;
    private _startTrig: boolean = false;    //开始时触发
    private _duration: number = 0;          //间隔时长
    private _loop: number = 0;              //循环
    private _progress: Callback;            //进程回调
    private _complete: Callback;            //完成回调
    private _timer: number = 0;

    /**执行域 */
    public get Caller() { return this._caller; }
    /**循环次数 */
    public get Loop() { return this._loop; }
    /**持续循环 -1表示一直循环*/
    public get Looping() { return this._loop == -1; }
    /**是否已结束 */
    public get IsFinish(): boolean { return this._loop == 0; }

    /**构造
     * @param duration 间隔时长 ms
     * @param loop 循环次数-执行一次 -1=持续
     * @param progress 每次执行回调
     * @param complete 完成回调
     * @param startTrig 刚开始时触发进度事件
    */
    constructor(caller: any, duration: number, loop: number, progress: Function, complete: Function, startTrig: boolean = false) {
        this._caller = caller;
        this._duration = duration;
        this._loop = loop;
        this._progress = Callback.Create(caller, progress);
        this._complete = Callback.Create(caller, complete);
        this._startTrig = startTrig;

        if (this._startTrig) {
            if (this._progress != null)
                this._progress.Invoke(0);
        }
    }

    public Update(time: number) {
        if (this.IsFinish) return;
        this._timer += time;
        if (this._timer >= this._duration) {
            this._timer = 0;
            if (this._progress != null)
                this._progress.Invoke(time);

            if (this._loop > 0) {
                this._loop--;
                if (this.IsFinish) {
                    if (this._complete) this._complete.Invoke();
                }
            }
        }
    }

    public Clear() {
        this._caller = null;
        this._startTrig = false;
        this._duration = 0;
        this._loop = 0;
        this._progress = null;
        this._complete = null;
        this._timer = 0;
    }

}