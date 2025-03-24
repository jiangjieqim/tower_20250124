// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { ChengHaoModel } from "../../chenghao/model/ChengHaoModel";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";
import { HeadCtl } from "../../common/HeadCtl";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { MainModel } from "../../main/model/MainModel";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { t_Player_Exp } from "../../towertmain/proxy/t_Player_Exp";
import { TowertMainCardModel } from "../../towertmaincard/model/TowertMainCardModel";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { TowertMainLinbaoModel } from "../../towertmainlinbao/model/TowertMainLinbaoModel";
import { t_Treasure } from "../../towertmainlinbao/proxy/t_Treasure";
import { RoleInfoModel } from "../model/RoleInfoModel";

export class RoleInfoView extends ViewBase{
    private _ui:ui.views.roleinfo.ui_roleInfoViewUI;
    private _ctl:HeadCtl;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    private _wid:number;

    private _anim1:HeroAvatarView;
    private _chCtl:ChengHaoCtl;

    protected onAddLoadRes(): void {
        this.addAtlas('roleinfo.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.roleinfo.ui_roleInfoViewUI();
            this.bindClose(this._ui.btn_close);

            this._wid = this._ui.pro.width;

            this._ctl = new HeadCtl(this._ui.view);
            this._chCtl = new ChengHaoCtl(this._ui.view_ch);

            this._ui.view_ch.on(Laya.Event.CLICK,this,this.onBtnCHClick);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2, new Laya.Handler(this, this.onBtn2Click)),
                ButtonCtl.Create(this._ui.btn_ch, new Laya.Handler(this, this.onBtnCHClick),false)
            )
        }
    }

    private onBtnClick(){
        E.ViewMgr.Open(EViewType.RoleInfoView2);
    }

    private onBtn1Click(){
        E.ViewMgr.Open(EViewType.RoleInfoView1);
    }

    private onBtnCHClick(){
        E.ViewMgr.Open(EViewType.ChengHaoView);
    }

    private onBtn2Click(){
        E.sdk.setCopy(this._ui.lab4.text);
        E.ViewMgr.ShowMidOk("复制成功");
    }

    protected onInit(): void {
        TowerMainModel.Ins.on(TowerMainEvent.UpdateRoleData,this,this.updateRole);
        ChengHaoModel.Ins.on(ChengHaoModel.UPDATE_TITLE,this,this.updateCH);
        this.updateRole();
        this.updateCH();
        this.disposeHero();
        this._anim1 = FightFactory.createBigHeroAvatar(5, this._ui.sp,0,10);
    }

    protected onExit(): void {
        TowerMainModel.Ins.off(TowerMainEvent.UpdateRoleData,this,this.updateRole);
        ChengHaoModel.Ins.off(ChengHaoModel.UPDATE_TITLE,this,this.updateCH);
        this.disposeHero();
    }
    
    private disposeHero() {
        if (this._anim1) {
            this._anim1.dispose();
            this._anim1 = null;
        }
    }

    private updateCH(){
        this._chCtl.setData(ChengHaoModel.Ins.titleId);
    }

    private updateRole(){
        let data = MainModel.Ins.mRoleData;
        this._ctl.setData(data.headUrl,data.HeadFrame);
        this._ui.lab.text = data.trophy + "";
        this._ui.lab1.text = data.getName();
        this._ui.lab2.text = "lv:" + data.lv;
        let cfg = t_Player_Exp.Ins.getCfgByLv(data.lv);
        if(cfg){
            this._ui.pro.width = data.exp / cfg.f_ExpValue * this._wid;
            this._ui.lab3.text = data.exp + "/" + cfg.f_ExpValue;
        }
        this._ui.lab4.text = data.AccountId + "";
        this._ui.lab5.text = TowertMainHeroModel.Ins.getHeroList().length + "/" + HeroListProxy.Ins.getList().length;
        this._ui.lab6.text = TowertMainLinbaoModel.Ins.linbaoList.length + "/" + t_Treasure.Ins.List.length;
        this._ui.lab7.text = TowertMainCardModel.Ins.cardList.length + "/" + t_Function_Card.Ins.getList().length;

        let arr = RoleInfoModel.Ins.careerList;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].flag == 1){
                this._ui.lab8.text = arr[i].times + "";
            }else if(arr[i].flag == 2){
                this._ui.lab9.text = arr[i].times + "";
            }else if(arr[i].flag == 3){
                this._ui.lab10.text = arr[i].times + "";
            }
        }

        arr = RoleInfoModel.Ins.pveList;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].flag == 1){
                this._ui.lab11.text = arr[i].times + "";
            }else if(arr[i].flag == 2){
                this._ui.lab12.text = arr[i].times + "";
            }else if(arr[i].flag == 3){
                this._ui.lab13.text = arr[i].times + "";
            }
        }
    }
}