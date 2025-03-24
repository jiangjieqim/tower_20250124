import { RowMoveBaseNode, ScrollPanelControl } from "../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";

const mClsKey:string = "TipNodeView";

class TipNodeView extends RowMoveBaseNode{
    protected clsKey:string = mClsKey;
    protected createNode (index){
        let _skin:ui.views.common.ui_helpItemUI = Laya.Pool.getItemByClass(this.clsKey,ui.views.common.ui_helpItemUI);
        _skin.descTf.text = this.list[index];
        _skin.height = _skin.descTf.y + _skin.descTf.textField.height;
        _skin.y = this.y;
        return _skin;
    }

    public static getHeight(value:string){
        let _skin:ui.views.common.ui_helpItemUI = Laya.Pool.getItemByClass(mClsKey,ui.views.common.ui_helpItemUI);
        _skin.descTf.text = value;
        return _skin.descTf.y + _skin.descTf.textField.height;
    }
}

/**大公告 */
export class TipView extends ViewBase {
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _ui:ui.views.common.ui_helpViewUI;
    private _panelCtl: ScrollPanelControl;

    protected onAddLoadRes(): void { 
       
    }

    protected onExit(): void { }
    
    protected onFirstInit(): void { 
        if(!this.UI){
            this.UI = this._ui = new ui.views.common.ui_helpViewUI();

            this._panelCtl = new ScrollPanelControl();
            this._panelCtl.init(this._ui.panel);
            this.bindClose(this._ui.btn_close);
        }
    }

    protected onInit(): void {
        this._panelCtl.clear();
        this._ui.lab.text = this.Data[0];
        let st = this.Data[1];
        let h = TipNodeView.getHeight(st);
        this._panelCtl.split([st],TipNodeView,h,20);
        this._panelCtl.end();
    }
}