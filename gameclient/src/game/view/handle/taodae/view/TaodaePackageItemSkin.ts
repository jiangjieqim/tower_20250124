import { ItemSkinNode } from "../../../../../frame/view/ScrollPanelControl";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { ActivityModel } from "../../activity/ActivityModel";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { TowertMainShopModel } from "../../towertmainshop/model/TowertMainShopModel";
import { t_Recharge } from "../../towertmainshop/proxy/t_Recharge";
import { TaoDaeModel } from "../model/TaoDaeModel";
export class TaodaePackageItemNode extends ItemSkinNode{
    get cls(){
        return TaodaePackageItemSkin;
    }
}
/**礼包item */
class TaodaePackageItemSkin extends ui.views.taodae.ui_taodae_package_itemUI{
    static NAME:string = "TaodaePackageItemSkin";
    private _cfg:Configs.t_Cover_Big_Goose_Pack_dat;
    private btnCtl:ButtonCtl;
    private get activityId(){
        return TaoDaeModel.Ins.activityId;
    }
    constructor(){
        super();
        this.btnCtl = ButtonCtl.CreateBtn(this.btn,this,this.onClickHandler);
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }
    private onDisplay(){
        // ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.updateView);
    }
    private onUnDisplay(){
        // ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.updateView);
    }
    private updateView(){
        this.refresh();
    }
    private onClickHandler() {
        if (this._cfg.f_recharge_id) {
            TowertMainShopModel.Ins.recharge(this._cfg.f_recharge_id);
        } else {
            ActivityModel.Ins.sendCmd(this.activityId, this._cfg.f_id);
        }
    }
    refresh(){
        DotManager.removeDot(this.btn);
        let cfg:Configs.t_Cover_Big_Goose_Pack_dat = this.dataSource;
        this._cfg = cfg;
        ItemViewFactory.renderItemSlots(this.rewardcon,cfg.f_reward,undefined,undefined,undefined,"left");
        this.nameLb.text = cfg.f_pack_name;
        let data = ActivityModel.Ins.getActivityData(this.activityId);

        let cnt:number = 0;//已经购买的次数
        if(data){
            let vo = data.datalist.find(o=>o.id == cfg.f_id);
            if(vo){
                cnt = vo.param1;
            }
        }

        this.lb0.text = E.getLang("activityLimit") + cnt + "/" + cfg.f_limited_amount;
        if (cnt < cfg.f_limited_amount) {
            this.btnCtl.grayMouseDisable = false;
            if (cfg.f_recharge_id) {
                let rcfg = t_Recharge.Ins.getCfgById(cfg.f_recharge_id);
                this.moneyLb.text = StringUtil.moneyCv(rcfg.f_price) + E.getLang("Yuan");
            } else {
                DotManager.addDot(this.btn);
                this.moneyLb.text = E.getLang("free");
            }
        } else {
            this.btnCtl.grayMouseDisable = true;
            this.moneyLb.text = E.getLang("isBuyed");
        }
    }
}