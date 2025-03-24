import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { RougeChoose_revc, RougeList_revc } from "../../../../network/protocols/BaseProto";
import { ESystemRefreshTime } from "../../main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { ITowerMonster } from "./ITowerMonster";
import { t_Function_Coop } from "./t_Function_Coop";

class GiftViewCell extends ui.views.compose.fightcell.ui_gift_itemUI {
    constructor(){
        super();
    }
    refresh(){
        let id:number = this.dataSource;
        let cfg:Configs.t_Function_Coop_dat = E.tableMgr.getTable(t_Function_Coop.NAME).GetDataById(id);
        if(cfg){
            this.titleLb.text = cfg.f_name;
            this.descLb.text = cfg.f_buff_des;
            this.bg.skin = `remote/friendfight/bottom_zf_${cfg.f_quality}.png`;
            this.icon.skin = `o/pvebuff/${cfg.f_icon}.png`;
        }else{
            this.titleLb.text = id + "";
        }
    }
}
/**弹出 */
export class GiftViewPop extends ViewBase{
    private monster:ITowerMonster;
    private _data:RougeChoose_revc;
    private _ui: ui.views.compose.ui_gift_popUI;
    protected autoFree:boolean = true;
    private cell:GiftViewCell;
    protected onAddLoadRes(): void {
        this.addAtlas("friendfight.atlas");
    }
    protected onExit(): void {
        if(this.monster){
            this.monster.dispose();
            this.monster = null;
        }
    }

    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            // this.centerPtr = ComposeModel.Ins.fightView;
            this.UI = this._ui = new ui.views.compose.ui_gift_popUI();
            this.cell = new GiftViewCell();
            this._ui.addChild(this.cell);
        }
    }

    protected SetCenter(){
        super.SetCenter(ComposeModel.Ins.fightView);
    }

    private onLoadComplete(){
        let monsterSkel:Laya.Sprite = this.monster.skeleton;
        this._ui.avatarcon.addChild(monsterSkel);
        // this.monster.play()
    }
    private get model(){
        return ComposeModel.Ins;
    }

    protected onInit(): void {
        this._data = this.Data;
        if(!this._data){
            this._data = new RougeChoose_revc();
            this._data.playerId = 1;
            this._data.fid = 1;
        }
        // throw new Error("Method not implemented.");
        this.monster = FightFactory.createFrameMonster(0,this,this.onLoadComplete,2,parseInt(this._ui.avatarcon.name));
        this._ui.nameLb.text = E.getLang("pvepop",this.model.getPlayerName(this._data.playerId));
        let cell = this.cell;// Laya.Pool.getItemByClass(this.key,GiftViewCell);
        // this.cell = cell;
        this._ui.addChild(cell);
        cell.dataSource = this._data.fid;
        cell.refresh();
        cell.selImg.visible = false;
        let time = parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.PveBuffTime));
        if(!isNaN(time)){
            Laya.timer.once(time,this,this.Close);
        }
    }

}

export class GiftView extends ViewBase {
    protected mMask: boolean = true;
    protected mMaskClick: boolean = false;
    protected mHitFull:boolean = true;
    private _ui: ui.views.compose.ui_giftUI;
    private _data: RougeList_revc;
    private _timeCtl: TimeCtl;
    private okBtn: ButtonCtl;
    protected autoFree:boolean = true;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas("friendfight.atlas");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this._ui.list1.array = [];
        if (this._timeCtl) {
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
        if(this.okBtn){
            this.okBtn.dispose();
            this.okBtn = null;
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new ui.views.compose.ui_giftUI();
            this._timeCtl = new TimeCtl(this._ui.timeTf);
            this.okBtn = ButtonCtl.CreateBtn(this._ui.okBtn, this, this.onOkHandler);
            this._ui.list1.itemRender = GiftViewCell;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list1.selectEnable = true;
            this._ui.list1.selectHandler = new Laya.Handler(this,this.onSelectHandler);
        }
    }

    private onSelectHandler(index:number){

    }

    private onRenderHandler(cell:GiftViewCell,i:number){
        cell.refresh();
        if(this._ui.list1.selectedIndex == i){
            cell.selImg.visible = true;
        }else{
            cell.selImg.visible = false;
        }
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
        this.Close();
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this._data = this.Data;
        if (this._data) {
            let time = this._data.unix - TimeUtil.serverTime;
            if (time > 0) {
                this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
            } else {
                this._timeCtl.stop();
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
        // this._timeCtl.setText("00:00:00");
        this.Close();
    }
}