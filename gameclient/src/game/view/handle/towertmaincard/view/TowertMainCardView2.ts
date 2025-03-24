// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
// import { CheckBoxCtl, ICheckBoxSkin } from "../../../../../frame/view/CheckBoxCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FCardBreakDown_req, stFCard } from "../../../../network/protocols/BaseProto";
import { IconUtils } from "../../main/model/IconUtils";
import { ECellType } from "../../main/vos/ECellType";
import { TowertMainCardModel } from "../model/TowertMainCardModel";
import { t_Function_Card } from "../proxy/t_Function_Card";
import { TowertMainCardItem3 } from "./item/TowertMainCardItem3";

export class TowertMainCardView2 extends ViewBase{
    private _ui:ui.views.card.ui_cardView2UI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private ckCtl1:CheckBoxCtl;
    private ckCtl2:CheckBoxCtl;
    private ckCtl3:CheckBoxCtl;
    private ckCtl4:CheckBoxCtl;

    protected onAddLoadRes() {
        this.addAtlas("card.atlas");
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.card.ui_cardView2UI;

            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2, new Laya.Handler(this, this.onBtn2Click))
            )

            this._ui.list.itemRender = TowertMainCardItem3;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this.ckCtl1 = new CheckBoxCtl({bg:this._ui.img1,gou:this._ui.gou1} as ICheckBoxSkin);
            this.ckCtl1.selectHander = new Laya.Handler(this,this.onSelectHander1);
            this.ckCtl2 = new CheckBoxCtl({bg:this._ui.img2,gou:this._ui.gou2} as ICheckBoxSkin);
            this.ckCtl2.selectHander = new Laya.Handler(this,this.onSelectHander2);
            this.ckCtl3 = new CheckBoxCtl({bg:this._ui.img3,gou:this._ui.gou3} as ICheckBoxSkin);
            this.ckCtl3.selectHander = new Laya.Handler(this,this.onSelectHander3);
            this.ckCtl4 = new CheckBoxCtl({bg:this._ui.img4,gou:this._ui.gou4} as ICheckBoxSkin);
            this.ckCtl4.selectHander = new Laya.Handler(this,this.onSelectHander4);
        }
    }

    private onBtn1Click() {
        if(TowertMainCardModel.Ins.selectList.length == 0){
            E.ViewMgr.ShowMidError("请先选择卡牌");
            return;
        }
        let arr = [];
        for (let i: number = 0; i < TowertMainCardModel.Ins.selectList.length; i++) {
            let id = TowertMainCardModel.Ins.selectList[i].id;
            let num = TowertMainCardModel.Ins.selectList[i].num;
            let index = arr.findIndex(ele => ele.id === id);
            if(index == -1){
                let data = new stFCard;
                data.id = id;
                data.num = num;
                arr.push(data);
            }else{
                arr[index].num += num;
            }
        }
        let req = new FCardBreakDown_req;
        req.cards = arr;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onBtn2Click(){
        this.ckCtl1.selected = this.ckCtl2.selected =
        this.ckCtl3.selected = this.ckCtl4.selected = false;
        TowertMainCardModel.Ins.selectList = [];
        this.updateList();
    }

    private onRenderHandler(item:TowertMainCardItem3){
        item.setData(item.dataSource);
    }

    private onSelectHander1() {
        this.updateData(1,this.ckCtl1.selected);
        this.updateList();
    }

    private onSelectHander2() {
        this.updateData(2,this.ckCtl2.selected);
        this.updateList();
    }

    private onSelectHander3() {
        this.updateData(3,this.ckCtl3.selected);
        this.updateList();
    }

    private onSelectHander4() {
        this.updateData(4,this.ckCtl4.selected);
        this.updateList();
    }

    private updateData(qua:number,flag:boolean){
        if(flag){
            for(let m:number=0;m<this._cradList.length;m++){
                let cfg = t_Function_Card.Ins.getCfgById(this._cradList[m].id);
                if(cfg.f_qua == qua){
                    let index = TowertMainCardModel.Ins.selectList.findIndex(ele=>ele.uid == this._cradList[m].uid);
                    if(index == -1){
                        TowertMainCardModel.Ins.selectList.push(this._cradList[m]);
                    }
                }
            }
        }else{
            for(let i:number=0;i<TowertMainCardModel.Ins.selectList.length;i++){
                let cfg = t_Function_Card.Ins.getCfgById(TowertMainCardModel.Ins.selectList[i].id);
                if(cfg.f_qua == qua){
                    TowertMainCardModel.Ins.selectList.splice(i,1);
                    i = -1;
                }
            }
        }
    }

    protected onInit(): void {
        TowertMainCardModel.Ins.on(TowertMainCardModel.UPDATE_CARD,this,this.updateView);
        TowertMainCardModel.Ins.on(TowertMainCardModel.UPDATE_SELECT,this,this.updateList);
        this.updateView();
        this._ui.icon.skin = IconUtils.getIconByCfgId(ECellType.CARD_DC);

        // this._ui.list.scrollBar = "";
    }

    protected onExit(): void {
        TowertMainCardModel.Ins.off(TowertMainCardModel.UPDATE_CARD,this,this.updateView);
        TowertMainCardModel.Ins.off(TowertMainCardModel.UPDATE_SELECT,this,this.updateList);
    }

    private updateList(){
        this._ui.list.refresh();
        this.setLab();
    }

    private _cradList:any[];
    private updateView(){
        this.ckCtl1.selected = this.ckCtl2.selected =
        this.ckCtl3.selected = this.ckCtl4.selected = false;
        TowertMainCardModel.Ins.selectList = [];
        this._cradList = [];
        this.setLab();
        let index = 1;
        let arr = TowertMainCardModel.Ins.cardList;
        for(let i:number=0;i < arr.length;i++){
            let cfg = t_Function_Card.Ins.getCfgById(arr[i].id);
            let num = arr[i].num - cfg.f_max_amount;
            if(num > 0){
                if(cfg.f_qua == 4){
                    for(let j:number=0;j<num;j++){
                        let obj: any = {};
                        obj.id = arr[i].id;
                        obj.num = 1;
                        obj.uid = index;
                        this._cradList.push(obj);
                        index ++;
                    }
                }else{
                    let obj:any = {};
                    obj.id = arr[i].id;
                    obj.num = num;
                    obj.uid = index;
                    this._cradList.push(obj);
                    index ++;
                }
            }
        }

        this._cradList.sort(this.onSort);
        this._ui.list.array = this._cradList;
    }

    private onSort(a,b){
        let aa = t_Function_Card.Ins.getCfgById(a.id);
        let bb = t_Function_Card.Ins.getCfgById(b.id);
        return bb.f_qua - aa.f_qua;
    }

    private setLab(){
        let num = 0;
        for(let i:number=0;i<TowertMainCardModel.Ins.selectList.length;i++){
            let cfg = t_Function_Card.Ins.getCfgById(TowertMainCardModel.Ins.selectList[i].id);
            let val = parseInt(cfg.f_disenchant.split("-")[1]);
            num += val * TowertMainCardModel.Ins.selectList[i].num;
        }
        this._ui.lab.text = "x" + num;
    }
}