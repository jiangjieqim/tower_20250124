// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E, ScreenAdapter } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { CrazyFishExchange_req, CrazyFishLotteryShow_req, CrazyFishLottery_revc } from "../../../../network/protocols/BaseProto";
import { EActivityID } from "../../activity/ActivityEnum";
import { ActivityModel } from "../../activity/ActivityModel";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { DotManager } from "../../common/DotManager";
import { IShopBuyItem } from "../../common/ShopBuyView";
import { IconUtils } from "../../main/model/IconUtils";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { ECellType } from "../../main/vos/ECellType";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListLvProxy } from "../../towertmainhero/proxy/HeroProxy";
import { DianYuModel } from "../model/DianYuModel";
import { t_Crazy_Fish_Reward } from "../proxy/t_Crazy_Fish_Reward";
import { t_Crazy_Fish_Upgrade } from "../proxy/t_Crazy_Fish_Upgrade";
import { t_Crazy_Fish_config } from "../proxy/t_Crazy_Fish_config";
import { DianYuItem } from "./DianYuItem";

export class DianYuView extends ViewBase{
    private _ui:ui.views.dianyu.ui_dianyuViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    protected mMaskClick:boolean = false;

    private tabCtl:TabControl;
    private tabList: any;
    private ckCtl:CheckBoxCtl;
    private _sp:SimpleEffect;

    private _timeCtl:TimeCtl;
    private _timeCtl1:TimeCtl;

    private _wid:number;
    private _wid1:number;

