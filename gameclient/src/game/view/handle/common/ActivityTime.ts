import { EActivityID } from "../activity/ActivityEnum";
import { ActivityModel } from "../activity/ActivityModel";

export class ActivityTime {
    private _timeCtl: TimeCtl;
    constructor(tf: Laya.Label) {
        this._timeCtl = new TimeCtl(tf);
    }

    refresh(activityId: EActivityID) {
        let data = ActivityModel.Ins.getActivityStatusData(activityId);
        if (data) {
            let time = data.endtime - TimeUtil.serverTime;
            if (time > 0) {
                this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
            } else {
                this.endTime();
            }
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("00:00:00");
    }

    dispose() {
        if (this._timeCtl) {
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }
}