import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { ShengShouModel } from "../model/ShengShouModel";
import { t_HolyBeast_Rank_Reward } from "../proxy/t_HolyBeast_Rank_Reward";
import { t_HolyBeast_Resource } from "../proxy/t_HolyBeast_Resource";
import { SSRankItem1 } from "./item/SSRankItem1";

export class ShengShouRankView1 extends ViewBase{
    private _ui:ui.views.shengshou.ui_rankView1UI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _timeCtl:TimeCtl;

    protected onAddLoadRes(): void {
        this.addAtlas('shengshou.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shengshou.ui_rankView1UI();
            this.bindClose(this._ui.btn_close);

            let cfg = t_HolyBeast_Resource.Ins.getCfgById(ShengShouModel.Ins.actID);
            this._ui.titleHero.name = cfg.f_hero_id;

            this._ui.list.itemRender = SSRankItem1;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this._timeCtl = new TimeCtl(this._ui.lab_time);
        }
    }

    private onRenderHandler(item:SSRankItem1){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        this._ui.list.array = t_HolyBeast_Rank_Reward.Ins.getListById(ShengShouModel.Ins.actID);
        let data = ShengShouModel.Ins.getRankTimeData(ShengShouModel.Ins.actID);
        if(!data)return;
        let time = data.end - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }
    }

    protected onExit(): void {
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("已结束");
    }
}