    protected onAddLoadRes(): void {
        this.addAtlas('dianyu.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.dianyu.ui_dianyuViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtnClick1)),
                ButtonCtl.Create(this._ui.btn2,new Laya.Handler(this,this.onBtnClick2))
            )

            this._wid = this._ui.pro.width;
            this._wid1 = this._ui.pro1.width;
            this._timeCtl = new TimeCtl(this._ui.lab1);
            this._timeCtl1 = new TimeCtl(this._ui.lab3);

            this.ckCtl = new CheckBoxCtl({bg:this._ui.bg1,gou:this._ui.gou1} as ICheckBoxSkin);
            this.ckCtl.selected = false;

            this._ui.list.itemRender = DianYuItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            const tabsSkin = [this._ui.tab1, this._ui.tab2];
            let st = E.getLang("dianyutab");
            this.tabList = st.split("-");
            this.tabCtl = new TabControl();
            this.tabCtl.init(tabsSkin, new Laya.Handler(this, this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));
        }
    }

    private onRenderHandler(item:DianYuItem){
        item.setData(item.dataSource);
    }

    private onBtnClick2(){
        if(!this._cfg)return;
        let arr = t_Crazy_Fish_Reward.Ins.getListByType(this._cfg.f_type);
        let array = [];
        for(let i:number=0;i<arr.length;i++){
            array.push(arr[i].f_reward + "-" + arr[i].f_announcement_rate);
        }
        E.ViewMgr.Open(EViewType.GaiLvView,null,array);
    }

    private onBtnClick(){
        this.sendCmd("1");
    }

    private onBtnClick1(){
        this.sendCmd("10");
    }

    private sendCmd(extra:string){
        if(!this._cfg)return;
        let st;
        if(parseInt(extra) == 1){
            st = this._cfg.f_one_consume;
        }else{
            st = this._cfg.f_ten_consume;
        }
        if(TowerMainModel.Ins.isItemEnoughSt(st,true)){
            ActivityModel.Ins.sendCmd(EActivityID.DianYu,0,extra);
        }else{
            let vo = ItemViewFactory.convertItem(this._cfg.f_item_price);
            let vo1 = ItemViewFactory.convertItem(this._cfg.f_one_consume);
            TowerMainModel.Ins.buyItem(vo, vo1, new Laya.Handler(this, this.onBuyClick));
        }
    }

    private onBuyClick(value:IShopBuyItem,selCount:number){
        let req = new CrazyFishExchange_req;
        req.cnt = selCount;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.dianyu.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        skin.icon.skin = `remote/dianyu/tab${index}.png`;
        if (sel) {
            skin.img.skin = "remote/dianyu/btn_s_zsbz1.png";
        } else {
            skin.img.skin = "remote/dianyu/btn_n_zsbz.png";
        }
    }

    private onTabSelectHandler(v: number) {
        if(v == -1)return;
        if(v == 0){
            this._ui.bg.visible = true;
            this._ui.sp1.visible = true;
            this._ui.sp2.visible = true;
            this._ui.sp3.visible = false;
        }else{
            this._ui.bg.visible = false;
            this._ui.sp1.visible = false;
            this._ui.sp2.visible = false;
            this._ui.sp3.visible = true;
        }
    }

    private setRedTip(){
        if(DianYuModel.Ins.isRedTip()){
            DotManager.addDot(this._ui.tab2);
        }else{
            DotManager.removeDot(this._ui.tab2);
        }
    }

    protected onInit(): void {
        TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell,this,this.updateMoney);
        DianYuModel.Ins.on(DianYuModel.UPDATE_CHOU_VIEW,this,this.onChouka);
        DianYuModel.Ins.on(DianYuModel.UPDATE_VIEW,this,this.onUpdateView);
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onUpdateView);

        this._ui.ht.style.fontSize = 24;
        this._ui.ht.style.family = "BOLD";
        this._ui.ht.style.leading = 10;
        this._ui.ht.style.stroke = 2;
        this._ui.ht.style.strokeColor = "#3a1c17";
        this._ui.ht.style.valign = "center";
        this._ui.ht.width = 460;

        this._ui.mouseEnabled = true;
        this.setUI();
        this._sp = new SimpleEffect(this._ui.sp_d, `o/spine/succeed/yutang/yutang`,10,-330);
        this._sp.play(0,true);
        this.updateView();
        this.updateMoney(ECellType.DianYu);
        this.tabCtl.selectIndex = 0;
        this.setRedTip();
    }

    protected onExit(): void {
        TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell,this,this.updateMoney);
        DianYuModel.Ins.off(DianYuModel.UPDATE_CHOU_VIEW,this,this.onChouka);
        DianYuModel.Ins.off(DianYuModel.UPDATE_VIEW,this,this.onUpdateView);
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.onUpdateView);
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
        if(this._timeCtl1){
            this._timeCtl1.dispose();
            this._timeCtl1 = null;
        }
        if (this._sp) {
            this._sp.dispose();
            this._sp = null;
        }
    }

    private onUpdateView(){
        this._ui.list.refresh();
        this.setRedTip();
    }

    private onChouka(value:CrazyFishLottery_revc){
        this._ui.mouseEnabled = false;
        if(!this.ckCtl.selected){
            if(value.cnt == 1){
                this._sp.play(1,false,this,this.playEnd,[value]);
            }else{
                this._sp.play(2,false,this,this.playEnd,[value]);
            }
        }else{
            this.playEnd(value);
        }
    }

    private playEnd(value:CrazyFishLottery_revc){
        if(!this._cfg)return;
        this._ui.lab.text = DianYuModel.Ins.guarantee + "/" + this._cfg.f_god_guarantee_times;
        let num = DianYuModel.Ins.guarantee / this._cfg.f_god_guarantee_times;
        if(num > 1){
            num = 1;
        }
        this._ui.pro.width = num * this._wid;
        this._ui.mouseEnabled = true;
        this._sp.play(0,true);
        let req = new CrazyFishLotteryShow_req;
        req.serial = value.serial;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private updateMoney(id: number) {
        if(!this._cfg)return;
        if (id == ECellType.DianYu) {
            let id = parseInt(this._cfg.f_one_consume.split("-")[0]);
            let one = parseInt(this._cfg.f_one_consume.split("-")[1]);
            let ten = parseInt(this._cfg.f_ten_consume.split("-")[1]);
            this._ui.icon.skin = this._ui.icon1.skin = IconUtils.getIconByCfgId(id);
            let count = MainModel.Ins.mRoleData.getVal(id);
            this._ui.labb.text = count + "/" + one;
            this._ui.labb1.text = count + "/" + ten;
            if (count >= one) {
                this._ui.labb.color = "#82ff69";
            } else {
                this._ui.labb.color = "#ff7979";
            }
            if (count >= ten) {
                this._ui.labb1.color = "#82ff69";
            } else {
                this._ui.labb1.color = "#ff7979";
            }
        }
    }

    private setUI() {
        let yy = (Laya.stage.height - ScreenAdapter.DefaultHeight);
        if (yy > 0) {
            this._ui.height += yy;

            this._ui.sp1.y += yy*0.5;
            this._ui.sp2.y += yy;
            this._ui.sp_d.y -= yy*0.5;

            this._ui.bg2.height += yy;
            this._ui.bg3.height += yy;
            this._ui.list.height += yy;

            this._ui.img_bg2.y += yy;
            this._ui.img_bg3.y += yy;
        }
    }

    private _cfg:Configs.t_Crazy_Fish_config_dat;
    private updateView(){
        let data = ActivityModel.Ins.getActivityStatusData(EActivityID.DianYu);
        if(!data)return;
        let time = data.endtime - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }
        
        this._cfg = t_Crazy_Fish_config.Ins.GetDataById(DianYuModel.Ins.configId);
        if(!this._cfg)return;
        this._ui.ht.innerHTML = E.getLang(`dianyu1_${this._cfg.f_type}`);
        this._ui.lab.text = DianYuModel.Ins.guarantee + "/" + this._cfg.f_god_guarantee_times;
        let num = DianYuModel.Ins.guarantee / this._cfg.f_god_guarantee_times;
        if(num > 1){
            num = 1;
        }
        this._ui.pro.width = num * this._wid;
        this._ui.img.skin = `remote/dianyu/img_${this._cfg.f_type}.png`;

        //********************************************************************************* */
        if (time > 0) {
            this._timeCtl1.start(time, new Laya.Handler(this, this.onUpdateTime1), new Laya.Handler(this, this.endTime1));
        } else {
            this.endTime1();
        }
        this._ui.img1.skin = `remote/dianyu/banner_${this._cfg.f_type}.jpg`;
        this._ui.img2.skin = `remote/dianyu/img_hy_dxzm${this._cfg.f_type}.png`;
        this._ui.lab2.text = E.getLang(`dianyu2_${this._cfg.f_type}`);
        let hdata = TowertMainHeroModel.Ins.getHeroById(this._cfg.f_hero_id);
        if(hdata){
            this._ui.sp.visible = false;
            this._ui.icon2.visible = true;
            this._ui.icon2.skin = `remote/dianyu/icon_${this._cfg.f_type}.png`
            this._ui.lab4.text = "lv." + hdata.level;
            let nextCfg:Configs.t_Hero_upgrade_dat = HeroListLvProxy.Ins.getNextCfgByIdAndLv(hdata.id,hdata.level);
            if(nextCfg){
                let cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(hdata.id,hdata.level);
                let arr = cfg.f_consumption.split("|");
                let id = parseInt(arr[0].split("-")[0]);
                let need = parseInt(arr[0].split("-")[1])
                let count = MainModel.Ins.mRoleData.getVal(id);
                this._ui.lab5.text = count + "/" + need;
                let num = count / need;
                if(num > 1){
                    num = 1;
                }
                this._ui.pro1.width = num * this._wid1;
            }else{
                this._ui.lab5.text = "已满级";
                this._ui.pro1.width = this._wid1;
            }
        }else{
            this._ui.sp.visible = true;
            this._ui.icon2.visible = false;
            this._ui.lab4.text = "本期英雄等级";
            this._ui.lab5.text = "未获得";
            this._ui.pro1.width = 0;
        }

        let arr = t_Crazy_Fish_Upgrade.Ins.getListByType(this._cfg.f_type);
        let array = [];
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_see_level == 0){
                array.push(arr[i]);
            }else{
                if(hdata && hdata.level >= arr[i].f_see_level){
                    array.push(arr[i]);
                }
            }
        }
        this._ui.list.array = array;
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("00:00:00");
    }

    private onUpdateTime1() {
        let time_str = TimeUtil.subTime(this._timeCtl1.tickVal);
        this._timeCtl1.setText(time_str);
    }

    private endTime1() {
        this._timeCtl1.setText("00:00:00");
    }
}