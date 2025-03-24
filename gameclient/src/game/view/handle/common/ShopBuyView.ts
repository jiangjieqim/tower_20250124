// import { ButtonCtl } from "../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { ItemViewFactory } from "../main/model/ItemViewFactory";
import { ItemProxy } from "../main/proxy/ItemProxy";
import { ItemSlotCtl } from "../main/views/icon/SoltItemView";
import { IShopBuyStyle, ShopHSiderCtl } from "../main/views/new2/ShopHSiderCtl";
import { ItemVo } from "../main/vos/ItemVo";

export enum EBuyType{
    Item = 0//默认
}

export interface IShopBuyItem{
    type:EBuyType;
    needItemId:number;
    needCount:number;
    /**目标物 */
    targetId:number;
    targetCount:number;
    ok:Laya.Handler;
    buyEndNotClose:boolean;
    param;
    /**最大数量检测 */
    maxCheckHandler:Laya.Handler;
}
/**购买界面 */
export class ShopBuyView extends ViewBase {
    private shopBuyStyle:IShopBuyStyle;
    private _data:IShopBuyItem;
    private bg1Width:number;
    private _ui:ui.views.common.ui_shopBuyViewUI;
    private _ctl:ItemSlotCtl;

    protected onAddLoadRes(): void { }
    protected onExit(): void {
        if(this.shopBuyStyle){
            this.shopBuyStyle.destroy();
            this.shopBuyStyle = null;
        }
    }
    protected mMask:boolean = true;
    get selCount(){
        return this.shopBuyStyle ? this.shopBuyStyle.selCount : 1;
    }
    protected onFirstInit(): void { 
        if(!this.UI){
            this.UI = this._ui = new ui.views.common.ui_shopBuyViewUI();
            this.bg1Width = this._ui.siderstyle.bg1.width;
            this.bindClose(this._ui.closeBtn1);
            ButtonCtl.Create(this._ui.cancelBtn,new Laya.Handler(this,this.onCancelHandler));
            ButtonCtl.Create(this._ui.okBtn,new Laya.Handler(this,this.onOkHandler));
            this._ctl = new ItemSlotCtl(this._ui.item);
        }
    }

    /**确认购买 */
    private onOkHandler(){
        this._data.ok.runWith([this._data,this.selCount]);
        if(!this._data.buyEndNotClose){
            this.Close();
        }
    }

    private onCancelHandler(){
        this.Close();
    }

    private clearUI(){
        this._ui.item.tf1.text = "";
        this._ui.item.quality.skin = "";
        this._ui.item.icon.skin = "";
        this._ui.nameTF.text = "";
    }

    /**刷新物品 */
    private refreshItem(_vo:IShopBuyItem){
        let targetCfg = ItemProxy.Ins.getCfg(_vo.targetId);
        this._ui.nameTF.text = targetCfg.f_name;
        let _itemVo = new ItemVo();
        _itemVo.cfgId = _vo.targetId;
        _itemVo.count = _vo.targetCount;
        this._ctl.setData(_itemVo);
        return _itemVo;
    }

    protected onInit(): void {
        this.clearUI();
        this._data = this.Data;
        let _vo:IShopBuyItem = this.Data;
        this.shopBuyStyle = new ShopHSiderCtl(this.bg1Width);
        this.shopBuyStyle.maxCheckHandler = this._data.maxCheckHandler;
        let t1 = ItemViewFactory.convertItem(`${_vo.needItemId}-${_vo.needCount}`);
        let _itemVo: ItemVo = this.refreshItem(_vo);
        this.shopBuyStyle.setItemData(this._ui.siderstyle, t1, _itemVo);
    }
}