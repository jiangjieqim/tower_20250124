import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { E } from "../../../G";
import { IListData, QuickQua, SelectListCtl } from "../main/ctl/SelectListCtl";
import { MainModel } from "../main/model/MainModel";
import { ItemProxy } from "../main/proxy/ItemProxy";
import { SoltItemView } from "../main/views/icon/SoltItemView";
import { ItemVo } from "../main/vos/ItemVo";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../towertmain/model/TowerMainModel";

export class BagView extends ViewBase{
    private _ui:ui.views.bag.ui_bagViewUI;

    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree: boolean = true;
    private selCtl: SelectListCtl;

    protected onAddLoadRes(): void {
        this.addAtlas('bag.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.bag.ui_bagViewUI();
            this.bindClose(this._ui.btn_close);

            this._ui.list.itemRender = SoltItemView;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this.selCtl = new SelectListCtl();
            this.selCtl.init(this._ui.sanjiao, this._ui.listarea, this._ui.listcontainer, this._ui.listtf,ui.views.bag.ui_bagSelectItemUI,
                this.getList(),"remote/bag/bt_s.png");
            this.selCtl.selectHandler = new Laya.Handler(this,this.onQuaSelHandler);
        }
    }

    private onQuaSelHandler(){
        this.updateView();
    }

    private getList():IListData[]{
        let st = E.LangMgr.getLang("bagSelect");
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

    private onRenderHandler(item:SoltItemView){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        TowerMainModel.Ins.on(TowerMainEvent.ValChange,this,this.updateView);
        this.selCtl.selectIndex(0);
    }

    protected onExit(): void {
        TowerMainModel.Ins.off(TowerMainEvent.ValChange,this,this.updateView);
        this.selCtl.close();
    }

    private updateView(){
        let list = [];
        let arr = MainModel.Ins.mRoleData.mBaseInfo.moneyInfo;
        for(let i:number=0;i<arr.length;i++){
            let cfg = ItemProxy.Ins.getCfg(arr[i].id);
            if(cfg.f_bag_type){
                list.push(arr[i]);
            }
        }
        let array = [];
        for(let i:number=0;i<list.length;i++){
            let cfg = ItemProxy.Ins.getCfg(list[i].id);
            if(this.selCtl.selectVo.f_id == 0 || (this.selCtl.selectVo.f_id == cfg.f_type)){
                let vo = new ItemVo;
                vo.cfgId = list[i].id;
                vo.count = list[i].count;
                array.push(vo);
            }
        }
        this._ui.list.array = array;
    }
}