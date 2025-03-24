import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { IListData, QuickQua, SelectListCtl } from "../../main/ctl/SelectListCtl";
import { t_Function_Card } from "../proxy/t_Function_Card";
import { TowertMainCardItem2 } from "./item/TowertMainCardItem2";

export class TowertMainCardView1 extends ViewBase{
    private _ui:ui.views.card.ui_cardView1UI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private selCtl: SelectListCtl;
    private selCtl1: SelectListCtl;

    protected onAddLoadRes() {
        this.addAtlas("card.atlas");
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.card.ui_cardView1UI;

            this.bindClose(this._ui.btn_close);

            this._ui.list.itemRender = TowertMainCardItem2;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this.selCtl = new SelectListCtl();
            this.selCtl.dirBottom = true;
            this.selCtl.listcontainerOffX = 13;
            this.selCtl.listcontainerOffHeight = 15;
            this.selCtl.init(this._ui.sanjiao, this._ui.listarea, this._ui.listcontainer, this._ui.listtf, ui.views.card.ui_cardSelectItemUI,
                this.getSelList(1), "remote/linbao/btn_yq_s.png");
            this.selCtl.selectHandler = new Laya.Handler(this, this.onQuaSelHandler);

            this.selCtl1 = new SelectListCtl();
            this.selCtl1.dirBottom = true;
            this.selCtl1.listcontainerOffX = 13;
            this.selCtl1.listcontainerOffHeight = 15;
            this.selCtl1.init(this._ui.sanjiao2, this._ui.listarea2, this._ui.listcontainer2, this._ui.listtf2, ui.views.card.ui_cardSelectItemUI,
                this.getSelList(2), "remote/linbao/btn_yq_s.png");
            this.selCtl1.selectHandler = new Laya.Handler(this, this.onQuaSelHandler);
        }
    }

    private getSelList(type:number):IListData[]{
        let st;
        if(type == 1){
            st = E.LangMgr.getLang("cardSelect");
        }else{
            st = E.LangMgr.getLang("cardSelect1");
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

    private onRenderHandler(item:TowertMainCardItem2){
        item.setData(item.dataSource);
    }

    private onQuaSelHandler(){
        this.updateView();
    }

    protected onInit(): void {
        this.selCtl.selectIndex(0);
        this.selCtl1.selectIndex(0);
    }

    protected onExit(): void {
        this.selCtl.close();
        this.selCtl1.close();
    }

    private updateView(){
        let array = [];
        let arr = t_Function_Card.Ins.getList()
        arr.sort(this.onSort);
        for(let i:number=0;i<arr.length;i++){
            if(this.selCtl.selectVo.f_id == 0 || this.selCtl.selectVo.f_id == arr[i].f_qua){
                if(this.selCtl1.selectVo.f_id == 0 || this.selCtl1.selectVo.f_id == arr[i].f_label){
                    array.push(arr[i]);
                }
            }
        }
        this._ui.list.array = array;
    }

    private onSort(a:Configs.t_Function_Card_dat,b:Configs.t_Function_Card_dat){
        return b.f_qua - a.f_qua;
    }
}