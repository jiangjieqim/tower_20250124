import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EPageType, EViewType } from "../../../../common/defines/EnumDefine";
import { TowerMainFightModel } from "../model/TowerMainFightModel";
import { t_Box_Match } from "../proxy/t_Box_Match";
import { BoxItem1 } from "./item/BoxItem1";

export class BoxView3 extends ViewBase{
    private _ui:ui.views.main.ui_baoxiangView3UI;

    public PageType: EPageType = EPageType.None;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_baoxiangView3UI();

            this._ui.list.itemRender = BoxItem1;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onRenderHandler(item:BoxItem1){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        let cfg = t_Box_Match.Ins.getCfgById(this.Data);
        this._ui.icon.skin = t_Box_Match.Ins.getOpenSkinByQua(cfg.f_box_qua);
        let arr = TowerMainFightModel.Ins.boxRewList;
        let array = [];
        for(let i:number=0;i<arr.length;i++){
            let obj:any = {};
            if(arr[i].isConverted == 1){
                obj.cfgId = arr[i].convertedId;
                obj.count = arr[i].convertedNum;
            }else{
                obj.cfgId = arr[i].original.id;
                obj.count = arr[i].original.count;
            }
            if(arr[i].isConverted == 2){
                obj.isNew = true;
            }else{
                obj.isNew = false;
            }
            array.push(obj);
        }
        this._ui.list.array = array;
    }

    protected onExit(): void {
        if(TowerMainFightModel.Ins.boxTempList.length){
            E.ViewMgr.Open(EViewType.BoxView2);
        }else{
            if(TowerMainFightModel.Ins.rewardList.length){
                E.ViewMgr.Open(EViewType.RewardView,null,TowerMainFightModel.Ins.rewardList);
            }
        }
        this.Close();
    }
}