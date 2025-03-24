import { TimerItem } from "./TimerItem";

export class TimerMgr {

    private static _ins: TimerMgr = null;
    public static get Ins() {
        if (this._ins == null) this._ins = new TimerMgr();
        return this._ins;
    }
    private readonly minDuration: number = 1;

    private _addItems: TimerItem[];     //准备添加的条目
    private _removeItems: TimerItem[];  //准备移除的条目
    private _curItems: TimerItem[];     //当前条目

    private updateCount: number = 0;
    private get bUpdate(): boolean {
        return this.updateCount % 2 == 0;
    }

    constructor() {
        this._addItems = [];
        this._curItems = [];
        this._removeItems = [];
        this.updateCount = 0;

        Laya.timer.loop(this.minDuration, this, this.onTick, null, true);
    }

    /**
     * 添加计时器
     * @param caller 调用
     * @param duration 间隔时长 ms
     * @param loop 循环次数-执行一次 -1=持续
     * @param progress 每次执行回调
     * @param complete 完成回调
     * @param startTrig 刚开始时触发进度事件
     * 
     */
    public Add(caller: any, duration: number, loop: number, progress: Function, complete: Function, startTrig: boolean) {
        let item = new TimerItem(caller, duration, loop, progress, complete, startTrig);
        ListUtil.Add(this._addItems, item);
        return item;
    }

    public Remove(item: TimerItem) {
        if (!ListUtil.Contains(this._removeItems, item))
            ListUtil.Add(this._removeItems, item);
    }

    public ClearTimer(caller: any) {
        this._addItems.forEach(item => {
            if (item.Caller == caller) {
                ListUtil.Add(this._removeItems, item);
            }
        });
        this._curItems.forEach(item => {
            if (item.Caller == caller) {
                ListUtil.Add(this._removeItems, item);
            }
        });
    }

    public ClearAll() {
        this._addItems.forEach(item => item.Clear());
        this._curItems.forEach(item => item.Clear());
        this._removeItems.forEach(item => item.Clear());

        this._addItems = [];
        this._curItems = [];
        this._removeItems = [];
    }

    /**开始计时*/
    public Start() {
        this.updateCount++;
    }

    /**停止计时 */
    public Stop() {
        this.updateCount++;
    }

    private onTick() {
        if (!this.bUpdate) return;
        //如果已在移除列表则从 curItems和addItems中移除
        if (this._removeItems != null && this._removeItems.length > 0) {
            this._removeItems.forEach(item => {
                ListUtil.Remove(this._curItems, item);
                ListUtil.Remove(this._addItems, item);
            });
        }

        if (this._curItems != null && this._curItems.length > 0) {
            this._curItems.forEach(item => {
                if (!item.IsFinish && !ListUtil.Contains(this._removeItems, item)) {
                    item.Update(this.minDuration);
                    if (item.IsFinish) {
                        ListUtil.Add(this._removeItems, item);
                    }
                }
            });
        }
        if (this._addItems != null && this._addItems.length > 0) {
            this._addItems.forEach(item => {
                ListUtil.Add(this._curItems, item);
            });
            this._addItems = [];
        }

        if (this._removeItems != null && this._removeItems.length > 0) {
            this._removeItems.forEach(item => {
                ListUtil.Remove(this._curItems, item);
                item.Clear();
            });
            this._removeItems = [];
        }
    }

}