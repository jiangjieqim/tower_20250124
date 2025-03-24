// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E, ScreenAdapter } from "../../../../G";
import { FCardPlanChange_req, stFCard } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { IListData, QuickQua, SelectListCtl } from "../../main/ctl/SelectListCtl";
import { ValCtl } from "../../main/ctl/ValLisCtl";
import { MainModel } from "../../main/model/MainModel";
import { ECellType } from "../../main/vos/ECellType";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
// import { YinDaoModel } from "../../yindao/YinDaoModel";
import { TowertMainCardModel } from "../model/TowertMainCardModel";
import { t_Arena } from "../proxy/t_Arena";
import { t_Function_Card } from "../proxy/t_Function_Card";
import { TowertMainCardItem } from "./item/TowertMainCardItem";
import { TowertMainCardItem1 } from "./item/TowertMainCardItem1";

export class TowertMainCardView extends ui.views.card.ui_cardViewUI{

    private selCtl: SelectListCtl;
    private selCtl1: SelectListCtl;
    private selCtl2: SelectListCtl;
    private _se:SimpleEffect;
    // private _se1:SimpleEffect;

    private _btnCtl:ButtonCtl;
    private _btnCtl1:ButtonCtl;
    private _btnCtl2:ButtonCtl;

    constructor(){
        super();
    }

    createChildren(){
        Laya.loader.load([{ url: "res/atlas/remote/card.atlas", type: Laya.Loader.ATLAS }], new Laya.Handler(this, this.onInit));
    }
    
    private onInit(){
        super.createChildren();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);

        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
        this._btnCtl = ButtonCtl.Create(this.btn3,new Laya.Handler(this,this.onBtn3Click));
        ButtonCtl.Create(this.btn_cq,new Laya.Handler(this,this.onBtnCQClick));
        this._btnCtl1 = ButtonCtl.Create(this.btn1,new Laya.Handler(this,this.onBtn1Click));
        this._btnCtl2 = ButtonCtl.Create(this.btn2,new Laya.Handler(this,this.onBtn2Click));

        ValCtl.Create(this.money1.lab,this.money1.icon,ECellType.JINBI,this.money1.sp);
        ValCtl.Create(this.money2.lab,this.money2.icon,ECellType.SHUIJING,this.money2.sp);

        this.list.itemRender = TowertMainCardItem;
        this.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        // this.list.disableScroll = true;

