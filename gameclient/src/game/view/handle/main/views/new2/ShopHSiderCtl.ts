// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { TowerMainEvent } from "../../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../../towertmain/model/TowerMainModel";
import { IconUtils } from "../../model/IconUtils";
import { MainModel } from "../../model/MainModel";
import { ItemVo } from "../../vos/ItemVo";
export interface IShopBuyStyle{
    /**初始化 */
    setItemData(skin,itemVo: ItemVo,target:ItemVo);
    /**选择的数量 */
    selCount:number;
    /**销毁 */
    destroy();
    /**最大数量检测 */
    maxCheckHandler:Laya.Handler;
}
export class ShopHSiderCtl implements IShopBuyStyle{
    maxCheckHandler:Laya.Handler;
    private readonly maxSiderVal:number = 100;
    // private readonly offsetCount: number = 1;
    private skin:ui.views.common.ui_shop_buy_styleUI;
    /**需要的消耗 */
    private costItemVo: ItemVo;
    /**可以购买的物品 */
    private targetVo:ItemVo;
    private subbtn:ButtonCtl;
    private addbtn:ButtonCtl;
    private bg1Width:number;
    /**选择的数量 */
    private _num:number = 0;
    constructor(bg1Width:number){
        this.bg1Width = bg1Width;
    }
    // private _maxNum:number = 0;
    private init(){
        // this.bg1Width = this.skin.bg1.width;
        this.skin.hs.showLabel = false;
        this.skin.hs.on(Laya.Event.CHANGE, this, this.onChangeHandler);
        this.subbtn = ButtonCtl.CreateBtn(this.skin.subbtn, this, this.onSubHandler);
        this.addbtn = ButtonCtl.CreateBtn(this.skin.addbtn, this, this.onAddHandler);
        TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell, this, this.onValChangeCell);

        this.onValChangeCell(this.targetVo.cfgId);
        Laya.timer.callLater(this,this.btnUpdate);
    }
    private onValChangeCell(id:number){
        if(this.targetVo && id == this.targetVo.cfgId){
            this._num = 1;
            this.skin.hs.value = 0;
            this.onChangeHandler();
        }
    }

    private onAddHandler(){
        if(this._num + 1 > this.maxNum){
        }else{
            this._num++;
            this.btnUpdate();
        }
    }
    private onSubHandler(){
        if(this._num - 1 <= 0){
        }
        else{
            this._num--;
            this.btnUpdate();
        }
    }

    private btnUpdate(){
        this.skin.hs.value = Math.ceil(this._num / this.maxNum * this.maxSiderVal);
        this.updateView();
    }

    /**最大可以选择的数量 */
    private get maxNum(){
        let _maxNum = 999;
        if (this.maxCheckHandler) {
            _maxNum = this.maxCheckHandler.runWith(_maxNum);
        }

        let haveCount = MainModel.Ins.mRoleData.getVal(this.costItemVo.cfgId);
        let num = Math.floor(haveCount / this.costItemVo.count);

        _maxNum = Math.min(_maxNum,num);

        let limitCount: number = this.targetVo.cfg.f_limit_number;
        if (limitCount > 0 && _maxNum > limitCount) {
            _maxNum = limitCount;
        }

        if(_maxNum <= 0){
            _maxNum = 1;
        }

        return _maxNum;
    }

    private onChangeHandler(){
        let haveCount = MainModel.Ins.mRoleData.getVal(this.costItemVo.cfgId);
        let needC: number = this.costItemVo.count * this._num;
        if( haveCount < needC){
            this.skin.hs.value = this.maxSiderVal;
            this._num = 1;
        }else{
            let v = this.skin.hs.value;
            // if(v <=0) v = 1;
            this._num = Math.floor(this.maxNum * v/this.maxSiderVal);
            if(this._num < 1){
                this._num = 1;
            }
        }
        
        this.updateView();
    }

    private updateView(){
        let haveCount = MainModel.Ins.mRoleData.getVal(this.costItemVo.cfgId);
        let needC: number = this.costItemVo.count * this._num;
        this.skin.icon.skin = IconUtils.getIconByCfgId(this.costItemVo.cfgId);
        this.skin.lab_m.text = `${needC}/${haveCount}`;
    
        if (haveCount >= needC) {
            this.skin.lab_m.color = "#67ff64";
        } else {
            this.skin.lab_m.color = "#f91309";
        }
        //===========================================================
        let _addDisable:boolean = false;
        let _subDisable:boolean = false;
        if(this._num + 1 > this.maxNum){
            _addDisable = true;
        }

        if(this._num - 1 <= 0){
            _subDisable = true;
        }
        this.addbtn.grayMouseDisable = _addDisable;
        this.subbtn.grayMouseDisable = _subDisable;

        this.skin.bg1.width = this.bg1Width * this.skin.hs.value/this.maxSiderVal;
        this.skin.countTf.text = `数量:${this.selCount}`;
        this.resetUIpos();
    }

    private resetUIpos(){
        let ow:number = this.skin.icon.width + this.skin.lab_m.textField.textWidth;
        let ox:number = (this.skin.width - ow)/2;
        this.skin.icon.x = ox;
        this.skin.lab_m.x = this.skin.icon.x + this.skin.icon.width * this.skin.icon.scaleX;
    }

    destroy(){
        this.skin.hs.off(Laya.Event.CHANGE,this,this.onChangeHandler);
        TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell,this,this.onValChangeCell);
        this.costItemVo = null;
        this.targetVo = null
        this.subbtn.dispose();
        this.addbtn.dispose();
        this.skin = null;
    }
    
    setItemData(skin,itemVo: ItemVo,target:ItemVo) {
        this.skin = skin;
        this.targetVo = target;
        this.costItemVo = itemVo;
        this.init();
    }
    get selCount() {
        return this._num;
    }

}