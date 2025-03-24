import { ScrollPanelControl } from "../../../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E, ScreenAdapter } from "../../../../../G";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { LotteryRewardShow_req, LotteryReward_req, LotteryReward_revc } from "../../../../../network/protocols/BaseProto";
import { NoContainerSimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SimpleEffect } from "../../../avatar/SimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { DotManager } from "../../../common/DotManager";
import { FightFactory } from "../../../compose/FightFactory";
import { HeroAvatarView } from "../../../compose/views/HeroAvatarView";
import { FuncProxy } from "../../../funs/proxy/FunctionProxy";
import { System_RefreshTimeProxy } from "../../../main/ctl/System_RefreshTimeProxy";
import { ValCtl } from "../../../main/ctl/ValLisCtl";
import { IconUtils } from "../../../main/model/IconUtils";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { MainModel } from "../../../main/model/MainModel";
import { ItemSlotCtl } from "../../../main/views/icon/SoltItemView";
import { ECellType } from "../../../main/vos/ECellType";
import { TowerMainEvent } from "../../model/TowerMainEvent";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";
import { TowerMainModel } from "../../model/TowerMainModel";
import { t_Lottery_Reward_Rate } from "../../proxy/t_Lottery_Reward_Rate";

export class MainActivityView extends ViewBase{
    private _ui:ui.views.zsbaozang.ui_zsbzviewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    protected mMaskClick:boolean = false;

    private _panelCtl: ScrollPanelControl;
    private _ctl1:ItemSlotCtl;
    private _ctl2:ItemSlotCtl;
    private _ctl3:ItemSlotCtl;
    private _ctl4:ItemSlotCtl;
    private _ctl5:ItemSlotCtl;
    private _ctl6:ItemSlotCtl;
    private _ctl7:ItemSlotCtl;
    private _ctl8:ItemSlotCtl;
    private _ctl9:ItemSlotCtl;
    private _ctl10:ItemSlotCtl;
    private _ctl11:ItemSlotCtl;
    private _ctl12:ItemSlotCtl;

    private _spD:NoContainerSimpleEffect;
    private _anim1:HeroAvatarView;
    private _spl:SimpleEffect;
    private _spr:SimpleEffect;
    private _spsl:SimpleEffect;

    private _tw:Laya.Tween;
    private ckCtl1:CheckBoxCtl;

