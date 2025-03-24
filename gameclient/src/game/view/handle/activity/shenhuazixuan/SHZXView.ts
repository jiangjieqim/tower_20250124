import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { HeroBuyByPack_req } from "../../../../network/protocols/BaseProto";
import { EResKey, FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { ERedEnum } from "../../main/model/ERedEnum";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { ItemVo } from "../../main/vos/ItemVo";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { EActivityID } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { t_Mythical_Choice } from "./t_Mythical_Choice";

export class SHZXView extends ViewBase{
    private _ui:ui.views.shenhuazixuan.ui_shzxViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _heroAnim:HeroAvatarView;
    private _timeCtl:TimeCtl;
    
    protected onAddLoadRes() {
        this.addAtlas('shenhuazixuan.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shenhuazixuan.ui_shzxViewUI();
            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn2,new Laya.Handler(this,this.onBtn2Click))
            )

            this._ui.sp1.on(Laya.Event.CLICK,this,this.onBtnClick);

            this._timeCtl = new TimeCtl(this._ui.lab_time);
        }
    }

    private onBtnClick(){
        E.ViewMgr.Open(EViewType.SHZXView1);
    }

    private onBtn2Click(){
        let fid = MainModel.Ins.red.getValByID(ERedEnum.SHENHUAZIXUAN);
        if (fid == undefined) return;
        let cfg:Configs.t_Mythical_Choice_dat = t_Mythical_Choice.Ins.GetDataById(fid);
        let hcfg = HeroListProxy.Ins.getCfgById(cfg.f_heroid);
        let vo:ItemVo = new ItemVo;
        vo.cfgId = hcfg.f_heropiece_id;
        vo.count = 1;
        let vo1 = ItemViewFactory.convertItem(cfg.f_price);
        E.ViewMgr.showMsgBoxView(vo,vo1,new Laya.Handler(this,()=>{
            if(TowerMainModel.Ins.isItemEnoughSt(cfg.f_price,true)){
                let req = new HeroBuyByPack_req;
                req.id = cfg.f_id;
                SocketMgr.Ins.SendMessageBin(req);
                this.Close();
            }
        }));
    }

    protected onInit(): void {
        ActivityModel.Ins.on(ActivityModel.SHENHUAZIXUAN,this,this.updateView);
        let data = ActivityModel.Ins.getActivityStatusData(EActivityID.SHZX);
        if(!data)return;
        let time = data.endtime - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }
        this.updateView();
    }

    protected onExit(): void {
        ActivityModel.Ins.off(ActivityModel.SHENHUAZIXUAN,this,this.updateView);
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTime(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("00:00:00");
    }

    private updateView(){
        let fid = MainModel.Ins.red.getValByID(ERedEnum.SHENHUAZIXUAN);
        if (fid != undefined) {
            this._ui.sp.visible = false;
            this._ui.sp1.visible = true;
            let cfg:Configs.t_Mythical_Choice_dat = t_Mythical_Choice.Ins.GetDataById(fid);
            let imageId = TowertMainHeroModel.Ins.getDefImageIdById(cfg.f_heroid);
            if (this._heroAnim) {
                this._heroAnim.dispose();
                this._heroAnim = null;
            }
            this._heroAnim = FightFactory.createByImageId(imageId, this._ui.sp2,cfg.f_display_offset,0,1,EResKey.OutBigSide);
            let data = TowertMainHeroModel.Ins.getHeroById(cfg.f_heroid);
            if(data){
                this._ui.sp3.visible = true;
            }else{
                this._ui.sp3.visible = false;
            }
            this._ui.btn1.visible = false;
            this._ui.btn2.visible = this._ui.img.visible = true;
            let vo = ItemViewFactory.convertItem(cfg.f_original_price);
            this._ui.icon.skin = vo.getIcon();
            this._ui.lab.text = vo.count + "";
            this._ui.lab1.text = cfg.f_price.split("-")[1];
        }else{
            this._ui.sp.visible = true;
            this._ui.sp1.visible = false;
            this._ui.btn1.visible = true;
            this._ui.btn2.visible = this._ui.img.visible = false;
        }
    }
}