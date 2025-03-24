import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { TitleNewClick_req } from "../../../../network/protocols/BaseProto";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";
import { ChengHaoModel } from "../model/ChengHaoModel";

export class ChengHaoItem extends ui.views.chenghao.ui_chenghaoItemUI{
    private _ctl:ChengHaoCtl;
    private _timeCtl:TimeCtl;

    constructor(){
        super();
        this._ctl = new ChengHaoCtl(this.view);
        this._timeCtl = new TimeCtl(this.lab);
        this.on(Laya.Event.CLICK,this,this.onClick);
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onDisplay(){
        
    }

    private onUnDisplay(){
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private onClick() {
        if (!this._data) return;
        let data = ChengHaoModel.Ins.getDataById(this._data.f_title_id);
        if (data && data.isNew) {
            let req = new TitleNewClick_req;
            req.titleId = data.id;
            SocketMgr.Ins.SendMessageBin(req);
        }
    }

    private _data:Configs.t_Title_dat;
    public setData(value:Configs.t_Title_dat){
        if(!value)return;
        this._data = value;
        
        this._ctl.setData(value.f_title_id,false);
        if(value.f_title_id == ChengHaoModel.Ins.titleId){
            this.img.visible = true;
        }else{
            this.img.visible = false;
        }

        this.lab.text = "";
        this.sp.visible = false;
        let data = ChengHaoModel.Ins.getDataById(value.f_title_id);
        if (data) {
            this.sp_m.visible = false;
            let time = data.exp - TimeUtil.serverTime;
            if (time > 0) {
                this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
            } else {
                this._timeCtl.stop();
            }
            if(data.isNew){
                this.sp.visible = true;
            }
        }else{
            this._timeCtl.stop();
            this.sp_m.visible = true;
        }
    }
    
    private onUpdateTime() {
        let time_str = TimeUtil.subTime(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("");
    }
}