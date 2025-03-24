import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EPageType, EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { GetHolyBeastExtractReward_req, HolyBeastExtract_req, HolyBeastExtract_revc, HolyBeastLog_req, stHolyBeastData, stHolyBeastLogDetail } from "../../../../network/protocols/BaseProto";
import { ActivityModel } from "../../activity/ActivityModel";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { DotManager } from "../../common/DotManager";
import { ValCtl } from "../../main/ctl/ValLisCtl";
import { IconUtils } from "../../main/model/IconUtils";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { ItemProxy } from "../../main/proxy/ItemProxy";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { ShengShouModel } from "../model/ShengShouModel";
import { t_HolyBeast_Draw_Rate } from "../proxy/t_HolyBeast_Draw_Rate";
import { t_HolyBeast_Intimacy_Reward } from "../proxy/t_HolyBeast_Intimacy_Reward";
import { t_HolyBeast_Resource } from "../proxy/t_HolyBeast_Resource";
import { ShengShouItem } from "./item/ShengShouItem";

export class ShengShouView1 extends ViewBase{
    private _ui:ui.views.shengshou.ui_shengShouView1UI;
    
    public PageType: EPageType = EPageType.None;
    protected mMask = true; 
    protected mMaskClick: boolean = false;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _se:SimpleEffect;
    private _timeCtl:TimeCtl;
    private _wid:number;

