import { PlatformConfig } from "../../../../../InitConfig";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { RoomMode_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { ComposeModel } from "../../compose/ComposeModel";
import { RoleInfoModel } from "../../roleinfo/model/RoleInfoModel";
import { TowerMainFightModel } from "../model/TowerMainFightModel";
import { t_First_Pass_Reward_Coop } from "../proxy/t_First_Pass_Reward_Coop";
import { t_Invite_Reward_Daily } from "../proxy/t_Invite_Reward_Daily";
import { TWZItem } from "./TWZItem";
import { TWZItem1 } from "./TWZItem1";

export class TWZView extends ViewBase{
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _ui:ui.views.main.ui_tuweiViewUI;

    protected onAddLoadRes(): void { 
        this.addAtlas('tuweizhan.atlas');
    }

    protected onFirstInit(): void { 
        if(!this.UI){
            this.UI = this._ui = new ui.views.main.ui_tuweiViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.tab1, new Laya.Handler(this, this.onTabClick1),false),
                ButtonCtl.Create(this._ui.tab2, new Laya.Handler(this, this.onTabClick2),false),
                ButtonCtl.Create(this._ui.tab3, new Laya.Handler(this, this.onTabClick3),false),
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2, new Laya.Handler(this, this.onBtn2Click)),
                ButtonCtl.Create(this._ui.btn_add, new Laya.Handler(this, this.onBtnAddClick))
            )

            this._ui.list.itemRender = TWZItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list1.itemRender = TWZItem1;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
        }
    }

    private onTabClick1(){
        this.selTab(1);
    }

    private onTabClick2(){
        if(RoleInfoModel.Ins.pveModeExist >= 1){
            this.selTab(2);
        }else{
            E.ViewMgr.ShowMidError(E.getLang("tuwei1"));
        }
    }

    private onRenderHandler(item:TWZItem){
        item.setData(item.dataSource);
    }

    private onRenderHandler1(item:TWZItem1,index:number){
        item.setData(item.dataSource,index,this._selInex);
    }

    private onTabClick3(){
        E.ViewMgr.ShowMidError(E.getLang("NotYetOpen"));
    }

    private onBtnClick(){
        if(TowerMainFightModel.Ins.isTiLiEnough()){
            if(initConfig.platform == PlatformConfig.WeiXin){
                TowerMainFightModel.Ins.isInvite = true;
            }
            if(this._selInex == 1){
                TowerMainFightModel.Ins.sendRoom(1,2);
            }else if(this._selInex == 2){
                TowerMainFightModel.Ins.sendRoom(1,3);
            }
        }
    }

    private onBtn1Click(){
        if(TowerMainFightModel.Ins.isTiLiEnough()){
            if(this._selInex == 1){
                TowerMainFightModel.Ins.sendRoom(1,2);
            }else if(this._selInex == 2){
                TowerMainFightModel.Ins.sendRoom(1,3);
            }
        }
    }

    
    private onBtn2Click(){
        if(this._selInex == 1){
            ComposeModel.Ins.startMatchPve();
        }else if(this._selInex == 2){
            ComposeModel.Ins.startMatchHardPve();
        }
    }

    private onBtnAddClick(){
        if (this._ui.input.text == "") {
            E.ViewMgr.ShowMidError("输入房间号");
            return;
        }
        let req = new RoomMode_req;
        req.roomSn = this._ui.input.text;
        SocketMgr.Ins.SendMessageBin(req);
    }

    protected onInit(): void {
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_INVITE,this,this.updateView);
        this._selInex = 0;
        if(RoleInfoModel.Ins.pveModeExist >= 1){
            this.selTab(2);
        }else{
            this.selTab(1);
        }
    }

    protected onExit(): void {
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_INVITE,this,this.updateView);
    }

    private _selInex:number;
    private selTab(index){
        if(this._selInex == index)return;
        this._selInex = index;
        this.updateView();
        if(index == 1){
            this._ui.tab1.skin = "remote/tuweizhan/btn_s_twz.png";
            this._ui.lab11.color = "#ffffff";
            this._ui.lab11.strokeColor = "#b1523c";

            this._ui.tab2.skin = "remote/tuweizhan/btn_n_twz.png";
            this._ui.lab22.color = "#dfcbc8";
            this._ui.lab22.strokeColor = "#794741";
        }else{
            this._ui.tab1.skin = "remote/tuweizhan/btn_n_twz.png";
            this._ui.lab11.color = "#dfcbc8";
            this._ui.lab11.strokeColor = "#794741";

            this._ui.tab2.skin = "remote/tuweizhan/btn_s_twz.png";
            this._ui.lab22.color = "#ffffff";
            this._ui.lab22.strokeColor = "#b1523c";
        }
    }

    private updateView(){
        this.setUI();
        this._ui.lab2.text = RoleInfoModel.Ins.getMaxPveNum(this._selInex) + "";
        this._ui.list1.array = t_First_Pass_Reward_Coop.Ins.getListById(this._selInex);
        if(RoleInfoModel.Ins.pveModeExist >= 1){
            this._ui.s22.visible = false;
        }else{
            this._ui.s22.visible = true;
        }
    }

    private setUI(){
        if(TowerMainFightModel.Ins.canInvite){
            this._ui.height = 1072;
            this._ui.bg.height = 1050;
            this._ui.img_bg.visible = true;
            this._ui.sp.y = 515;
            this._ui.sp1.y = 854;
            this._ui.list.array = t_Invite_Reward_Daily.Ins.List;
        }else{
            this._ui.height = 784;
            this._ui.bg.height = 752;
            this._ui.img_bg.visible = false;
            this._ui.sp.y = 414;
            this._ui.sp1.y = 199;
            this._ui.list.array = [];
        }
    }
}