    protected onAddLoadRes(): void {
        this.addAtlas("zsbaozang.atlas");
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.zsbaozang.ui_zsbzviewUI();
            this.bindClose(this._ui.btn_close);

            this._ui.btn_l.on(Laya.Event.CLICK,this,this.onLClick);
            this._ui.btn_r.on(Laya.Event.CLICK,this,this.onRClick);

            ValCtl.Create(this._ui.money.lab,this._ui.money.icon,ECellType.ZSBZ,this._ui.money.sp,false);
            
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_gl,new Laya.Handler(this,this.onBtGlClick)),
            )

            this._tw = new Laya.Tween();
            for(let i:number=1;i<13;i++){
                this["_ctl" + i] = new ItemSlotCtl(this._ui["view" + i])
            }

            this.ckCtl1 = new CheckBoxCtl({bg:this._ui.bg1,gou:this._ui.gou1} as ICheckBoxSkin);
            this.ckCtl1.selected = false;
        }
    }

    private onBtGlClick(){
        let arr = t_Lottery_Reward_Rate.Ins.List;
        let array = [];
        for(let i:number=0;i<arr.length;i++){
            array.push(arr[i].f_reward + "-" + arr[i].f_announce_rate);
        }
        E.ViewMgr.Open(EViewType.GaiLvView,null,array);
    }

    private onLClick(){
        // if(!this._isPlay){
        let req = new LotteryReward_req;
        req.flag = 0;
        SocketMgr.Ins.SendMessageBin(req);
        // }
    }

    private onPlayEndL(){
        this._spl.play(0,true);
        this._ui.sppp_l.visible = true;
    }

    private onRClick(){
        // if(!this._isPlay){
        let req = new LotteryReward_req;
        req.flag = 1;
        SocketMgr.Ins.SendMessageBin(req);
        // }
    }

    private onPlayEndR(){
        this._spr.play(0,true);
        this._ui.sppp_r.visible = true;
    }

    private _index:number;
    protected onInit(): void {
        this.setUI();
        let cfg = FuncProxy.Ins.getCfgByFuncId(50);
        this._ui.lab3.text = cfg.f_name;
        // this._isPlay = false;
        this._ui.mouseEnabled = true;
        // this._ui.btn_close.mouseEnabled = true;
        TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell,this,this.updateMoney);
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_Lottery,this,this.updateView);
        this._spD = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/succeed/deng_shang/deng_shang`, this._ui.sp_ds,16,-30);
        this._spl = new SimpleEffect(this._ui.sp_l, `o/spine/succeed/anniu_danchou/anniu_danchou`,10,27);
        this._spl.play(0,true);
        this._spr = new SimpleEffect(this._ui.sp_r, `o/spine/succeed/anniu_shilian/anniu_shilian`,10,20);
        this._spr.play(0,true);
        this.updateMoney(ECellType.ZSBZ);

        this._ui.sp_ts.scaleX = this._ui.sp_ts.scaleY = 1.2;
        this._anim1 = FightFactory.createBigHeroAvatar(24, this._ui.sp_ts,0,-10);

        let arr = t_Lottery_Reward_Rate.Ins.List;
        arr.sort((a:Configs.t_Lottery_Reward_Rate_dat,b:Configs.t_Lottery_Reward_Rate_dat)=>{
            return a.f_pos - b.f_pos;
        });
        for(let i:number=0;i<arr.length;i++){
            this["_ctl" + (i+1)].setData(ItemViewFactory.convertItem(arr[i].f_reward));
        }

        this._ui.img.x = this._ui.view1.x - 20;
        this._ui.img.y = this._ui.view1.y - 20;
    }

    protected onExit(): void {
        TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell,this,this.updateMoney);
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_Lottery,this,this.updateView);
        if(this._tw){
            this._tw.clear();
            this._tw = null;
        }
        if(this._spD){
            this._spD.dispose();
            this._spD = null;
        }
        if (this._anim1) {
            this._anim1.dispose();
            this._anim1 = null;
        }
        if (this._spl) {
            this._spl.dispose();
            this._spl = null;
        }
        if (this._spr) {
            this._spr.dispose();
            this._spr = null;
        }
        if (this._spsl) {
            this._spsl.dispose();
            this._spsl = null;
        }
    }

    private _data:LotteryReward_revc;
    // private _isPlay;
    private updateView(value:LotteryReward_revc){
        this._data = value;
        // this._isPlay = true;
        this._ui.mouseEnabled = false;
        // this._ui.btn_close.mouseEnabled = false;
        if(value.flag == 0){
            if(this._spl){
                this._spl.play(1,false,this,this.onPlayEndL); 
            }
            this._ui.sppp_l.visible = false;

            if(!this.ckCtl1.selected){
                this._index = 1;
                this._num = 0;
                this.playTween();
                E.AudioMgr.StopSound();
                E.AudioMgr.PlaySound1("tigerslotone.mp3");
            }else{
                let cfg:Configs.t_Lottery_Reward_Rate_dat = t_Lottery_Reward_Rate.Ins.GetDataById(this._data.id);
                this._ui.img.x = this._ui["view" + cfg.f_pos].x - 20;
                this._ui.img.y = this._ui["view" + cfg.f_pos].y - 20;
                this.playEnd();
            }
        }else{
            if(this._spr){
                this._spr.play(1,false,this,this.onPlayEndR); 
            }
            this._ui.sppp_r.visible = false;
            if(!this.ckCtl1.selected){
                this._spsl = new SimpleEffect(this._ui.sp_sl, `o/spine/succeed/shilian_paoma/shilian_paoma`,10,-5);
                this._spsl.play(0,false,this,this.onPlayEndSL);
                E.AudioMgr.StopSound();
                E.AudioMgr.PlaySound1("tigerslotten.mp3");
            }else{
                this.playEnd();
            }
        }
    }

    private onPlayEndSL(){
        if (this._spsl) {
            this._spsl.dispose();
            this._spsl = null;
        }
        this.playEnd();
    }
    
    private updateMoney(id: number){
        if (id == ECellType.ZSBZ) {
            this._ui.icon1.skin = this._ui.icon2.skin = IconUtils.getIconByCfgId(id);
            let arr = System_RefreshTimeProxy.Ins.getVal(101).split("|");
            let val = MainModel.Ins.mRoleData.getVal(id);
            let count1 = parseInt(arr[0].split("-")[1]);
            let count2 = parseInt(arr[1].split("-")[1]);
            this._ui.lab1.text = StringUtil.val2m(val) + "/" + count1;
            this._ui.lab2.text = StringUtil.val2m(val) + "/" + count2;
            this._ui.rt.visible = false;
            if(val >= count1){
                this._ui.lab1.color = "#ffffff";
                this._ui.lab1.strokeColor = "#482010";
                this._ui.rt.visible = true;
            }else{
                this._ui.lab1.color = "#ff7979";
                this._ui.lab1.strokeColor = "#5e0200";
            }
            if(val >= count2){
                this._ui.lab2.color = "#ffffff";
                this._ui.lab2.strokeColor = "#482010";
            }else{
                this._ui.lab2.color = "#ff7979";
                this._ui.lab2.strokeColor = "#5e0200";
            }
        }
    }

    private playTween(){
        this._ui.img.x = this._ui["view" + this._index].x - 20;
        this._ui.img.y = this._ui["view" + this._index].y - 20;
        this._tw.to(this._ui.img, { scaleX: 1, scaleY: 1 }, 50, null, new Laya.Handler(this, this.playTweenEnd));
    }

    private _num: number;
    private playTweenEnd() {
        if (this._num >= 2 ) {
            let cfg:Configs.t_Lottery_Reward_Rate_dat = t_Lottery_Reward_Rate.Ins.GetDataById(this._data.id);
            if(this._index == cfg.f_pos){
                this.playEnd();
                return;
            }
        }
        this._index++;
        if (this._index > 12) {
            this._index = 1;
            this._num++;
        }
        this.playTween();
    }

    private playEnd(){
        // this._isPlay = false;
        this._ui.mouseEnabled = true;
        // this._ui.btn_close.mouseEnabled = true;
        let req = new LotteryRewardShow_req;
        req.serial = this._data.serial
        SocketMgr.Ins.SendMessageBin(req);
    }

    private setUI() {
        let yy = (Laya.stage.height - ScreenAdapter.DefaultHeight);
        if (yy > 0) {
            this._ui.height += yy;
            this._ui.sp.y += yy * 0.5;
            this._ui.img_bg2.y += yy;
            this._ui.img_bg3.y += yy;
        }
    }
}