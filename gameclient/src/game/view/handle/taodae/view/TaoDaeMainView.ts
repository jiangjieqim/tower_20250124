import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType, EViewType } from "../../../../common/defines/EnumDefine";
import { E, ScreenAdapter } from "../../../../G";
import { ActivityExchange_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { ActivityModel } from "../../activity/ActivityModel";
import { DotManager } from "../../common/DotManager";
import { IShopBuyItem } from "../../common/ShopBuyView";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { ValCtl } from "../../main/ctl/ValLisCtl";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ECellType } from "../../main/vos/ECellType";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { TaodaeEvent } from "../model/TaodaeEvent";
import { TaoDaeModel } from "../model/TaoDaeModel";
/**套大鹅主入口 */
export class TaoDaeMainView extends ViewBase {

    PageType:EPageType = EPageType.None;
    protected autoFree: boolean = true;
    protected mHitFull: boolean = true;
    protected mMask:boolean = true;
    private _ui: ui.views.taodae.ui_taodae_tab_mainUI;
    private btn_close: ButtonCtl;
    private moneyCtl:ValCtl;
    private _initBg3_y:number = 0;
    private _mainTabCtl: ITabControl;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas("taodae.atlas");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.onRedHandler);
        this.model.off(TaodaeEvent.TaskChange,this,this.onRedHandler);
        this.model.off(TaodaeEvent.UpdateBigPrize,this,this.onRedHandler);
        if(this._mainTabCtl){
            this._mainTabCtl.dispose();
            this._mainTabCtl = null;
        }
        this.closeAllView();
    }

    private onBuyTaoQuan(){
        this.model.okBuy();
    }

    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new ui.views.taodae.ui_taodae_tab_mainUI();
            this.btn_close = ButtonCtl.CreateBtn(this._ui.btn_close, this, this.Close);
            this.moneyCtl = ValCtl.Create(this._ui.money1.lab,this._ui.money1.icon,ECellType.TaoQuan,this._ui.money1.sp);
            this.moneyCtl.clickHandler = new Laya.Handler(this,this.onBuyTaoQuan);
            this._initBg3_y = this._ui.img_bg3.y;
            //===========================================================
            for(let i = 0;i < 3;i++){
                this._ui[`tab${i}`].icon.skin = `remote/taodae/tab${i}.png`;
            }
            this._mainTabCtl = TabControl.createTabCtl([this._ui.tab0, this._ui.tab1,this._ui.tab2],
                [
                    { color: "#FFCAB7", strokeColor: "#794437", skin: "remote/taodae/btn_s_zsbz1.png" },
                    { color: "#FFCAB7", strokeColor: "#794437", skin: "remote/taodae/btn_n_zsbz.png" },
                ],
                new Laya.Handler(this, this.onMainSelectHandler), E.getLang("taddae_tabs")
            );
            //===========================================================
        }
    }
    private onMainSelectHandler(index:number){
        this.closeAllView();
        E.ViewMgr.Open(this.tabs[index],null,index,this._ui.con1);
    }
    private get tabs(){
        let arr:EViewType[] = [EViewType.TaoDaeView,EViewType.TaoDaePackageView,EViewType.TaoDaePackageView];
        return arr;
    }
    private closeAllView(){
        let arr = this.tabs;
        for(let i = 0;i < arr.length;i++){
            E.ViewMgr.Close(arr[i]);
        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onRedHandler);
        this.model.on(TaodaeEvent.TaskChange,this,this.onRedHandler);
        this.model.on(TaodaeEvent.UpdateBigPrize,this,this.onRedHandler);
        this._mainTabCtl.selectIndex = 0;
        this.onRedHandler();
    }

    private onRedHandler(){
        if(!this.model.hasSelBigPrize){
            DotManager.addDot(this._ui.tab0);
        }else{
            DotManager.removeDot(this._ui.tab0);
        }
        if(this.model.taskCanGet){
            DotManager.addDot(this._ui.tab1);
        }else{
            DotManager.removeDot(this._ui.tab1);
        }
        if(this.model.freeCanGet){
            DotManager.addDot(this._ui.tab2);
        }else{
            DotManager.removeDot(this._ui.tab2);
        }

    }

    protected SetCenter() {
        super.SetCenter()
        this._ui.con1.x = this.UI.width/2;
        this._ui.con1.y = this.UI.height/2;
        let y = (Laya.stage.height - ScreenAdapter.DefaultHeight) / 2;
        if (y) {
            this._ui.img_bg3.y = this._initBg3_y + y;
        }
    }

    private get model(){
        return TaoDaeModel.Ins;
    }
}