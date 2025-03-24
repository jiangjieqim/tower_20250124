import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { InviteBind_req } from "../../../../network/protocols/BaseProto";

export class YaoQingTapView1 extends ViewBase{
    private _ui:ui.views.shezhi.ui_yaoqingTapView1UI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes() {
        this.addAtlas('shezhi.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shezhi.ui_yaoqingTapView1UI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            )
        }
    }

    private onBtnClick(){
        if (StringUtil.IsNullOrEmpty(this._ui.input.text)) {
            return;
        }
        let req = new InviteBind_req();
        req.code = this._ui.input.text;
        req.platId = initConfig.platform;
        SocketMgr.Ins.SendMessageBin(req);
        this.Close();
    }

    protected onInit(): void {
        this._ui.input.text = "";
    }

    protected onExit(): void {
        
    }
}