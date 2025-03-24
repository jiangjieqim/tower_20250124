import { ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { FriendZan_req, WatchCommonRankDetail_revc } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { ISimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { ChengHaoModel } from "../../chenghao/model/ChengHaoModel";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";
import { HeadCtl } from "../../common/HeadCtl";
import { FriendModel } from "../../friend/model/FriendModel";
import { FunctionModel } from "../../funs/FunctionModel";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { EFuncDef } from "../../main/model/EFuncDef";
import { MainModel } from "../../main/model/MainModel";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { t_Medal } from "../../towertmain/proxy/t_Medal";
import { AdmirsCtl } from "./AdmirsCtl";
import { PlayerInfoFactory } from "./PlayerInfoFactory";

/**玩家信息 */
export class PlayerInfoView extends ViewBase{
    protected autoFree:boolean = true;
    protected mMask:boolean = true;
    private _titleCtl: ChengHaoCtl;
    private _ui:ui.views.rank.ui_player_infoUI;
    private _mainTabCtl: ITabControl;
    private _childTabCtl:ITabControl;
    private _data:WatchCommonRankDetail_revc;
    private headBtnCtl:ButtonCtl;
    private headCtl:HeadCtl;
    private nameBtnCtl:ButtonCtl;
    private btn2Ctl:ButtonCtl;
    private friend_btn:ButtonCtl;
    private chat_btn:ButtonCtl;
    private praise_btn:ButtonCtl;;
    private panelCtl0:ScrollPanelControl;
    private panelTabCtl:ScrollPanelControl;
    private admirsCtl:AdmirsCtl;
    /**勋章 */
    private _hzEff:ISimpleEffect;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas('roleinfo.atlas');
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        TowerMainModel.Ins.off(TowerMainEvent.NickNameChange, this, this.onNickNameChange);
        TowerMainModel.Ins.off(TowerMainEvent.HeadUpdate, this, this.onHeadUpdate);
        if (this._mainTabCtl) {
            this._mainTabCtl.selectIndex = -1;
            this._mainTabCtl.dispose();
            this._mainTabCtl = null;
        }
        this._childTabCtl.selectIndex = -1;
        this._childTabCtl.dispose();

        if(this.nameBtnCtl){
            this.nameBtnCtl.dispose();
            this.nameBtnCtl = null;
        }
        if(this.headBtnCtl){
            this.headBtnCtl.dispose();
            this.headBtnCtl = null;
        }
        if(this.btn2Ctl){
            this.btn2Ctl.dispose();
            this.btn2Ctl = null;
        }
        if(this.friend_btn){
            this.friend_btn.dispose();
            this.friend_btn = null;
        }
        if(this.chat_btn){
            this.chat_btn.dispose();
            this.chat_btn = null;
        }
        if(this.praise_btn){
            this.praise_btn.dispose();
            this.praise_btn = null;
        }
        if(this.panelCtl0){
            this.panelCtl0.clear();
            this.panelCtl0 = null;
        }
        if(this.panelTabCtl){
            this.panelTabCtl.clear();
            this.panelTabCtl = null;
        }
        if(this._hzEff){
            this._hzEff.dispose();
            this._hzEff = null;
        }
        if(this.admirsCtl){
            this.admirsCtl.dispose();
            this.admirsCtl = null;
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.rank.ui_player_infoUI();
            this.bindClose(this._ui.btn_close);

            this._mainTabCtl = TabControl.createTabCtl([this._ui.tb0, this._ui.tb1],
                [
                    { color: "#FFF2B5", strokeColor: "#BD6600", skin: "remote/roleinfo/btn_s.png" },
                    { color: "#FFEDDF", strokeColor: "#987D5E", skin: "remote/roleinfo/btn_n.png" },
                ],
                new Laya.Handler(this, this.onMainSelectHandler), E.getLang("playertabs")
            );

            this._childTabCtl = TabControl.createTabCtl([this._ui.t0, this._ui.t1, this._ui.t2, this._ui.t3],
                [
                    { color: "#ffffff", strokeColor: "#B1523C", skin: "remote/roleinfo/btn_s_grxx.png" },
                    { color: "#FCE9E6", strokeColor: "#794741", skin: "remote/roleinfo/btn_n_grxx.png" },
                ],
                new Laya.Handler(this, this.onChildSelectHandler), E.getLang("infotabs")
            );
            //===========================================================
            this.headBtnCtl = ButtonCtl.CreateBtn(this._ui.btn,this,this.onHeadBtnClick);
            this.headCtl = new HeadCtl(this._ui.view);
            this.nameBtnCtl = ButtonCtl.CreateBtn(this._ui.name_btn,this,this.onNameClick);
            this.btn2Ctl = ButtonCtl.CreateBtn(this._ui.btn2,this,this.onBtn2Click);
            this.friend_btn = ButtonCtl.CreateBtn(this._ui.friend_btn,this,this.onAddFriend);
            this.chat_btn = ButtonCtl.CreateBtn(this._ui.chat_btn,this,this.onChatHandler);
            this.praise_btn = ButtonCtl.CreateBtn(this._ui.praiseImg,this,this.onZhanBtnClick);
            this.panelCtl0 = new ScrollPanelControl();
            this.panelCtl0.init(this._ui.panel0);

            this.panelTabCtl = new ScrollPanelControl();
            this.panelTabCtl.init(this._ui.panel1);

            this.admirsCtl = new AdmirsCtl(this._ui);
            this._titleCtl = new ChengHaoCtl(this._ui.view_ch);
            
        }
    }

    /**点赞 */
    private onZhanBtnClick(){
        if(this.isSelf){
            return;
        }
        let req = new FriendZan_req();
        req.playerId = this.playerId;
        SocketMgr.Ins.SendMessageBin(req);
     }
    /**私聊 */
    private onChatHandler(){
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.SiLiao)){
            FriendModel.Ins.sendSL(this._data.playerData.AccountId);
            this.Close();
        }
    }

    private get playerId(){
        if(this._data){
            return this._data.playerData.AccountId;
        }
        return 0;
    }

    private onAddFriend(){
        FriendModel.Ins.sendCmdManage(this.playerId,3);
    }
    private onBtn2Click(){
        E.sdk.setCopy(this._ui.lab4.text);
        E.ViewMgr.ShowMidOk(E.getLang("copysucceed"));
    }
    private onNameClick(){
        E.ViewMgr.Open(EViewType.RoleInfoView1);
    }
    /**头像框 */
    private onHeadBtnClick(){
        E.ViewMgr.Open(EViewType.RoleInfoView2);
    }
    private onMainSelectHandler(index: number) {
        let arr =[this._ui.con0,this._ui.con1];
        for(let i = 0;i < arr.length;i++){
            let con = arr[i];
            if(i == index){
                con.visible = true;
            }else{
                con.visible = false;
            }
        }

        switch(index){
            case 0:
                // 生涯统计
                this.panelCtl0.clear();
                PlayerInfoFactory.careerUpdate(this.panelCtl0,this._data);                
                this.panelCtl0.end();
                break;
            case 1:
                this._childTabCtl.selectIndex = 0;
                break;
        }
    }

    private onChildSelectHandler(index:number){
        this.panelTabCtl.clear();
        PlayerInfoFactory.renderList(this.panelTabCtl,this._ui.countLb,this._ui.tips1,this._ui.tipsLb,
                                index,this._data);
        this.panelTabCtl.end();
    }
    /**是否是自己 */
    private get isSelf(){
        return this._data && (this._data.playerData.AccountId == MainModel.Ins.mRoleData.AccountId);
    }

    /**昵称变化 */
    private onNickNameChange(nickName:string){
        this._data.playerData.NickName = nickName;
        this.updateNickName();
    }
    private updateNickName(){
        this._ui.lab1.text = this._data.playerData.NickName;
    }
    private onHeadUpdate(){
        this.headCtl.setData(MainModel.Ins.convertHead(this._data.playerData.HeadUrl), this._data.playerData.HeadFrame);
    }
    protected onInit(): void {
        this._data = this.Data;
        if(this._data){
            this._ui.army_lb.text = E.getLang("army")+":"+E.getLang("none");

            let cfgTr = t_Medal.Ins.getCfgByTr(this._data.playerData.trophy);
            let _scale:number = parseInt(System_RefreshTimeProxy.Ins.getVal(118))/10000 ;
            this._hzEff = SpineEffectMgr.createMedalEffect(this._ui.eff,cfgTr,_scale);//勋章特效
            this.admirsCtl.refresh(this._data);

            this.updateNickName();
            this._ui.lab4.text = this._data.playerData.AccountId + "";
            this._ui.lab.text = this._data.playerData.trophy + "";
            this._ui.lab_lv.text = this._data.playerData.level + "";
            let _titleId: number;
            if (this.isSelf) {
                this._ui.view_ch.on(Laya.Event.CLICK,this,this.onBtnCHClick);
                TowerMainModel.Ins.on(TowerMainEvent.NickNameChange, this, this.onNickNameChange);
                TowerMainModel.Ins.on(TowerMainEvent.HeadUpdate, this, this.onHeadUpdate);
                _titleId = ChengHaoModel.Ins.titleId;
                this.headBtnCtl.visible = true;
                this.nameBtnCtl.visible = true;
                this.btn2Ctl.visible = true;
                this.friend_btn.visible = false;
                this.chat_btn.visible = false;
            }else{
                _titleId = this._data.titleId;
                this.headBtnCtl.visible = false;
                this.nameBtnCtl.visible = false;
                this.btn2Ctl.visible = false;
                if(this._data.isFriend){
                    this.friend_btn.visible = false;
                }else{
                    this.friend_btn.visible = true;
                }
                this.chat_btn.visible = true;
            }
            this._titleCtl.setData(_titleId);
            this.onHeadUpdate();
        }
        this._ui.lab4.x =  this._ui.lab2.x + this._ui.lab2.textField.textWidth;
        // throw new Error("Method not implemented.");
        this._mainTabCtl.selectIndex = 0;
        this._childTabCtl.selectIndex = 0;
    }

    private onBtnCHClick(){
        E.ViewMgr.Open(EViewType.ChengHaoView);
    }
}