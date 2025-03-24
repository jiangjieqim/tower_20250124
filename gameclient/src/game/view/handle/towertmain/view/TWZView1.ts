import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { MainModel } from "../../main/model/MainModel";

export class TWZView1 extends ViewBase{
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _ui:ui.views.main.ui_tuweiView1UI;

    protected onAddLoadRes(): void { 
        this.addAtlas('tuweizhan.atlas');
    }

    
    protected onFirstInit(): void { 
        if(!this.UI){
            this.UI = this._ui = new ui.views.main.ui_tuweiView1UI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick),false),
            )
        }
    }

    private onBtnClick(){
        E.sdk.setCopy(this._ui.lab.text);
        E.ViewMgr.ShowMidOk("复制成功");
    }

    protected onInit(): void {
        this._ui.lab.text = MainModel.Ins.mRoleData.AccountId + "";
    }

    protected onExit(): void {
        
    }
}