// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
// import { CheckBoxCtl, ICheckBoxSkin } from "../../../../../../frame/view/CheckBoxCtl";
import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { EPageType, EViewType } from "../../../../../common/defines/EnumDefine";
import { SimpleEffect } from "../../../avatar/SimpleEffect";
import { ValCtl } from "../../../main/ctl/ValLisCtl";
import { MainModel } from "../../../main/model/MainModel";
import { ECellType } from "../../../main/vos/ECellType";
import { TowerMainEvent } from "../../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../../towertmain/model/TowerMainModel";
// import { YinDaoModel } from "../../../yindao/YinDaoModel";
import { TowertMainCardModel } from "../../model/TowertMainCardModel";
import { t_Function_Card_Match } from "../../proxy/t_Function_Card_Match";
import { CardCQItem } from "./CardCQItem";

export class CardCQView extends ViewBase{
    private _ui:ui.views.cardcq.ui_cardCQViewUI;
    public PageType: EPageType = EPageType.None;
    protected mMask = true;
    protected mMaskClick: boolean = false;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _succeed:SimpleEffect;
    private _se:SimpleEffect;
    private ckCtl1:CheckBoxCtl;
    private ckCtl2:CheckBoxCtl;

    protected onAddLoadRes(): void {
        this.addAtlas("cardcq.atlas");
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.cardcq.ui_cardCQViewUI();
            this.bindClose(this._ui.btn_close,true);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2, new Laya.Handler(this, this.onBtn2Click))
            )

            ValCtl.Create(this._ui.money1.lab,this._ui.money1.icon,ECellType.SHUIJING,this._ui.money1.sp,false);
            ValCtl.Create(this._ui.money2.lab,this._ui.money2.icon,ECellType.CARD_DC,this._ui.money2.sp,false);

            this._ui.list.itemRender = CardCQItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list.selectHandler = new Laya.Handler(this,this.onSelectHandler);
            this._ui.list.selectEnable = true;

            this.ckCtl1 = new CheckBoxCtl({bg:this._ui.bg,gou:this._ui.gou} as ICheckBoxSkin);
            this.ckCtl1.selectHander = new Laya.Handler(this,this.onSelectHander1);
            this.ckCtl2 = new CheckBoxCtl({bg:this._ui.bg1,gou:this._ui.gou1} as ICheckBoxSkin);
            this.ckCtl2.selectHander = new Laya.Handler(this,this.onSelectHander2);
        }
    }

    private onSelectHander1() {
        TowertMainCardModel.Ins.cqAuto = this.ckCtl1.selected;
    }

    private onSelectHander2() {
        TowertMainCardModel.Ins.cqTG = this.ckCtl2.selected;
    }

    private onBtnClick(){
        E.ViewMgr.Open(EViewType.CardCQView1);
    }

    private onBtn1Click(){
        E.ViewMgr.Open(EViewType.TowertMainCardView2);
    }

    private onBtn2Click(){
        TowertMainCardModel.Ins.sendCQCmd(TowertMainCardModel.Ins.selectKBId);
    }

    private onSelectHandler(){
        TowertMainCardModel.Ins.selectKBId = this._ui.list.selectedItem.f_packageid;
        this._ui.img.skin = t_Function_Card_Match.Ins.getIcon(TowertMainCardModel.Ins.selectKBId);
        this._ui.lab.text = this._ui.list.selectedItem.f_name;
        this._ui.img_btn.skin = `remote/card/icon_kc${TowertMainCardModel.Ins.selectKBId}.png`;
        this.setLab();
    }

    private onRenderHandler(item:CardCQItem,index:number){
        item.setData(item.dataSource);
    }

    private _len;
    protected onInit(): void {
        TowerMainModel.Ins.on(TowerMainEvent.ValChange,this,this.onValChange);
        TowertMainCardModel.Ins.on(TowertMainCardModel.UPDATE_CQLIST,this,this.onUpdateView);
        TowertMainCardModel.Ins.on(TowertMainCardModel.UPDATE_AUTO,this,this.onAuto);
        this.ckCtl1.selected = TowertMainCardModel.Ins.cqAuto;
        this.ckCtl2.selected = TowertMainCardModel.Ins.cqTG;
        TowertMainCardModel.Ins.isPlayEnd = false;
        this._len = 0;
        this.updateView();
        this._ui.sp.visible = false;
        this.playEff();
    }

    protected onExit(): void {
        TowerMainModel.Ins.off(TowerMainEvent.ValChange,this,this.onValChange);
        TowertMainCardModel.Ins.off(TowertMainCardModel.UPDATE_CQLIST,this,this.onUpdateView);
        TowertMainCardModel.Ins.off(TowertMainCardModel.UPDATE_AUTO,this,this.onAuto);
        if(this._succeed){
            this._succeed.dispose();
            this._succeed = null;
        }
        if(this._se){
            this._se.dispose();
            this._se = null;
        }
    }

    private setLab(){
        let vo = TowertMainCardModel.Ins.cardGuaranteList.find(ele=>ele.packageid == TowertMainCardModel.Ins.selectKBId);
        if(vo){
            this._ui.sp_ck.visible = true;
            this._ui.lab1.text = vo.guarante + "";
        }else{
            this._ui.sp_ck.visible = false;
        }
    }

    private onUpdateView(){
        this.setLab();
    }

    private onAuto(){
        this.ckCtl1.selected = TowertMainCardModel.Ins.cqAuto;
        this.ckCtl2.selected = TowertMainCardModel.Ins.cqTG;
    }

    private onValChange(){
        Laya.timer.callLater(this,this.updateView);
    }

    private updateView(){
        let array = [];
        let arr = t_Function_Card_Match.Ins.List;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_limited){
                array.push(arr[i]);
            }else{
                let id = parseInt(arr[i].f_consume_item.split("-")[0]);
                let n = MainModel.Ins.mRoleData.getVal(id);
                if(n){
                    array.push(arr[i]);
                }
            }
        }
        this._ui.list.array = array;
        if(this._len != array.length){
            this._len = array.length;
            this._ui.list.selectedIndex = 0;
        }
    }

    private playEff(){
        if (!this._succeed) {
            this._succeed = new SimpleEffect(this._ui.sp1, `o/spine/succeed/chouka/chouka`,8,-30);
        }
        this._succeed.play(0, false, this, this.onPlayEnd);
        if(!this._se){
            this._se = new SimpleEffect(this._ui.btn2, `o/spine/succeed/OPEN/OPEN`,this._ui.btn2.width*0.5,this._ui.btn2.height*0.5);
        }
        this._se.play(0,true);
    }

    private onPlayEnd(){
        this._succeed.play(1,true);
        this._ui.sp.visible = true;
        TowertMainCardModel.Ins.isPlayEnd = true;
        // YinDaoModel.Ins.addYD(this.ViewType);
        TowertMainCardModel.Ins.event(TowertMainCardModel.CQYD1);
    }
}