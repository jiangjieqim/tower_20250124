// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { FriendsFightReward_req, RoomMode_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { DotManager } from "../../common/DotManager";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { FunctionModel } from "../../funs/FunctionModel";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { TowertMainCardModel } from "../../towertmaincard/model/TowertMainCardModel";
import { TowerMainFightModel } from "../model/TowerMainFightModel";

export class FriendFightView extends ViewBase{
    private _ui:ui.views.main.ui_friendViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _se:SimpleEffect;
    private _se1:SimpleEffect;

    private _anim1:HeroAvatarView;
    // private _anim2:HeroAvatarView;
    // private _anim3:HeroAvatarView;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_friendViewUI();
            this.bindClose(this._ui.btn_close);

            for(let i:number=1;i<4;i++){
                this._ui["img" + i].on(Laya.Event.CLICK,this,this.onClick,[i]);
            }
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2, new Laya.Handler(this, this.onBtn2Click))
            )
        }
    }

    private onBtnClick(){
        if (this._ui.input.text == "") {
            E.ViewMgr.ShowMidError("输入房间号");
            return;
        }
        let req = new RoomMode_req;
        req.roomSn = this._ui.input.text;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onClick(index:number){
        let val = System_RefreshTimeProxy.Ins.getVal(21);
        let arr = val.split("|");
        let vo = TowerMainFightModel.Ins.friendRewardList.find(ele=>ele.flag == index);
        if(vo && vo.times == 1){
            let req = new FriendsFightReward_req;
            req.pos = index;
            SocketMgr.Ins.SendMessageBin(req);
        }else{
            let view = this._ui["img" + index];
            FunctionModel.Ins.showRewardTip(arr[index-1],view,-view.width*0.5,-view.height);
        }
    }

    private onBtn1Click(){
        if(TowertMainCardModel.Ins.isCardEnough()){
            TowerMainFightModel.Ins.sendRoom(1,1);
        }else{
            TowertMainCardModel.Ins.showCardBox(2);
        }
    }

    private onBtn2Click(){
        if(TowerMainFightModel.Ins.isTiLiEnough()){
            TowerMainFightModel.Ins.sendRoom(1,2);
        }
    }

    protected onInit(): void {
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_FRIEND_REWARD,this,this.updateReward);
        this._se = new SimpleEffect(this._ui.sp_f, `o/spine/succeed/ButtonLighting_1/ButtonLighting_1`,this._ui.sp_f.width*0.5,this._ui.sp_f.height*0.5);
        this._se.play(0,true);
        this._se1 = new SimpleEffect(this._ui.sp_r, `o/spine/succeed/ButtonLighting_2/ButtonLighting_2`,this._ui.sp_r.width*0.5,this._ui.sp_r.height*0.5);
        this._se1.play(0,true);
        this.updateView();
        this.updateReward();
    }

    protected onExit(): void {
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_FRIEND_REWARD,this,this.updateReward);
        this.disposeHero();
        if(this._se){
            this._se.dispose();
            this._se = null;
        }
        if(this._se1){
            this._se1.dispose();
            this._se1 = null;
        }
    }

    private updateView(){
        this.disposeHero();
        let val = System_RefreshTimeProxy.Ins.getVal(24);
        let arr = val.split("|");
        // this._anim1 = FightFactory.createBigHeroAvatar(parseInt(arr[0]), this._ui.sp,0,10);
        // this._anim2 = FightFactory.createBigHeroAvatar(parseInt(arr[1]), this._ui.sp1,0,20);
        // this._anim2.dir = EAvatarDir.Right;
        // this._anim3 = FightFactory.createBigHeroAvatar(parseInt(arr[2]), this._ui.sp2,10,20);
    }

    private updateReward(){
        let num = 0;
        for(let i:number=1;i<4;i++){
            let vo = TowerMainFightModel.Ins.friendRewardList.find(ele=>ele.flag == i);
            if(vo){
                if(vo.times > 0){
                    num = i;
                }
                DotManager.removeDot(this._ui["img" + i]);
                if(vo.times == 0){
                    this._ui["img" + i].skin = "remote/base/box_n.png";
                }else if(vo.times == 1){
                    this._ui["img" + i].skin = "remote/base/box_n.png";
                    DotManager.addDot(this._ui["img" + i],15,-15);
                }else{
                    this._ui["img" + i].skin = "remote/base/box_s.png";
                }
            }
        }
        this._ui.pro.width = num / 3 * 516;
    }

    private disposeHero() {
        if (this._anim1) {
            this._anim1.dispose();
            this._anim1 = null;
        }
        // if (this._anim2) {
        //     this._anim2.dispose();
        //     this._anim2 = null;
        // }
        // if (this._anim3) {
        //     this._anim3.dispose();
        //     this._anim3 = null;
        // }
    }
}