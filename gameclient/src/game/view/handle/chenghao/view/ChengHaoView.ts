// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { TitleSwitch_req } from "../../../../network/protocols/BaseProto";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";
import { ChengHaoModel } from "../model/ChengHaoModel";
import { t_Title } from "../proxy/t_Title";
import { ChengHaoItem } from "./ChengHaoItem";

export class ChengHaoView extends ViewBase {
    private _ui: ui.views.chenghao.ui_chenghaoViewUI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree: boolean = true;

    private _ctl: ChengHaoCtl;

    protected onAddLoadRes() {
        this.addAtlas("chenghao.atlas");
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.chenghao.ui_chenghaoViewUI;
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_js, new Laya.Handler(this, this.onBtnClick))
            )

            this._ui.list.itemRender = ChengHaoItem;
            this._ui.list.renderHandler = new Laya.Handler(this, this.onRenderHandler);
            this._ui.list.selectEnable = true;

            this._ctl = new ChengHaoCtl(this._ui.view);
        }
    }

    private onBtnClick() {
        let req = new TitleSwitch_req;
        req.titleId = this._ui.list.selectedItem.f_title_id;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onRenderHandler(item: ChengHaoItem, index: number) {
        item.setData(item.dataSource);
        if (index == this._ui.list.selectedIndex) {
            item.sel.visible = true;
            this.updateView1();
        } else {
            item.sel.visible = false;
        }
    }

    protected onInit(): void {
        ChengHaoModel.Ins.on(ChengHaoModel.UPDATE_DATA,this,this.onUpdateView);
        ChengHaoModel.Ins.on(ChengHaoModel.UPDATE_TITLE,this,this.onUpdateView);
        this.updateView();
    }

    protected onExit(): void {
        ChengHaoModel.Ins.off(ChengHaoModel.UPDATE_DATA,this,this.onUpdateView);
        ChengHaoModel.Ins.off(ChengHaoModel.UPDATE_TITLE,this,this.onUpdateView);
    }

    private onUpdateView(){
        this.updateView1();
        this._ui.list.refresh();
    }

    private updateView1() {
        let cfg: Configs.t_Title_dat = this._ui.list.selectedItem;
        this._ctl.setData(cfg.f_title_id);
        this._ui.lab.text = cfg.f_access;
        if (cfg.f_title_id == ChengHaoModel.Ins.titleId) {
            this._ui.img1.visible = true;
            this._ui.btn_js.visible = false;
        } else {
            this._ui.img1.visible = false;
            this._ui.btn_js.visible = true;
            let data = ChengHaoModel.Ins.getDataById(cfg.f_title_id);
            if (data) {
                this._ui.btn_js.disabled = false;
                this._ui.lab1.text = "穿戴";
            } else {
                this._ui.btn_js.disabled = true;
                this._ui.lab1.text = "未拥有";
            }
        }
    }

    private updateView() {
        let arr = t_Title.Ins.List;
        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        for (let i: number = 0; i < arr.length; i++) {
            if (arr[i].f_title_id == ChengHaoModel.Ins.titleId) {
                arr1.push(arr[i]);
            } else {
                let data = ChengHaoModel.Ins.getDataById(arr[i].f_title_id);
                if (data) {
                    arr2.push(arr[i]);
                } else {
                    arr3.push(arr[i]);
                }
            }
        }
        arr2.sort(this.onSort);
        arr3.sort(this.onSort);
        this._ui.list.array = arr1.concat(arr2).concat(arr3);
        this._ui.list.selectedIndex = 0;
    }

    private onSort(a: Configs.t_Title_dat, b: Configs.t_Title_dat) {
        return a.f_sort - b.f_sort;
    }
}