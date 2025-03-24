// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { stActivity } from "../../../../network/protocols/BaseProto";
import { EAvatarDir } from "../../avatar/AvatarView";
import { DotManager } from "../../common/DotManager";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { SignItem } from "./SignItem";
import { t_Sevenday_Reward } from "./t_Sevenday_Reward";

export class SignView extends ViewBase{
    private _ui:ui.views.sign.ui_signViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    private _heroAnim:HeroAvatarView;
    private _heroAnim1:HeroAvatarView;

    private _ctl:ItemSlotCtl;
    private _ctl1:ItemSlotCtl;
    private _ctl2:ItemSlotCtl;

    protected onAddLoadRes() {
        
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.sign.ui_signViewUI();
            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            )

            this._ui.list.itemRender = SignItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this._ctl = new ItemSlotCtl(this._ui.view1);
            this._ctl1 = new ItemSlotCtl(this._ui.view2);
            this._ctl2 = new ItemSlotCtl(this._ui.view3);
        }
    }

    private onBtnClick(){
        if(!this._cfg)return;
        ActivityModel.Ins.sendCmd(EActivityID.Sign,this._cfg.f_id);
    }

    private onRenderHandler(item:SignItem){
        item.setData(item.dataSource);
    }

    private _cfg: Configs.t_Sevenday_Reward_dat;
    protected onInit(): void {
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA, this, this.updateView);
        this.updateView();
    }

    protected onExit(): void {
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA, this, this.updateView);
        this.disposeHero();
    }

    private disposeHero() {
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
        if (this._heroAnim1) {
            this._heroAnim1.dispose();
            this._heroAnim1 = null;
        }
    }

    private updateView(){
        let data:stActivity = ActivityModel.Ins.getActivityData(EActivityID.Sign);
        if(!data)return;
        this.disposeHero();

        this._heroAnim = FightFactory.createByImageId(25,this._ui.sp_1,0,0,1.7);
        this._heroAnim.dir = EAvatarDir.Right;
        this._heroAnim1 = FightFactory.createByImageId(2501,this._ui.sp_2,0,0,1.7);

        let array = [];
        let arr = t_Sevenday_Reward.Ins.List;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_days != 7){
                array.push(arr[i]);
            }else{
                this._cfg = arr[i];
            }
        }
        this._ui.list.array = array;

        DotManager.removeDot(this._ui.btn);
        this._ui.m1.visible = this._ui.m2.visible = this._ui.m3.visible = false;
        this._ui.img.visible = this._ui.img1.visible = this._ui.btn.visible = false;
        let arrr = ItemViewFactory.convertItemList(this._cfg.f_reward);
        this._ctl.setData(arrr[0]);
        this._ctl1.setData(arrr[1]);
        this._ctl2.setData(arrr[2]);
        let status = data.datalist.find(ele=>ele.id == this._cfg.f_id).param1;
        if(status == EActivityStatus.unclaimable){
            this._ui.img1.visible = true;
        }else if(status == EActivityStatus.Claimable){
            this._ui.btn.visible = true;
            DotManager.addDot(this._ui.btn);
        }else{
            this._ui.img.visible = true;
            this._ui.m1.visible = this._ui.m2.visible = this._ui.m3.visible = true;
        }
    }
}