    protected onAddLoadRes(): void {
        this.addAtlas('shengshou.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shengshou.ui_shengShouView1UI();

            this._wid = this._ui.pro.width;

            this._ui.on(Laya.Event.MOUSE_DOWN,this,this.onClick);
            this._ui.btn_tip.on(Laya.Event.MOUSE_DOWN,this,this.onTipClick);
            this._ui.tip.on(Laya.Event.MOUSE_DOWN,this,this.onTip1Click);
            this._ui.btn2.on(Laya.Event.MOUSE_DOWN,this,this.onBtn2Click);
            this._ui.money1.on(Laya.Event.CLICK,this,this.onMoneyClick);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_close,new Laya.Handler(this,this.onCloseClick)),
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn3,new Laya.Handler(this,this.onBtn3Click)),
                ButtonCtl.Create(this._ui.btn4,new Laya.Handler(this,this.onBtn4Click)),
                ButtonCtl.Create(this._ui.btn5,new Laya.Handler(this,this.onBtn5Click))
            )

            this._ui.list.itemRender = ShengShouItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            
            this._ui.list1.itemRender = ui.views.shengshou.ui_shengShouItem1UI;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);

            this._timeCtl = new TimeCtl(this._ui.lab_time);
        }
    }

    private onRenderHandler(item:ShengShouItem){
        item.setData(item.dataSource);
    }

    private onRenderHandler1(item:ui.views.shengshou.ui_shengShouItem1UI){
        item.lab.text = E.getLang("shengshoulog",item.dataSource.nickName);
        let cfg = t_HolyBeast_Draw_Rate.Ins.GetDataById(item.dataSource.drawId);
        let vo = ItemViewFactory.convertItem(cfg.f_reward);
        item.lab1.text = vo.getName() + "x" + vo.count;
        item.lab1.x = item.lab.x + item.lab.textField.textWidth + 5;
    }

    private onBtn2Click(){
        E.ViewMgr.Open(EViewType.ShengShouView2);
    }

    private onMoneyClick(){
        this.openView(1);
    }

    private onBtn3Click(){
        this.openView(1);
    }

    private onBtn4Click(){
       this.openView(2);
    }

    private openView(type:number){
        if (!ShengShouModel.Ins.isOpen(ShengShouModel.Ins.actID,true)) {
            return;
        }
        E.ViewMgr.Open(EViewType.ShengShouLBView,null,type);
    }

    private onBtn5Click(){
        E.ViewMgr.Open(EViewType.ShengShouRankView);
    }

    private onBtnClick(){
        this.sendCmd(1);
    }

    private onBtn1Click(){
        this.sendCmd(10);
    }

    private sendCmd(num){
        if(this._isPlay)return;
        let req = new HolyBeastExtract_req;
        req.activityId = ShengShouModel.Ins.actID;
        req.cnt = num;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private _isPlay:boolean;
    private onUpdateChouQu(value:HolyBeastExtract_revc){
        this._isPlay = true;
        let type;
        if(value.cnt == 1){
            type = 1;
        }else{
            type = 2;
        }
        this._se.play(type, false, this, this.onPlayUIEnd,[value.serialNum]);
    }

    private onPlayUIEnd(value:number){
        let req = new GetHolyBeastExtractReward_req;
        req.activityId = ShengShouModel.Ins.actID;
        req.serialNum = value;
        SocketMgr.Ins.SendMessageBin(req);
        this._se.play(0, true);
        Laya.timer.once(500,this,this.onPlayUIEnd1);
    }

    private onPlayUIEnd1(){
        this._isPlay = false;
    }

    private onClick(e:Laya.Event){
        if(this._ui.tip.visible){
            e.stopPropagation();
            this._ui.tip.visible = false;
        }
    }

    private onCloseClick(){
        if(this._isPlay)return;
        this.Close();
    }

    private onTipClick(e:Laya.Event){
        e.stopPropagation();
        this._ui.tip.visible = !this._ui.tip.visible;
    }

    private onTip1Click(e:Laya.Event){
        e.stopPropagation();
    }

    private _recCfg:Configs.t_HolyBeast_Resource_dat;
    protected onInit(): void {
        this._recCfg = t_HolyBeast_Resource.Ins.getCfgById(ShengShouModel.Ins.actID);
        ShengShouModel.Ins.on(ShengShouModel.UPDATE_VIEW,this,this.updateView);
        ShengShouModel.Ins.on(ShengShouModel.UPDATE_LOG,this,this.updateLog);
        TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell,this,this.onUpdateMoney);
        ShengShouModel.Ins.on(ShengShouModel.UPDATE_CHOUQU,this,this.onUpdateChouQu);
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.updateRedTip);
        this._isPlay = false;
        this.initUI();
        this.updateView();
        this.updateMoney();
        this.updateRedTip();
       
        this.sendLogCmd();
        if (ShengShouModel.Ins.isOpen(ShengShouModel.Ins.actID)) {
            Laya.timer.loop(1000,this,this.sendLogCmd);
        }
    }

    private sendLogCmd(){
        let req = new HolyBeastLog_req;
        req.flag = 1;
        req.activityId = ShengShouModel.Ins.actID;
        if(ShengShouModel.Ins.logAllList.length == 0){
            req.serialNum = 0;
        }else{
            ShengShouModel.Ins.logAllList.sort(this.onSort);
            req.serialNum = ShengShouModel.Ins.logAllList[0].serialNum;
        }
        SocketMgr.Ins.SendMessageBin(req);
    }

    protected onExit(): void {
        ShengShouModel.Ins.off(ShengShouModel.UPDATE_VIEW,this,this.updateView);
        ShengShouModel.Ins.off(ShengShouModel.UPDATE_LOG,this,this.updateLog);
        TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell,this,this.onUpdateMoney);
        ShengShouModel.Ins.off(ShengShouModel.UPDATE_CHOUQU,this,this.onUpdateChouQu);
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.updateRedTip);
        if(this._se){
            this._se.dispose();
            this._se = null;
        }
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
        Laya.timer.clear(this,this.sendLogCmd);
    }

    private initUI(){
        let btnArr = E.getLang("shengshouBtn_10").split("-");
        this._ui.lab3.text = btnArr[0];
        this._ui.lab4.text = btnArr[1];
        this._ui.lab5.text = btnArr[2];
        this._ui.bg.skin = "static/bj_sh1_" + ShengShouModel.Ins.actID + ".jpg";
        this._ui.img.skin = `o/shengshou/title_${ShengShouModel.Ins.actID}.png`;
        if (!this._se) {
            let url = ShengShouModel.Ins.actID + "_suolian";
            this._se = new SimpleEffect(this._ui.sp, `o/spine/succeed/${url}/${url}`,0,120);
        }
        this._se.play(0, true);
        let arr = this._recCfg.f_draw_icon.split("|");
        ValCtl.Create(this._ui.money1.lab,this._ui.money1.icon,parseInt(arr[0]),this._ui.money1.sp,false);
        ValCtl.Create(this._ui.money2.lab,this._ui.money2.icon,parseInt(arr[1]),this._ui.money2.sp,false);
        this._ui.tip.visible = false;
        this._ui.descTf.text = E.getLang(`shengshoutip_${ShengShouModel.Ins.actID}`);
        let data = ShengShouModel.Ins.getRankTimeData(ShengShouModel.Ins.actID);
        if(!data)return;
        let time = data.end - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("已结束");
    }

    private updateView(){
        let data:stHolyBeastData = ShengShouModel.Ins.getBeastData(ShengShouModel.Ins.actID);
        if(!data)return;
        this._ui.lab_num.text = data.num + "";
        let arr = t_HolyBeast_Intimacy_Reward.Ins.getListById(ShengShouModel.Ins.actID);
        if(data.num >= parseInt(arr[arr.length - 1].f_require)){
            this._ui.pro.width = this._wid;
        }else{
            let cnt = 0;
            for(let i:number=0;i<arr.length;i++){
                if(data.num >= parseInt(arr[i].f_require)){
                    cnt++;
                }
            }
            if(cnt == 0){
                this._ui.pro.width = data.num / parseInt(arr[0].f_require) * 0.25 * this._wid;
            }else{
                let n = cnt * 0.25;
                let nn = (data.num - parseInt(arr[cnt - 1].f_require) ) / 
                (parseInt(arr[cnt].f_require) - parseInt(arr[cnt - 1].f_require)) * 0.25;
                this._ui.pro.width = (n + nn) * this._wid;
            }
        }

        this._ui.list.array = arr;
    }

    private updateMoney(){
        let vo = ItemViewFactory.convertItem(this._recCfg.f_single_draw_consume);
        let val = MainModel.Ins.mRoleData.getVal(vo.cfgId);
        this._ui.icon.skin = IconUtils.getIconByCfgId(vo.cfgId);
        this._ui.lab.text = val + "/" + vo.count;
        if(val >= vo.count){
            this._ui.lab.color = "#82ff69";
        }else{
            this._ui.lab.color = "#ff6666";
        }

        vo = ItemViewFactory.convertItem(this._recCfg.f_ten_draw_consume);
        this._ui.icon1.skin = IconUtils.getIconByCfgId(vo.cfgId);
        this._ui.lab1.text = val + "/" + vo.count;
        if(val >= vo.count){
            this._ui.lab1.color = "#82ff69";
        }else{
            this._ui.lab1.color = "#ff6666";
        }
    }

    private onUpdateMoney(id:number){
        let arr = this._recCfg.f_single_draw_consume.split("-");
        if (id == parseInt(arr[0])) {
            this.updateMoney();
        }
    }

    private updateLog(){
        ShengShouModel.Ins.logAllList.sort(this.onSort);
        this._ui.list1.array = ShengShouModel.Ins.logAllList;
    }

    private onSort(a:stHolyBeastLogDetail,b:stHolyBeastLogDetail){
        return b.serialNum - a.serialNum;
    }

    private updateRedTip(){
        if(ShengShouModel.Ins.isLBRedTip(ShengShouModel.Ins.actID)){
            DotManager.addDot(this._ui.btn3);
        }else{
            DotManager.removeDot(this._ui.btn3);
        }
    }
}