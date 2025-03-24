// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { RedemptionCode_req } from "../../../../network/protocols/BaseProto";

export class DHMView extends ViewBase{
    private _ui: ui.views.shezhi.ui_duihuanma_viewUI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes() {
        this.addAtlas('shezhi.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shezhi.ui_duihuanma_viewUI();
            this.bindClose(this._ui.btn_close);
            ButtonCtl.CreateBtn(this._ui.btn,this,this.onExchangeHandler);
        }
    }

    protected onInit(): void {
        this._ui.input.text = "";
    }

    protected onExit(): void {
        
    }

    private onExchangeHandler(){
        if (StringUtil.IsNullOrEmpty(this._ui.input.text)) {
            return;
        }
        let req = new RedemptionCode_req();
        req.code = this._ui.input.text;
        SocketMgr.Ins.SendMessageBin(req);
    }
}