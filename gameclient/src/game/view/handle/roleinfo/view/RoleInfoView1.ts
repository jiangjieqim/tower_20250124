// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { NickNameChange_req } from "../../../../network/protocols/BaseProto";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { IconUtils } from "../../main/model/IconUtils";
import { RoleInfoModel } from "../model/RoleInfoModel";

export class RoleInfoView1 extends ViewBase{
    private _ui:ui.views.roleinfo.ui_roleInfoView1UI;

    protected mMask = true; 
    protected mMainSnapshot = true;

    private _anim1:HeroAvatarView;

    protected onAddLoadRes(): void {
        
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.roleinfo.ui_roleInfoView1UI();
            this.bindClose(this._ui.btn_close);

            ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick));
        }
    }

    private onBtnClick() {
        if (this._ui.input.text == "") {
            E.ViewMgr.ShowMidError("输入修改的昵称");
            return;
        }
        let req: NickNameChange_req = new NickNameChange_req;
        req.nickName = this._ui.input.text;
        SocketMgr.Ins.SendMessageBin(req);
    }

    protected onInit(): void {
        this._ui.input.text = "";
        if(RoleInfoModel.Ins.nameCellValue && RoleInfoModel.Ins.nameCellValue.count){
            this._ui.lab1.visible = false;
            this._ui.sp.visible = true;
            this._ui.icon.skin = IconUtils.getIconByCfgId(RoleInfoModel.Ins.nameCellValue.id);
            this._ui.lab.text = RoleInfoModel.Ins.nameCellValue.count + "";
        }else{
            this._ui.lab1.visible = true;
            this._ui.sp.visible = false;
        }
        this.disposeHero();
        this._anim1 = FightFactory.createBigHeroAvatar(3, this._ui.sp1,0,16);
    }

    protected onExit(): void {
        this.disposeHero();
    }

    private disposeHero() {
        if (this._anim1) {
            this._anim1.dispose();
            this._anim1 = null;
        }
    }
}