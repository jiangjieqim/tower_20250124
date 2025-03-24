import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType, EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { ActivityTime } from "../../common/ActivityTime";
import { DotManager } from "../../common/DotManager";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { MainModel } from "../../main/model/MainModel";
import { ItemVo } from "../../main/vos/ItemVo";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { GooseConfig } from "../model/GooseConfig";
import { TaodaeEvent } from "../model/TaodaeEvent";
import { TaoDaeModel } from "../model/TaoDaeModel";
import { t_Cover_Big_Goose_config } from "../model/t_Cover_Big_Goose_config";
import { TaoDaeItem } from "./TaoDaeItem";
/**套大鹅 */
export class TaoDaeView extends ViewBase{
    PageType:EPageType = EPageType.None;
    protected autoFree:boolean = true;
    private _ui:ui.views.taodae.ui_taodaeViewUI;
    private _timeCtl:ActivityTime;
    private btn_tip:ButtonCtl;
    private selImgCtl:ButtonCtl;
    private _hero:HeroAvatarView;
    private oneBtn:ButtonCtl;
    private tenBtn:ButtonCtl;
    private ckCtl:CheckBoxCtl;
    private itemList:TaoDaeItem[] = [];
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.model.off(TaodaeEvent.UpdateBigPrize,this,this.updateHero);
        TowerMainModel.Ins.off(TowerMainEvent.ValChange,this,this.updateItem);

        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
        if(this.btn_tip){
            this.btn_tip.dispose();
            this.btn_tip = null;
        }
        if(this.selImgCtl){
            this.selImgCtl.dispose();
            this.selImgCtl = null;
        }
        if(this.oneBtn){
            this.oneBtn.dispose();
            this.oneBtn = null;
        }
        if(this.tenBtn){
            this.tenBtn.dispose();
            this.tenBtn = null;
        }
        if(this.ckCtl){
            this.ckCtl.dispose();
            this.ckCtl = null;
        }
        this.disposeHero();
    }

    private disposeHero(){
        if(this._hero){
            this._hero.dispose();
            this._hero = null;
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.taodae.ui_taodaeViewUI();
            this._timeCtl = new ActivityTime(this._ui.lab);
            this.btn_tip = ButtonCtl.CreateBtn(this._ui.btn_tip,this,this.onBtnTipClick);
            this.selImgCtl = ButtonCtl.CreateBtn(this._ui.selImg,this,this.onImgClick);
            this.oneBtn = ButtonCtl.CreateBtn(this._ui.btn,this,this.onOneClick);
            this.tenBtn = ButtonCtl.CreateBtn(this._ui.btn1,this,this.onTenClick);
            for(let i = 0;i < 19;i++){
                let cell:TaoDaeItem = this._ui[`view${i+1}`];
                if(cell){
                    this.itemList.push(cell);
                }
            }
            this.ckCtl = new CheckBoxCtl({bg:this._ui.bg1,gou:this._ui.gou1} as ICheckBoxSkin);
            this.ckCtl.selected = GooseConfig.mSkipAnim;
            this.ckCtl.selectHander = new Laya.Handler(this,this.onAdCkSelect);
        }
    }

    private onAdCkSelect(sel:boolean){
        GooseConfig.mSkipAnim = sel;
    }

    private onOneClick(){
        this.model.useAction(1);
    }

    private get activityId(){
        return this.model.activityId;
    }

    private onTenClick(){
        this.model.useAction(10);
    }

    private onImgClick(){
        E.ViewMgr.Open(EViewType.TaoDaeSelReward);
    }

    private onBtnTipClick(){
        E.ViewMgr.openTipView("taodae_rule","taodae_desc");
    }

    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this._timeCtl.refresh(this.activityId);
        this.model.on(TaodaeEvent.UpdateBigPrize,this,this.updateHero);
        TowerMainModel.Ins.on(TowerMainEvent.ValChange,this,this.updateItem);
        this.updateHero();
        this.updateItem();
        this.updateGoose();
    }

    private updateGoose(){
        let l:Configs.t_Cover_Big_Goose_config_dat[] = E.tableMgr.getTable(t_Cover_Big_Goose_config.NAME).List;
        for(let i = 0;i < l.length;i++){
            let cfg = l[i];
            let cell:TaoDaeItem = this._ui[`view${i+1}`];
            if(cell){
                cell.dataSource = cfg;
                cell.refresh();
            }
        }
    }

    private updateHero(){
        let bigPrize:number = this.model.bigPrize;
        if(bigPrize){

            this.disposeHero();
            this._hero = this.model.createHero(this.model.bigPrize,this._ui.sp_a);

            this._ui.img.visible = false;
        }else{
            this._ui.img.visible = true;
        }
        this.updateRed();
    }

    private updateRed(){
        if(this.model.hasSelBigPrize){
            DotManager.removeDot(this._ui.selImg);
        }else{
            DotManager.addDot(this._ui.selImg);
        }
    }

    private setlb(lb:Laya.Label,icon:Laya.Image,vo:ItemVo){
        icon.skin = vo.getIcon();
        let itemId = vo.cfgId;
        let needCount = vo.count;
        lb.text =  MainModel.Ins.mRoleData.getVal(itemId) + "/" + needCount + "";
        let have = MainModel.Ins.mRoleData.getVal(itemId);
        if(have >= needCount){
            lb.color = "#ffffff";
        }else{
            lb.color = "#ff0000";
        }
    }
    private updateItem(){
        let vo = this.model.oneNeedItem;
        this.setlb(this._ui.labb,this._ui.icon,vo);

        let vo10 = this.model.tenNeedItem;
        this.setlb(this._ui.labb1,this._ui.icon1,vo10);
    }

    private get model(){
        return TaoDaeModel.Ins;
    }
}