// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { SoltItemView } from "../../main/views/icon/SoltItemView";
import { PlayerVoFactory } from "../../main/vos/PlayerVoFactory";
import { TowertMainShopModel } from "../../towertmainshop/model/TowertMainShopModel";
import { t_Recharge } from "../../towertmainshop/proxy/t_Recharge";
import { ZhanLinModel } from "./ZhanLinModel";
import { t_Battle_Pass } from "./t_Battle_Pass";
import { t_Competition_Season } from "./t_Competition_Season";

export class ZhanLinView1 extends ViewBase{
    private _ui:ui.views.zhanlin.ui_zhanlinView1UI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes() {
        this.addAtlas('zhanlin.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.zhanlin.ui_zhanlinView1UI();
            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            )

            this._ui.list.itemRender = SoltItemView;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list1.itemRender = SoltItemView;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onBtnClick(){
        let cfg = t_Competition_Season.Ins.getCfgBySeason(MainModel.Ins.season);
        TowertMainShopModel.Ins.recharge(cfg.f_recharge_id);
        this.Close();
    }

    private onRenderHandler(item:SoltItemView){
        let vo = ItemViewFactory.convertItem(item.dataSource);
        item.setData(vo);
    }

    protected onInit(): void {
        let arr1 = [];
        let arr2 = [];
        let arr = t_Battle_Pass.Ins.getListBySeason(MainModel.Ins.season);
        let cfg = t_Competition_Season.Ins.getCfgBySeason(MainModel.Ins.season);
        let lv = parseInt(cfg.f_unlock_reward.split("-")[1]) / 1000;
        for(let i:number=0;i<arr.length;i++){
            if(ZhanLinModel.Ins.lv + lv >= arr[i].f_level){
                arr1.push(arr[i].f_advanced_reward);
            }
            if( arr[i].f_level > ZhanLinModel.Ins.lv && arr[i].f_level <= ZhanLinModel.Ins.lv + lv){
                arr1.push(arr[i].f_ordinary_reward);
            }

            arr2.push(arr[i].f_advanced_reward);
            if( arr[i].f_level > ZhanLinModel.Ins.lv){
                arr2.push(arr[i].f_ordinary_reward);
            }
        }
        arr1 = PlayerVoFactory.mergeAttr(arr1,"-");
        arr2 = PlayerVoFactory.mergeAttr(arr2,"-");
        this._ui.list.array = arr1;
        this._ui.list1.array = arr2;

        let pCfg = t_Recharge.Ins.getCfgById(cfg.f_recharge_id);
        this._ui.lab.text = StringUtil.moneyCv(pCfg.f_price) + "元";
    }

    protected onExit(): void {
        
    }
}