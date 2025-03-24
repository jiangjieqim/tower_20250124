import { G } from "../../G";
import { TimerMgr } from "./TimerMgr";

export class Updater {

    private static _ins: Updater = new Updater();
    public static get Ins() {
        if (this._ins == null) new Updater();
        return this._ins;
    }

    private updateCalls: Callback[] = [];
    private lateUpdateCalls: Callback[] = [];
    private fixedUpdateCalls: Callback[] = [];

    constructor() {
        // Laya.timer.loop(God.FixedTime * 1000, this, this.onFixedUpdate);
    }

    public Init() {
        this.updateCalls = [];
        this.lateUpdateCalls = [];
        this.fixedUpdateCalls = [];

        TimerMgr.Ins.Add(this, TimeUtil.FixedDeltaTimeMS, -1, this.FixedUpdate, null, false);
    }

    public Update() {

        G.OnUpdate();

        //所有update执行
        for (let i: number = 0; i < this.updateCalls.length; i++) {
            // console.log(this.updateFuncLst[i] + "  len:::" + this.updateFuncLst.length);
            if (this.updateCalls[i]) {
                this.updateCalls[i].Invoke();
            }
        }
    }
    public LateUpdate() {
        G.OnLateUpdate();

        this.lateUpdateCalls.forEach(item => {
            if (item)
                item.Invoke();
        });
    }

    public FixedUpdate() {
        G.OnFixedUpdate();
        
        this.fixedUpdateCalls.forEach(item => {
            if (item)
                item.Invoke();
        });
    }

    /**添加update*/
    public AddUpdate(caller: any, func: Function) {
        ListUtil.Add(this.updateCalls, Callback.Create(caller, func));
    }

    /**移除update*/
    public RemoveUpdate(caller: any) {
        let templst = ListUtil.Copy(this.updateCalls);
        for (let i: number = 0; i < templst.length; i++) {
            if (this.updateCalls[i].Caller == caller) {
                this.updateCalls.splice(i, 1);
                break;
            }
        }
    }

    /**添加lateupdate*/
    public AddLateUpdate(caller: any, func: Function) {
        ListUtil.Add(this.lateUpdateCalls, Callback.Create(caller, func));
    }

    /**移除lateupdate*/
    public RemoveLateUpdate(caller: any) {
        let templst = ListUtil.Copy(this.lateUpdateCalls);

        for (let i: number = 0; i < templst.length; i++) {
            if (this.lateUpdateCalls[i].Caller == caller) {
                this.lateUpdateCalls.splice(i, 1);
                break;
            }
        }
    }

    /**添加update*/
    public AddFixedUpdate(caller: any, func: Function) {
        ListUtil.Add(this.fixedUpdateCalls, Callback.Create(caller, func));
    }

    /**移除update*/
    public RemoveFixedUpdate(caller: any) {
        let templst = ListUtil.Copy(this.fixedUpdateCalls);

        for (let i: number = 0; i < templst.length; i++) {
            if (this.fixedUpdateCalls[i].Caller == caller) {
                this.fixedUpdateCalls.splice(i, 1);
                break;
            }
        }
    }

}