// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
// import { CheckBoxCtl, ICheckBoxSkin } from "../../../../../../frame/view/CheckBoxCtl";
import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { EPageType, EViewType } from "../../../../../common/defines/EnumDefine";
import { stFCard } from "../../../../../network/protocols/BaseProto";
import { SpineCoreSkel } from "../../../avatar/spine/SpineCoreSkel";
import { TowerMainModel } from "../../../towertmain/model/TowerMainModel";
import { TowertMainCardModel } from "../../model/TowertMainCardModel";
import { t_Function_Card } from "../../proxy/t_Function_Card";
import { t_Function_Card_Match } from "../../proxy/t_Function_Card_Match";

export class CardCQView2 extends ViewBase{
    private _ui:ui.views.cardcq.ui_cardCQView1UI;
    public PageType: EPageType = EPageType.None;
    protected mMask = true;
    protected mMaskClick: boolean = false;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private skel:SpineCoreSkel;
    private _card1:SpineCoreSkel;
    private _card2:SpineCoreSkel;
    private _card3:SpineCoreSkel;
    private _card4:SpineCoreSkel;
    private _card5:SpineCoreSkel;

    private ckCtl1:CheckBoxCtl;
    private ckCtl2:CheckBoxCtl;

    protected onAddLoadRes(): void {
        this.addAtlas("cardcq.atlas");
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.cardcq.ui_cardCQView1UI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick))
            )

            for(let i:number=1;i<6;i++){
                this._ui["sp" + i].on(Laya.Event.CLICK,this,this.onClick,[i]);
                this._ui["s" + i].on(Laya.Event.CLICK,this,this.onSClick,[i]);
            }

            this._ui.on(Laya.Event.CLICK,this,this.onUIClick);

            this.ckCtl1 = new CheckBoxCtl({bg:this._ui.bg,gou:this._ui.gou} as ICheckBoxSkin);
            this.ckCtl1.selectHander = new Laya.Handler(this,this.onSelectHander1);
            this.ckCtl2 = new CheckBoxCtl({bg:this._ui.bg1,gou:this._ui.gou1} as ICheckBoxSkin);
            this.ckCtl2.selectHander = new Laya.Handler(this,this.onSelectHander2);
        }
    }

    private onSelectHander1() {
        TowertMainCardModel.Ins.cqAuto = this.ckCtl1.selected;
        TowertMainCardModel.Ins.event(TowertMainCardModel.UPDATE_AUTO);
    }

    private onSelectHander2() {
        TowertMainCardModel.Ins.cqTG = this.ckCtl2.selected;
        TowertMainCardModel.Ins.event(TowertMainCardModel.UPDATE_AUTO);
    }

    private _isAutoClick:boolean;
    private onUIClick(){
        if(TowertMainCardModel.Ins.cqAuto && !this._isAutoClick){
            this._isAutoClick = true;
        }
    }

    private onSClick(i){
        let data = this._list[i -1];
        let cfg = t_Function_Card.Ins.getCfgById(data.id);
        E.ViewMgr.Open(EViewType.TowertMainCardTip1,null,cfg);
    }

    private onBtnClick(){
        let cfg = t_Function_Card_Match.Ins.getCfgById(TowertMainCardModel.Ins.cqKBId);
        if(TowerMainModel.Ins.isItemEnoughSt(cfg.f_consume_item,true)){
            TowertMainCardModel.Ins.sendCQCmd(TowertMainCardModel.Ins.cqKBId);
        }
    }

    private _num;
    private onClick(i:number){
        this._ui["sp" + i].visible = false;
        this.playFCard(i);
        E.AudioMgr.StopSound();
        E.AudioMgr.PlaySound1("1004.mp3");
    }
    
    private playFCard(i:number){
        let data = this._list[i -1];
        let cfg = t_Function_Card.Ins.getCfgById(data.id);
        this["_card" + i].play(cfg.f_qua, this, this.onPlayCardEnd, [this["_card" + i],cfg,i], true);
    }

    private playAutoFCard(){
        for(let i:number=0;i<5;i++){
            Laya.timer.once(i*200,this,()=>{
                this.playFCard(i + 1);
            },null,false);
        }
    }

    private onPlayCardEnd(card, cfg,i) {
        card.play(cfg.f_qua + 4);
        this._ui["s" + i].visible = true;
        this._num++
        if (this._num == 5) {
            this._ui.lab_auto1.visible = false;
            TowertMainCardModel.Ins.event(TowertMainCardModel.CQYD2);
            if(this._isAutoClick){
                TowertMainCardModel.Ins.cqAuto = false;
                this.ckCtl1.selected = TowertMainCardModel.Ins.cqAuto;
                TowertMainCardModel.Ins.event(TowertMainCardModel.UPDATE_AUTO);
            }
            if (TowertMainCardModel.Ins.cqAuto) {
                let cfg = t_Function_Card_Match.Ins.getCfgById(TowertMainCardModel.Ins.cqKBId);
                if (TowerMainModel.Ins.isItemEnoughSt(cfg.f_consume_item, true)) {
                    TowertMainCardModel.Ins.sendCQCmd(TowertMainCardModel.Ins.cqKBId);
                }else{
                    this._ui.btn_close.visible = true;
                    let vo = TowertMainCardModel.Ins.cardGuaranteList.find(ele=>ele.packageid == TowertMainCardModel.Ins.cqKBId);
                    if(vo)this._ui.sp_3.visible = true;
                    this._ui.btn.visible = true;
                    this._ui.sp_5.visible = true;
                    this._ui.lab_auto.visible = false;
                }
            } else {
                this._ui.btn_close.visible = true;
                let vo = TowertMainCardModel.Ins.cardGuaranteList.find(ele=>ele.packageid == TowertMainCardModel.Ins.cqKBId);
                if(vo)this._ui.sp_3.visible = true;
                this._ui.btn.visible = true;
                this._ui.sp_5.visible = true;
                this._ui.lab_auto.visible = false;
            }
        }
    }

    private _list:stFCard[];
    protected onInit(): void {
        this._cardNum = 0;
        this.updateView(this.Data);
    }

    public updateView(data){
        this._list = data;
        this._num = 0;
        this._isAutoClick = false;
        let vo = TowertMainCardModel.Ins.cardGuaranteList.find(ele=>ele.packageid == TowertMainCardModel.Ins.cqKBId);
        if(vo)this._ui.lab.text = vo.guarante + "";
        this._ui.btn_close.visible = false;
        this._ui.sp_1.visible = false;
        this._ui.sp_2.visible = false;
        this._ui.sp_3.visible = false;
        this._ui.card.visible = false;
        this._ui.btn.visible = false;
        this._ui.sp_5.visible = false;
        this.ckCtl1.selected = TowertMainCardModel.Ins.cqAuto;
        this.ckCtl2.selected = TowertMainCardModel.Ins.cqTG;
        this._ui.lab_auto.visible = false;
        this._ui.lab_auto1.visible = false;
        for(let i:number=1;i<6;i++){
            this._ui["sp" + i].visible = true;
            this._ui["s" + i].visible = false;
        }
        this.playEff();
        this.playCard();
    } 

    protected onExit(): void {
        if(this.skel){
            this.skel.dispose();
            this.skel = null;
        }
        for(let i:number=1;i<6;i++){
            if(this["_card" + i]){
                this["_card" + i].dispose();
                this["_card" + i] = null;
            }
        }
        Laya.timer.clear(this,this.onPlayEnd1);
        TowertMainCardModel.Ins.isYD = false;
    }

    private playEff() {
        if(!this.skel){
            this.skel = new SpineCoreSkel();
        }
        let curURL = t_Function_Card_Match.Ins.getIcon(TowertMainCardModel.Ins.selectKBId);
        this.skel.setSlotImg("icon_kb_3", curURL);
        this.skel.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
        if(TowertMainCardModel.Ins.cqTG){
            this.onPlayEnd();
        }else{
            this.skel.play(2, this, this.onPlayEnd, undefined, true);
            E.AudioMgr.StopSound();
            E.AudioMgr.PlaySound1("1003.mp3");
        }
        this.skel.load(`o/spine/succeed/chouka/chouka.skel`);
    }

    private onCompleteHander(){
        if(this.skel && this.skel.skeleton){
            this.skel.skeleton.pos(8,-30);
            this._ui.sp.addChild(this.skel.skeleton);
        }else{
            LogSys.Error(`yonr this.skel.skeleton is null`)
        }
    }

    private onPlayEnd(){
        this.skel.play(3);
        this._ui.lab_auto.visible = TowertMainCardModel.Ins.cqAuto;
        this._ui.lab_auto1.visible = !TowertMainCardModel.Ins.cqAuto;
        this._ui.sp_2.visible = true;
        this._ui.card.visible = true;
        this.onPlayEnd1();
    }

    private onPlayEnd1(){
        if(this._cardNum >= 5){
            Laya.timer.callLater(this,()=>{
                if(TowertMainCardModel.Ins.cqAuto || TowertMainCardModel.Ins.isYD){
                    this.playAutoFCard();
                }else{
                    this._ui.sp_1.visible = true;
                }
            })
        }else{
            Laya.timer.once(30,this,this.onPlayEnd1);
        }
    }

    private playCard(){
        for(let i:number=1;i<6;i++){
            let data = this._list[i -1];
            let cfg = t_Function_Card.Ins.getCfgById(data.id);
            if(!this["_card" + i]){
                this["_card" + i] = new SpineCoreSkel();
            }
            this["_card" + i].setSlotImg("img_kp_1", t_Function_Card.Ins.getQuaSkin(cfg.f_qua));
            this["_card" + i].setSlotImg("img_kp_1_1", t_Function_Card.Ins.getIconById(cfg.f_card_imageid));
            this["_card" + i].once(Laya.Event.COMPLETE, this, this.onCardCompleteHander,[this["_card" + i],i]);
            this["_card" + i].play(0);
            this["_card" + i].load(`o/spine/succeed/chouka_fankai/chouka_fankai.skel`);
        }
    }

    private _cardNum;
    private onCardCompleteHander(card,i){
        if(card && card.skeleton){
            card.skeleton.pos(8,3);
            this._ui["card" + i].addChild(card.skeleton);
            this._cardNum++;
        }else{
            LogSys.Error(`yonr this.skel.skeleton is null`)
        }
    }
}