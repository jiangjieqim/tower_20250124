// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";

export class GQTapTapView extends ViewBase{
    private _ui:ui.views.shezhi.ui_taptapViewUI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private tabsCtl:TabControl;
    private tabList: any;

    protected onAddLoadRes() {
        this.addAtlas('shezhi.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shezhi.ui_taptapViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click))
            )

            const tabsSkin = [this._ui.tab1,this._ui.tab2];
            let st = E.getLang("taptaptab");
            this.tabList = st.split("-");
            this.tabsCtl  = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this,this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));
        }
    }

    private onTabSelectHandler(v: number) {
        switch (v) {
            case 0:
                this._ui.sp1.visible = true;
                this._ui.sp2.visible = false;
                break;
            case 1:
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = true;
                break;
        }
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.shezhi.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        if (sel) {
            skin.img.skin = "remote/shezhi/btn_s.png";
            skin.lab.color = "#fff7cc";
            skin.lab.strokeColor = "#ac2c00";
        } else {
            skin.img.skin = "remote/shezhi/btn_n.png";
            skin.lab.color = "#dfb9ac";
            skin.lab.strokeColor = "#703620";
        }
    }

    private onBtnClick(){
        E.sdk.setCopy(this._ui.lab.text);
        E.ViewMgr.ShowMidOk("复制成功");
    }

    private onBtn1Click(){
        E.sdk.gotoTapTap(System_RefreshTimeProxy.Ins.getVal(71));//拍脸
    }

    protected onInit(): void {
        this._ui.lab.text = System_RefreshTimeProxy.Ins.getVal(56);
        this.tabsCtl.selectIndex = 0;
    }

    protected onExit(): void {
        
    }
}