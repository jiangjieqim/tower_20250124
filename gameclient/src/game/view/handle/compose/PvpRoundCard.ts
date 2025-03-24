import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { EPageType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { RougeChoose_revc, RougeList_revc } from "../../../network/protocols/BaseProto";
import { ISimpleEffect } from "../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";
import { System_RefreshTimeProxy } from "../main/ctl/System_RefreshTimeProxy";
import { ComposeModel } from "./ComposeModel";
import { t_Function_Coop } from "./views/t_Function_Coop";
class PvpRoundCell extends ui.views.compose.ui_pvpround_sel_cellUI{
    private eff:ISimpleEffect;
    private btn:ButtonCtl;
    constructor(){
        super();
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        this.btn = ButtonCtl.CreateBtn(this.bg,this,this.onBgClick,false);
    }

    private onBgClick(){

    }
    private disposeEff(){
        if(this.eff){
            this.eff.dispose();
            this.eff = null;
        }
    }
    private onUnDisplay(){
        // LogSys.Log(`PvpRoundCell onUnDisplay...`);
        this.disposeEff();
    }
    refresh(){
        let id:number = this.dataSource;
        DebugUtil.drawTF(this,id+"");
        let cfg:Configs.t_Function_Coop_dat = E.tableMgr.getTable(t_Function_Coop.NAME).GetDataById(id);
        this.icon.cfg = cfg;
        this.bg.skin = `remote/pvpround/img${this.icon.qua}.png`;
        this.nameTf.text = cfg.f_name;
        this.descTf.text = cfg.f_buff_des;
    }

    set selected(v:boolean){
        if(v){
            if(!this.eff){
                this.eff = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/sanxuanyi/sanxuanyi`,this,this.width/2,this.height/2);
            }
        }else{
            this.disposeEff();
        }
    }
}
/**单独弹出选择的肉鸽选项 */
export class PvpRoundCardPop extends ViewBase{
    protected autoFree:boolean = true;

    private _ui:PvpRoundCell;
    protected mShowUpdate:boolean = true;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas("pvpround.atlas");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new PvpRoundCell();
        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        let revc: RougeChoose_revc = this.Data;
        this._ui.dataSource = revc.fid;
        this._ui.refresh();
        let time = parseInt(System_RefreshTimeProxy.Ins.getVal(106));
        if(!isNaN(time)){
            Laya.timer.once(time,this,this.Close);
        }
    }
}

/**PVP回合制肉鸽卡牌 */
export class PvpRoundCard extends ViewBase {
    PageType:EPageType = EPageType.None;
    private _data: RougeList_revc;
    private _timeCtl: TimeCtl;

    protected maskAlpha:number = 0.5;
    protected mMask: boolean = true;
    protected autoFree: boolean = true;
    protected mHitFull: boolean = true;
    private _ui: ui.views.compose.ui_pvpround_cardUI;
    private okBtn: ButtonCtl;
    private minBtn: ButtonCtl;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas("pvpround.atlas");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this._ui.list1.array = [];
        if (this._timeCtl) {
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
        if (this.okBtn) {
            this.okBtn.dispose();
            this.okBtn = null;
        }
        if (this.minBtn) {
            this.minBtn.dispose();
            this.minBtn = null;
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new ui.views.compose.ui_pvpround_cardUI();
            this.okBtn = ButtonCtl.CreateBtn(this._ui.ok_btn, this, this.onOkHandler);
            this.minBtn = ButtonCtl.CreateBtn(this._ui.min_btn, this, this.onMinHandler);
            this._timeCtl = new TimeCtl(this._ui.timeTf);
            this._ui.list1.itemRender = PvpRoundCell;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list1.selectEnable = true;
            this._ui.list1.selectHandler = new Laya.Handler(this,this.onSelectHandler);
        }
    }

    private onRenderHandler(cell:PvpRoundCell,i:number){
        cell.refresh();
        if(this._ui.list1.selectedIndex == i){
            cell.selected = true;
        }else{
            cell.selected = false;
        }
    }

    private onSelectHandler(index:number){

    }

    private onMinHandler() {
        this._ui.con1.visible = !this._ui.con1.visible;     
        let arr = E.getLang(`pvpround_cardarr`).split("|");
        let index = this._ui.con1.visible ? 0 : 1 
        this._ui.tf1.text = arr[index];
        this._ui.min_btn.skin = `remote/pvpround/icon_sq${index}.png`;
    }

    private get model(){
        return ComposeModel.Ins;
    }

    private onOkHandler() {
        if(this._data){
            let id = this._data.datalist[this._ui.list1.selectedIndex];
            if(id){
                this.model.curAdapter.rougeSel(id);
            }
        }
        Laya.timer.callLater(this,this.Close);
    }

    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this._data = this.Data;
        if (this._data) {
            if(this._data.unix != 0){
                this._ui.timeImg.visible = true;
                let time = this._data.unix - TimeUtil.serverTime;
                if (time > 0) {
                    this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
                } else {
                    this._timeCtl.stop();
                }
            }else{
                this._ui.timeImg.visible = false;
            }
            this._ui.list1.array = this._data.datalist;
            this._ui.list1.selectedIndex = 0;
        }
    }
    private onUpdateTime() {
        let time_str = TimeUtil.subTime(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }
    private endTime() {
        this.Close();
    }
}