// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E, ScreenAdapter } from "../../../../G";
import { DotManager } from "../../common/DotManager";
import { IconUtils } from "../../main/model/IconUtils";
import { TowerMainFightModel } from "../../towertmain/model/TowerMainFightModel";
import { TowertMainShopModel } from "../../towertmainshop/model/TowertMainShopModel";
import { t_Recharge } from "../../towertmainshop/proxy/t_Recharge";
import { EActivityID } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { JiJinItem } from "./JiJinItem";
import { JiJinModel } from "./JiJinModel";
import { t_Fund_Config } from "./t_Fund_Config";
import { t_Fund_Reward } from "./t_Fund_Reward";

export class JiJinView extends ViewBase{
    private _ui:ui.views.jijin.ui_jijinViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private tabsCtl:TabControl;
    private tabList: any;

    protected onAddLoadRes() {
        this.addAtlas('jijin.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.jijin.ui_jijinViewUI();
            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            )

            this._ui.list.itemRender = JiJinItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            const tabsSkin = [this._ui.tab1, this._ui.tab2,this._ui.tab3];
            let st = E.getLang("jijintab");
            this.tabList = st.split("-");
            this.tabsCtl = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this, this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));
        }
    }

    private onRenderHandler(item:JiJinItem,index:number){
        item.setData(item.dataSource,index);
    }

    private onBtnClick(){
        let cfg = t_Fund_Config.Ins.getCfgByType(this.tabsCtl.selectIndex + 1);
        TowertMainShopModel.Ins.recharge(cfg.f_recharge_id);
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.jijin.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        skin.icon.skin = `remote/jijin/tab${index}.png`;
        if (sel) {
            skin.img.skin = "remote/jijin/btn_s_zsbz1.png";
        } else {
            skin.img.skin = "remote/jijin/btn_n_zsbz.png";
        }
    }

    private onTabSelectHandler(v: number) {
        if(v == -1)return;
        this.updateView();
    }

    protected onInit(): void {
        this.setUI();
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.updateView);
        this.tabsCtl.selectIndex = 0;
    }

    protected onExit(): void {
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.updateView);
    }

    private setUI() {
        let yy = (Laya.stage.height - ScreenAdapter.DefaultHeight);
        if (yy > 0) {
            this._ui.height += yy;
            this._ui.bg.height += yy;
            this._ui.bg1.height += yy;
            this._ui.list.height += yy;
            this._ui.img_bg2.y += yy;
            this._ui.img_bg3.y += yy;
        }
    }

    private updateView(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.JIJIN);
        if(!data)return;

        if(JiJinModel.Ins.isRedTip1()){
            DotManager.addDot(this._ui.tab1);
        }else{
            DotManager.removeDot(this._ui.tab1);
        }
        if(JiJinModel.Ins.isRedTip2()){
            DotManager.addDot(this._ui.tab2);
        }else{
            DotManager.removeDot(this._ui.tab2);
        }
        if(JiJinModel.Ins.isRedTip3()){
            DotManager.addDot(this._ui.tab3);
        }else{
            DotManager.removeDot(this._ui.tab3);
        }


        let type = this.tabsCtl.selectIndex + 1;
        this._ui.img.skin = `remote/jijin/banner_${type}.png`;
        let arr = t_Fund_Reward.Ins.getListByType(type);
        this._ui.list.array = arr;
        for(let i:number=0;i<arr.length;i++){
            let status = data.datalist.find(ele=>ele.id == arr[i].f_id).param1;
            if( status == 1 || status == 11 || status == 13){
                this._ui.list.scrollTo(i);
                break;
            }
        }

        if(JiJinModel.Ins.isChongZhi(type)){
            this._ui.sp.visible = false;
            this._ui.lab1.visible = true;
            this._ui.btn.mouseEnabled = false;
            this._ui.lab.text = "已激活";
        }else{
            this._ui.sp.visible = true;
            let id;
            let num = 0;
            for(let i:number=0;i<arr.length;i++){
                if(TowerMainFightModel.Ins.loginDay >= arr[i].f_required_days){
                    id = parseInt(arr[i].f_pay_reward.split("-")[0]);
                    num += parseInt(arr[i].f_pay_reward.split("-")[1]);
                }
            }
            this._ui.icon.skin = IconUtils.getIconByCfgId(id);
            this._ui.lab2.text = num + "";
            this._ui.lab1.visible = false;
            this._ui.btn.mouseEnabled = true;
            let cfg = t_Fund_Config.Ins.getCfgByType(type);
            let pCfg = t_Recharge.Ins.getCfgById(cfg.f_recharge_id);
            this._ui.lab.text = StringUtil.moneyCv(pCfg.f_price) + "元";
        }
    }
}