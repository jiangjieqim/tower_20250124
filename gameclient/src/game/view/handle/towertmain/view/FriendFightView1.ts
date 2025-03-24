import { InitConfig, PlatformConfig } from "../../../../../InitConfig";
// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { TowerMainFightModel } from "../model/TowerMainFightModel";

export class FriendFightView1 extends ViewBase{
    private _ui:ui.views.main.ui_friendView1UI;

    protected mMask = true; 
    protected mMaskClick = false;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _anim1:HeroAvatarView;
    private _anim2:HeroAvatarView;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_friendView1UI();

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_close, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2, new Laya.Handler(this, this.onBtn2Click))
            )
        }
    }

    private onBtnClick(){
        TowerMainFightModel.Ins.sendRoom(0,0);
        this.Close();
    }

    private onBtn1Click(){
        E.sdk.goShareData('wxFriendRoomId=' + TowerMainFightModel.Ins.friendRoomId);
    }

    private onBtn2Click(){
        E.sdk.setCopy(this._ui.lab.text);
        E.ViewMgr.ShowMidOk("复制成功");
    }

    protected onInit(): void {
        this.updateView();
    }

    protected onExit(): void {
        TowerMainFightModel.Ins.friendRoomId = "";
        this.disposeHero();
    }

    private updateView(){
        this.disposeHero();
        let val = System_RefreshTimeProxy.Ins.getVal(25);
        let arr = val.split("|");
        this._anim1 = FightFactory.createBigHeroAvatar(parseInt(arr[0]), this._ui.sp,0,10);
        this._anim2 = FightFactory.createBigHeroAvatar(parseInt(arr[1]), this._ui.sp1,0,20);
        this._ui.lab.text = TowerMainFightModel.Ins.friendRoomId;
        if(initConfig.platform == PlatformConfig.TAPTAP){
            this._ui.btn1.visible = false;
        }else{
            this._ui.btn1.visible = true;
        }
    }

    private disposeHero() {
        if (this._anim1) {
            this._anim1.dispose();
            this._anim1 = null;
        }
        if (this._anim2) {
            this._anim2.dispose();
            this._anim2 = null;
        }
    }
}