        this.list1.itemRender = TowertMainCardItem1;
        this.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);

        this.selCtl = new SelectListCtl();
        this.selCtl.dirBottom = true;
        this.selCtl.listcontainerOffX = 13;
        this.selCtl.listcontainerOffHeight = 15;
        this.selCtl.init(this.sanjiao, this.listarea, this.listcontainer, this.listtf, ui.views.card.ui_cardSelectItemUI,
            this.getSelList(1), "remote/linbao/btn_yq_s.png");
        this.selCtl.selectHandler = new Laya.Handler(this, this.onQuaSelHandler);

        this.selCtl1 = new SelectListCtl();
        this.selCtl1.dirBottom = true;
        this.selCtl1.listcontainerOffX = 13;
        this.selCtl1.listcontainerOffHeight = 15;
        this.selCtl1.init(this.sanjiao2, this.listarea2, this.listcontainer2, this.listtf2, ui.views.card.ui_cardSelectItemUI,
            this.getSelList(2), "remote/linbao/btn_yq_s.png");
        this.selCtl1.selectHandler = new Laya.Handler(this, this.onQuaSelHandler);

        this.selCtl2 = new SelectListCtl();
        this.selCtl2.dirBottom = true;
        this.selCtl2.listcontainerOffX = 30;
        this.selCtl2.listcontainerOffHeight = 12;
        this.selCtl2.init(this.sanjiao1, this.listarea1, this.listcontainer1, this.listtf1, ui.views.card.ui_cardSelectItem1UI,
            this.getSelList(3), "remote/card/btn_fa.png");
        this.selCtl2.selectHandler = new Laya.Handler(this, this.onQuaSelHandler1);
    }

    private getSelList(type:number):IListData[]{
        let st;
        if(type == 1){
            st = E.LangMgr.getLang("cardSelect");
        }else if(type == 2){
            st = E.LangMgr.getLang("cardSelect1");
        }else{
            st = E.LangMgr.getLang("cardSelect2");
        }
        let arr: IListData[] = [];
        let l = st.split(";");
        for (let i = 0; i < l.length; i++) {
            let ss = l[i].split("-");
            let vo = new QuickQua();
            vo.f_id = parseInt(ss[0]);
            vo.color = "ffffff";
            vo.txt = ss[1];
            arr.push(vo);
        }
        return arr;
    }

    private onQuaSelHandler(){
        this.updateView();
    }

    private onQuaSelHandler1(){
        let req = new FCardPlanChange_req;
        req.planId = this.selCtl2.selectVo.f_id;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onBtnClick(){
        E.ViewMgr.Open(EViewType.TowertMainCardView1);
    }

    private onBtn3Click(){
        if(!TowertMainCardModel.Ins.isPeiZhi){
            E.sendTrack("configure_cards");
        }
        TowertMainCardModel.Ins.isPeiZhi = !TowertMainCardModel.Ins.isPeiZhi;
        this.setLab();
        this.updateView();
    }

    private onBtnCQClick(){
        E.ViewMgr.Open(EViewType.CardCQView);
    }

    private onBtn1Click(){
        TowertMainCardModel.Ins.sendCmd(1,0);
    }

    private onBtn2Click(){
        TowertMainCardModel.Ins.sendCmd(0,0);
    }

    private onRenderHandler(item:TowertMainCardItem){
        item.setData(item.dataSource);
    }

    private onRenderHandler1(item:TowertMainCardItem1){
        item.setData(item.dataSource);
    }

    protected onDisplay(): void {
        this.setUI();
        TowertMainCardModel.Ins.on(TowertMainCardModel.UPDATE_CARD,this,this.updateView);
        TowertMainCardModel.Ins.on(TowertMainCardModel.UPDATE_PLANID,this,this.updateView1);
        TowertMainCardModel.Ins.on(TowertMainCardModel.UPDATE_PLAN,this,this.updateView1);
        // YinDaoModel.Ins.on(YinDaoModel.UPDATE_VIEW,this,this.setYinDao);
        // MainModel.Ins.on(TowerMainEvent.MainViewLayerChange,this,this.setYinDao);
        TowertMainCardModel.Ins.isPeiZhi = false;
        this.setLab();
        this.selCtl.selectIndex(0);
        this.selCtl1.selectIndex(0);
        this.selCtl2.selectIndex(TowertMainCardModel.Ins.planId - 1);
        this.playSE();
        // this.setYinDao();
    }

    protected onUnDisplay(): void {
        TowertMainCardModel.Ins.off(TowertMainCardModel.UPDATE_CARD,this,this.updateView);
        TowertMainCardModel.Ins.off(TowertMainCardModel.UPDATE_PLANID,this,this.updateView1);
        TowertMainCardModel.Ins.off(TowertMainCardModel.UPDATE_PLAN,this,this.updateView1);
        // YinDaoModel.Ins.off(YinDaoModel.UPDATE_VIEW,this,this.setYinDao);
        // MainModel.Ins.off(TowerMainEvent.MainViewLayerChange,this,this.setYinDao);
        this.selCtl.close();
        this.selCtl1.close();
        this.selCtl2.close();
        this.disposeSE();
        // YinDaoModel.Ins.removeYD();
    }

    // private setYinDao(){
    //     Laya.timer.callLater(this,()=>{
    //         YinDaoModel.Ins.addYD(4000);
    //     })
    // }

    private playSE(){
        this._se = new SimpleEffect(this.sp, `o/spine/succeed/FunctionCard/FunctionCard`,this.sp.width*0.5,this.sp.height*0.5);
        this._se.play(0,true);
        // this._se1 = new SimpleEffect(this.btn3, `o/spine/succeed/configure_button/configure_button`,this.btn3.width*0.5,this.btn3.height*0.5);
        // this._se1.play(0,true);
    }

    private disposeSE(){
        if(this._se){
            this._se.dispose();
            this._se = null;
        }
        // if(this._se1){
        //     this._se1.dispose();
        //     this._se1 = null;
        // }
    }

    private setLab(){
        if(TowertMainCardModel.Ins.isPeiZhi){
            this.lab5.text = "完成配置";
        }else{
            this.lab5.text = "配置卡牌";
        }
    }

    private updateView(){
        let array = [];
        let arr = TowertMainCardModel.Ins.cardList;
        arr.sort(this.onSort);
        for(let i:number=0;i<arr.length;i++){
            let cfg = t_Function_Card.Ins.getCfgById(arr[i].id);
            if(this.selCtl.selectVo.f_id == 0 || this.selCtl.selectVo.f_id == cfg.f_qua){
                if(this.selCtl1.selectVo.f_id == 0 || this.selCtl1.selectVo.f_id == cfg.f_label){
                    array.push(arr[i]);
                }
            }
        }
        this.list.array = array;
    }

    private onSort(a:stFCard,b:stFCard){
        let aa = t_Function_Card.Ins.getCfgById(a.id);
        let bb = t_Function_Card.Ins.getCfgById(b.id);
        return bb.f_qua - aa.f_qua;
    }

    private updateView1(){
        this.list1.array = TowertMainCardModel.Ins.getNowCardPlanData();
        this.list.refresh();
        let self = t_Arena.Ins.getCfgByTrophy(MainModel.Ins.mRoleData.trophy);
        this.lab.text = TowertMainCardModel.Ins.getPlanCount() + "/" + self.f_card_max_amount;
    }

    private _isSetUI:boolean;
    private setUI(){
        if(!this._isSetUI){
            this._isSetUI = true;
            let yy = (Laya.stage.height - ScreenAdapter.DefaultHeight) / 2;
            if(yy > 0){
                this.height += yy;
                this.bg.height += yy + 6;
                this.list.height += yy;
                this._btnCtl.setY(this.btn3.y + yy);
                this.list1.height += yy;
                this.img_lab.y += yy;
                this._btnCtl1.setY(this.btn1.y + yy);
                this._btnCtl2.setY(this.btn2.y + yy);
            }
        }
    }
}