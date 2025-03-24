import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { CancelMatch_req, FriendDiscussCancel_req } from "../../../../network/protocols/BaseProto";
import { EAvatarDir } from "../../avatar/AvatarView";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { MainModel } from "../../main/model/MainModel";
import { t_Arena } from "../../towertmaincard/proxy/t_Arena";
import { t_Tips } from "../proxy/t_Tips";
import { E } from "../../../../G";
import { t_FightStyle } from "../../compose/adapter/FightTypeAdapter";
import { EFightMode } from "../../compose/vos/EFightEnum";

export class JjcView extends ViewBase{
    private _ui:ui.views.main.ui_jjcViewUI;

    protected mMask = true; 
    protected mMaskClick = false;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _anim1:HeroAvatarView;
    private _anim2:HeroAvatarView;
    private _anim3:HeroAvatarView;
    private _timer:Laya.Timer;
    private _timer1:Laya.Timer;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_jjcViewUI();

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_close, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick))
            )
        }
    }

    private onBtnClick(){
        if(this.Data == 1 || this.Data == 2 || this.Data == 3 || this.Data == 4 || this.Data == 5){
            let cancelReq = new CancelMatch_req();
            SocketMgr.Ins.SendMessageBin(cancelReq);
        }else{
            let req = new FriendDiscussCancel_req();
            SocketMgr.Ins.SendMessageBin(req);
        }
    }

    protected onInit(): void {
        this.upDateView();
    }

    protected onExit(): void {
        this.disposeHero();
        if(this._timer){
            this._timer.clear(this,this.playAnim);
            this._timer = null;
        }
        if(this._timer1){
            this._timer1.clear(this,this.playText);
            this._timer1 = null;
        }
    }

    private upDateView(){
        this.disposeHero();
        let self = t_Arena.Ins.getCfgByTrophy(MainModel.Ins.mRoleData.trophy);
        let mode:EFightMode = this.Data;
        if (mode == 1 || mode == 2 || mode == 3 || mode == 4 || mode == 5) {
            switch (mode) {
                case EFightMode.PVP:
                case EFightMode.PVP_Round:
                    this._ui.lab1.text = self.f_name;
                    this._ui.lab3.text = "正在寻找对手...";
                    break;
                case EFightMode.PVE:
                    this._ui.lab1.text = "普通";
                    this._ui.lab3.text = "正在寻找队友...";
                    break;
                case EFightMode.HARDPVE:
                    this._ui.lab1.text = "困难";
                    this._ui.lab3.text = "正在寻找队友...";
                    break;
                case EFightMode.NewYear:
                    this._ui.lab1.text = "新春活动";
                    this._ui.lab3.text = "正在寻找队友...";
                    break;
            }
            let cfg:Configs.t_FightStyle_dat = E.tableMgr.getTable(t_FightStyle.NAME).GetDataById(mode);
            this._ui.lab2.text = cfg.f_name;
        } else {
            if (this.Data == 100) {
                this._ui.lab1.text = "对战";
                this._ui.lab2.text = "好友";
                this._ui.lab3.text = "正在等待好友...";
            } else if (this.Data == 101 || this.Data == 102) {
                this._ui.lab1.text = "突围战";
                this._ui.lab2.text = "好友";
                this._ui.lab3.text = "正在等待好友...";
            }
        }

        let val = System_RefreshTimeProxy.Ins.getVal(22);
        let arr = val.split("|");
        this._anim1 = FightFactory.createBigHeroAvatar(parseInt(arr[0]), this._ui.sp,0,10);
        this._anim2 = FightFactory.createBigHeroAvatar(parseInt(arr[1]), this._ui.sp2,20);
        this._anim2.dir = EAvatarDir.Right;

        val = System_RefreshTimeProxy.Ins.getVal(26);
        arr = val.split("|");
        this._timer = new Laya.Timer;
        this._timer.loop(parseInt(arr[0]),this,this.playAnim);
        this.playAnim();

        this._timer1 = new Laya.Timer;
        this._timer1.loop(parseInt(arr[1]),this,this.playText);
        this.playText();
    }

    private playAnim(){
        if (this._anim3) {
            this._anim3.dispose();
            this._anim3 = null;
        }
        let val = System_RefreshTimeProxy.Ins.getVal(23);
        let arr = val.split("|");
        let index = RandomUtil.RandomRoundInt(0, arr.length);
        this._anim3 = FightFactory.createBigHeroAvatar(parseInt(arr[index]), this._ui.sp1,0,10);
    }

    private playText(){
        let arr = t_Tips.Ins.List;
        let index = RandomUtil.RandomRoundInt(0, arr.length) + 1;
        let cfg = t_Tips.Ins.GetDataById(index);
        this._ui.lab.text = cfg.f_tips;
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
        if (this._anim3) {
            this._anim3.dispose();
            this._anim3 = null;
        }
    }
}